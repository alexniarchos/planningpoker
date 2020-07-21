import io from 'socket.io-client';
import {generateId, generateName} from '../utils/random';

const socket = io(`${process.env.VUE_APP_SERVER_URL}:${process.env.VUE_APP_SOCKET_PORT}`);
const TABLE_RADIUS = 150;

export default {
  mounted() {
    this.roomId = generateId(8);
    this.newRoomId = this.roomId;

    this.userName = generateName();
    this.newUserName = this.userName;
    socket.emit('joinRoom', {
      user: {
        room: this.roomId,
        name: this.userName,
      },
    });

    socket.on('roomMessage', (message) => {
      this.chatMessages.push(message);
    });

    socket.on('roomUsers', (data) => {
      this.users = data.users;
    });

    socket.on('roomRevealVotes', (userVotes) => {
      userVotes.forEach((userVote) => {
        this.setUserById(userVote.id, {
          vote: userVote.vote,
        });
      });
      this.revealVotes = true;
    });

    socket.on('roomClearVotes', () => {
      this.users.forEach((user) => {
        this.setUserById(user.id, {
          vote: null,
          hasVoted: false,
        });
      });
      this.revealVotes = false;
      this.selectedCardIndex = null;
    });

    socket.on('roomVoteHidden', ({hasVoted, senderId}) => {
      this.setUserById(senderId, {
        hasVoted,
      });
    });

    socket.on('roomVote', ({hasVoted, senderId}) => {
      this.setUserById(senderId, {
        hasVoted,
      });
    });

    socket.on('roomShowVotes', (users) => {
      users.forEach((user) => {
        if (!this.getUserById(user.id)) {
          return;
        }
        this.setUserById(user.id, {vote: user.vote});
      });
    });

    socket.on('roomChangeUserName', (user) => {
      this.setUserById(user.id, {
        name: user.name,
      });
    });
  },
  data() {
    return {
      users: [],
      roomId: 123,
      newRoomId: '',
      userName: '',
      newUserName: '',
      cards: [1, 2, 3, 5, 8, 13],
      selectedCardIndex: null,
      chatInput: '',
      chatMessages: [],
      revealVotes: false,
    };
  },
  methods: {
    userIconStyle(index) {
      debugger;
      const x =
        TABLE_RADIUS * Math.sin((180 + index * (360 / this.users.length)) * (Math.PI / 180));
      const y =
        TABLE_RADIUS * Math.cos((180 + index * (360 / this.users.length)) * (Math.PI / 180));
      console.log(x, y);
      return `transform: translateX(${x}px) translateY(${y}px)`;
    },
    userNameStyle() {
      // return `transform: rotate(${180 - (index * 360) / this.users.length}deg)`;
    },
    selectCard(index) {
      if (this.selectedCardIndex === index) {
        this.selectedCardIndex = null;
        socket.emit('vote', {
          vote: this.selectedCardIndex,
        });
        return;
      }

      this.selectedCardIndex = index;
      socket.emit('vote', {
        vote: this.selectedCardIndex,
      });
    },
    onSendClick() {
      if (!this.chatInput) {
        return;
      }
      socket.emit('message', {
        message: this.chatInput,
      });
      this.chatInput = '';
    },
    getUserById(id) {
      return this.users.find((user) => user.id === id);
    },
    getUserIndexById(id) {
      return this.users.findIndex((user) => user.id === id);
    },
    setUserById(id, user) {
      const userIndex = this.getUserIndexById(id);
      this.$set(this.users, userIndex, {
        ...this.users[userIndex],
        ...user,
      });
    },
    onRevealClick() {
      if (!this.revealVotes) {
        socket.emit('showVotes');
        return;
      }
      socket.emit('clearVotes');
    },
    onRoomChange() {
      this.roomId = this.newRoomId;
      socket.emit('joinRoom', {
        user: {
          room: this.roomId,
          name: this.userName,
        },
      });
    },
    onUserNameChange() {
      if (this.newUserName === '') {
        this.newUserName = this.userName;
        return;
      }

      this.userName = this.newUserName;
      socket.emit('changeName', this.userName);
    },
    getUserInitials(name) {
      const nameSplit = name.toUpperCase().split(' ');
      const firstInitial = (nameSplit[0] && nameSplit[0].charAt(0)) || '';
      const secondInitial = (nameSplit[1] && nameSplit[1].charAt(0)) || '';
      return `${firstInitial}${secondInitial}`;
    },
  },
  computed: {
    userId() {
      return socket.id;
    },
    showRevealButton() {
      if (this.revealVotes) {
        return true;
      }
      return this.users.some((user) => user.hasVoted);
    },
    revealText() {
      return this.revealVotes ? 'Clear' : 'Reveal';
    },
    roomIdStyle() {
      return `width: ${this.newRoomId.length * 12}px`;
    },
    userNameWidth() {
      return `width: ${this.newUserName.length * 12}px`;
    },
  },
};
