const expressApp = require('express')();
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const sanitizeHtml = require('sanitize-html');
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

let server;
if (process.env.isTest) {
  server = http.createServer({}, expressApp);
} else {
  server = https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
    ca: fs.readFileSync(process.env.SSL_CA)
  }, expressApp);
}

const io = require('socket.io')(server);

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

    io.to(user.room).emit('roomMessage', {
      senderId: 'Server',
      text: `Welcome <b><u>${sanitizeHtml(user.name)}</u></b> ❤️`
    });
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('roomMessage', {
        senderId: 'Server',
        text: `Goodbye <b><u>${sanitizeHtml(user.name)}</u></b> 👋`
      });

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

  socket.on('message', ({message}) => {
    const user = getUser(socket.id);

    const sanitizedMessage = sanitizeHtml(message);
    if (!sanitizedMessage) {
      return;
    }

    io.to(user.room).emit('roomMessage', {
        text: sanitizedMessage,
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
