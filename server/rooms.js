const {insertRoom, deleteRoom, updateRoom} = require('./db');

const rooms = [];

function getRoom(id) {
  return rooms.find(r => r.id === id);
}

function getRoomIndex(id) {
  return rooms.findIndex(r => r.id === id);
}

function createRoom(id, room) {
  const roomIndex = getRoomIndex(id);

  if (roomIndex === -1) {
    rooms.push(room);
    insertRoom(id, room);
    return;
  }
}

function removeRoom(id) {
  const roomIndex = getRoomIndex(id);
  rooms.splice(roomIndex, 1);
  deleteRoom(id);
}

function setRoom(id, room) {
  const roomIndex = getRoomIndex(id);

  if (roomIndex === -1) {
    rooms.push(room);
    updateRoom(id, room);
    return;
  }
  rooms[roomIndex] = {
    ...rooms[roomIndex],
    ...room
  }

  updateRoom(id, room);
}

module.exports = {getRoom, getRoomIndex, createRoom, removeRoom, setRoom, rooms};
