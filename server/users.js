const {setRoom, getRoom, getRoomIndex, rooms} = require('./rooms');

const users = [];

// Join user to chat
function userJoin(id, name, room) {
  const user = { id, name, room };

  users.push(user);
  if (!getRoom(room)) {
    setRoom(room, {
      id: room,
      showVotes: false
    });
  }

  return user;
}

function getUser(id) {
  return users.find(user => user.id === id);
}

function getUserIndex(id) {
  return users.findIndex(user => user.id === id);
}

function setUser(id, user) {
  const userIndex = getUserIndex(id);
  users[userIndex] = {
    ...users[userIndex],
    ...user
  };
} 

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return;
  }

  const roomIndex = getRoomIndex(users[index].room);
  if (roomIndex !== -1 && getRoomUsers(users[index].room).length === 1) {
    rooms.splice(roomIndex, 1);
  }

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function getAllUsers() {
  return users;
}

module.exports = {
  userJoin,
  getUser,
  setUser,
  userLeave,
  getRoomUsers,
  getAllUsers
};
