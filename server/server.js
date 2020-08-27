const expressApp = require('express')();
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const {
  userJoin,
  getUser,
  setUser,
  userLeave,
  getRoomUsers,
  getAllUsers
} = require('./users');
const {getRoom, setRoom, rooms} = require('./rooms');

dotenv.config();
expressApp.use(cors());

const server = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/planning-poker.alexniarchos.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/planning-poker.alexniarchos.com/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/planning-poker.alexniarchos.com/chain.pem')
}, expressApp);
const io = require('socket.io')(server);

setInterval(() => {
  console.log('\nusers', getAllUsers());
  console.log('rooms', rooms);
}, 3000);

io.on('connection', socket => {
  socket.on('joinRoom', ({user}) => {
    console.log(user);
    if (getUser(socket.id)) {
      userLeave(socket.id)
    }
    console.log(`${user.name} joined room ${user.room}`);
    socket.join(user.room);
    userJoin(socket.id, user);

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

server.listen(process.env.SOCKET_PORT);
