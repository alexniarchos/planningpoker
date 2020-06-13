const rooms = [];

function getRoom(id) {
  return rooms.find(r => r.id === id);
}

function getRoomIndex(id) {
  return rooms.findIndex(r => r.id === id);
}

function setRoom(id, room) {
  const roomIndex = getRoomIndex(id);
  if (roomIndex === -1) {
    rooms.push(room);
    return;
  }
  rooms[roomIndex] = {
    ...rooms[roomIndex],
    ...room
  }
}

module.exports = {getRoom, getRoomIndex, setRoom, rooms};