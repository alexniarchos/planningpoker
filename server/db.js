const mongoClient = require('mongodb').MongoClient;

let db;

function initDB() {
  mongoClient.connect("mongodb://localhost:27017/planningPokerDB", {useUnifiedTopology: true}, async function (err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    db = client.db();

    // clear collections
    const collections = await db.collections();
    if(collections.map(c => c && c.s.namespace.collection).includes('users')) {
      db.collection('users').drop();
    }
    if(collections.map(c => c && c.s.namespace.collection).includes('rooms')) {
      db.collection('rooms').drop();
    }

    console.log("Database connection ready");
  });
}

function insertUser(id, user) {
  db.collection('users').insertOne({id, ...user});
}

function deleteUser(id) {
  db.collection('users').deleteOne({id});
}

function updateUser(id, user) {
  db.collection('users').updateOne({id}, {$set: user});
}

function insertRoom(id, room) {
  db.collection('rooms').insertOne({id, ...room});
}

function deleteRoom(id) {
  db.collection('rooms').deleteOne({id});
}

function updateRoom(id, room) {
  console.log(id, room);
  db.collection('rooms').updateOne({id}, {$set: room});
}

module.exports = {
  initDB,
  insertUser,
  deleteUser,
  updateUser,
  insertRoom,
  deleteRoom,
  updateRoom
};
