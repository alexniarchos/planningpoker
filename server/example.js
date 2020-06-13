const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();

// NODE VUE
app = express();
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
var port = process.env.PORT || process.env.NODE_PORT;
app.listen(port);

console.log('Planning poker server started '+ port);

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
const db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", {useUnifiedTopology: true}, (err, client) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");
});

// routes
app.post('/api/message', (req, res) => {
  const id = generateId(10);
  console.log('node server', req.body, id);
  // write request on db
  db.collection('messages').insertOne({id, sender: req.body.sender});
  res.send();
});

app.get('/api/message', (req, res) => {
  // search db for message
  db.collection('messages').findOne({'id': req.query.id},{projection:{'id':1, 'question': 1, 'answer': 1}}).then(doc=>{
    console.log(doc);
    if(doc && doc.id && (!doc.answer || doc.answer === '')){
      res.status(200).json(doc);
      return;
    }
    res.status(404).send('Sorry, we cannot find that!');
  });
});

app.put('/api/message', (req, res) => {
  // write request on db
  db.collection('messages').findOne({'id': req.body.id}, (err,doc)=>{
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      db.collection('messages').updateOne({id: req.body.id}, {$set:{answer: req.body.answer}});
      res.status(200).json(doc);
    }
  });
});