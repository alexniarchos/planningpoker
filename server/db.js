const mongoClient = require('mongodb').MongoClient;

let db;

function initDB() {
  mongoClient.connect("mongodb://localhost:27017/planningPokerDB", {useUnifiedTopology: true}, async function (err, client) {
    if (err) {
      console.log(err);
    }

    db = client.db();

    // clear collections
    const collections = await db.collections();
    const collectionsMap = collections.map(c => c && c.s.namespace.collection);

    if(collectionsMap.includes('users')) {
      db.collection('users').drop();
    }
    if(collectionsMap.includes('rooms')) {
      db.collection('rooms').drop();
    }

    console.log("Database connection ready");
  });
}

async function insertUser(id, user) {
  try {
    await db.collection('users').insertOne({id, ...user});
  }
  catch(err) {
    console.log(err);
  }
}

async function deleteUser(id) {
  try {
    await db.collection('users').deleteOne({id});
  }
  catch(err) {
    console.log(err);
  }
}

async function updateUser(id, user) {
  try {
    await db.collection('users').updateOne({id}, {$set: user});
  }
  catch(err) {
    console.log(err);
  }
}

async function insertRoom(id, room) {
  try {
    await db.collection('rooms').insertOne({id, ...room});
  }
  catch(err) {
    console.log(err);
  }
}

async function deleteRoom(id) {
  try {
    await db.collection('rooms').deleteOne({id});
  }
  catch(err) {
    console.log(err);
  }
}

async function updateRoom(id, room) {
  try {
    await db.collection('rooms').updateOne({id}, {$set: room});
  }
  catch(err) {
    console.log(err);
  }
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
