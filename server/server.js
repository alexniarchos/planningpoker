const express = require('express');
const app = express();
const cors = require('cors');
const {
  userJoin,
  getUser,
  setUser,
  userLeave,
  getRoomUsers,
  getAllUsers
} = require('./users');

const {getRoom, setRoom, rooms} = require('./rooms');
// const bodyParser = require('body-parser');
// app.use(cors());
// app.use(bodyParser.json())
// app.listen(process.env.PORT);

const http = require('http').Server(app);
const io = require('socket.io')(http);
const dotenv = require('dotenv');
dotenv.config();

http.listen(process.env.SOCKET_PORT, () => {
  console.log(`Planning poker server started on port: ${process.env.SOCKET_PORT}`);
});

setInterval(() => {
  console.log('\nusers', getAllUsers());
  console.log('rooms', rooms);
}, 3000);

io.on('connection', socket => {
  socket.on('joinRoom', ({user}) => {
    if (getUser(socket.id)) {
      userLeave(socket.id)
    }
    console.log(`${user.name} joined room ${user.room}`);
    socket.join(user.room);
    userJoin(socket.id, user.name, user.room);

    const room = getRoom(user.room);
    let roomUsers;

    if (room.showVotes) {
      roomUsers = getRoomUsers(user.room)
    } else {
      roomUsers = getRoomUsers(user.room).map(user => ({
        ...user,
        vote: null 
      }));
    }

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: roomUsers
    });

    if (room.showVotes) {
      io.to(user.room).emit('roomRevealVotes', getAllUsers().map(user => ({id: user.id, vote: user.vote})));
    }
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'roomMessage',
        console.log(`${user.name} has left the room`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

  socket.on('message', ({message}) => {
    console.log('Received message', message, getAllUsers());
    const user = getUser(socket.id);
    io.to(user.room).emit('roomMessage', {
      text: message,
      senderId: socket.id
    });
  });

  socket.on('vote', ({vote}) => {
    const user = getUser(socket.id);

    setUser(socket.id, {
      vote,
      hasVoted: vote !== null ? true : false,
    });

    io.to(user.room).emit('roomVote', {
      hasVoted: vote !== null ? true : false,
      senderId: socket.id
    });
  });

  socket.on('showVotes', () => {
    const user = getUser(socket.id);

    io.to(user.room).emit('roomRevealVotes', getAllUsers().map(user => ({id: user.id, vote: user.vote})));
    setRoom(user.room, {showVotes: true});
  });

  socket.on('clearVotes', () => {
    const user = getUser(socket.id);

    io.to(user.room).emit('roomClearVotes');
    setRoom(user.room, {showVotes: false});
    const roomUsers = getRoomUsers(user.room);
    roomUsers.forEach(user => {
      setUser(user.id, {
        hasVoted: false,
        vote: null
      });
    });
  });

  socket.on('changeName', name => {
    const user = getUser(socket.id);
    setUser(user.id, {
      name
    });
    io.to(user.room).emit('roomChangeUserName', {
      id: user.id,
      name
    });
  })
})
