const {getRoom, getRoomIndex, createRoom, removeRoom, rooms} = require('./rooms');
const {insertUser, deleteUser, updateUser, insertRoom} = require('./db');

const users = [];

function userJoin(id, user) {
  const userWithId = {id, ...user};
  const {room} = user; 

  users.push(userWithId);
  if (!getRoom(room)) {
    const newRoom = {
      id: room,
      showVotes: false
    };

    createRoom(room, newRoom);
  }

  insertUser(id, user);

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

  updateUser(id, user);
} 

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return;
  }

  const roomIndex = getRoomIndex(users[index].room);
  // last user left so delete the room
  if (roomIndex !== -1 && getRoomUsers(users[index].room).length === 1) {
    removeRoom(users[index].room);
    rooms.splice(roomIndex, 1);
  }

  if (index !== -1) {
    deleteUser(id);
    return users.splice(index, 1)[0];
  }
}

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
