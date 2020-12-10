import io from 'socket.io-client';
import {mapState} from 'vuex';
import {getUserById, getUserIndexById} from '../utils/users';
import WelcomePopup from '../components/WelcomePopup/WelcomePopup.vue';
import Chat from '../components/Chat/Chat.vue';
import Tooltip from '../components/Tooltip/Tooltip.vue';

const socket = io(`${process.env.VUE_APP_SERVER_URL}:${process.env.VUE_APP_SOCKET_PORT}`, {secure: true});
const TABLE_RADIUS = 210;

export default {
  components: {
    WelcomePopup,
    Chat,
    Tooltip
  },
  data() {
    return {
      gitHash: process.env.VUE_APP_GIT_HASH,
      time: '',
      newRoomId: '',
      newUserName: '',
      cards: ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', '∞', '☕', '?'],
      selectedCardIndex: null,
      revealVotes: false,
      cardsVisible: true,
      usernameFocused: false,
      roomIdFocused: false
    };
  },
  mounted() {
    this.$store.commit('setSocket', socket);
    const roomId = this.$route.params.roomId || '';
    const shortRoomId = roomId.substring(0, 20);

    if (shortRoomId !== roomId) {
      this.$router.push(`/${roomId}`);
    }

    this.$store.commit('setRoomId', shortRoomId || '');
    localStorage.setItem('roomId', shortRoomId || '')
    this.$store.commit('setName', localStorage.getItem('name') || '');

    this.setTime();
    setInterval(() => this.setTime(), 1000);

    this.$nextTick(() => {
      this.userName = this.name;
      this.newUserName = this.name;

      this.newRoomId = this.roomId;
    });

    socket.on('roomUsers', (data) => {
      this.$store.commit('setUsers', data.users);
    });

    socket.on('roomRevealVotes', (userVotes) => {
      userVotes.forEach((userVote) => {
        this.setUserById(userVote.id, {
          vote: userVote.vote
        });
      });
      this.revealVotes = true;

      this.cardsVisible = false;
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
      this.cardsVisible = true;
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
        if (!getUserById(this.users, user.id)) {
          return;
        }
        this.setUserById(user.id, {vote: user.vote});
      });
    });

    socket.on('roomChangeUserName', (user) => {
      this.setUserById(user.id, {
        name: user.name
      });
    });
  },
  methods: {
    setTime() {
      function concatZero(timeFrame) {
        return timeFrame < 10 ? '0'.concat(timeFrame) : timeFrame
      }

      const date = new Date();
      const minutes = date.getMinutes();
      const hours = date.getHours();

      this.time = `${concatZero((hours % 12) || 12)}:${concatZero(minutes)}`;
    },
    userIconStyle(user, index) {
      const deg = (index * (360 / this.users.length)) * Math.PI/180;
      const x = -1 * TABLE_RADIUS * Math.sin(deg);
      const y = TABLE_RADIUS * Math.cos(deg);
      const zIndex = Math.round(Math.abs((index + 1) - this.users.length/2));
      return `transform: translateX(${x}px) translateY(${y}px);
              background-color: ${user.color};
              border-color: ${user.color};
              z-index: ${zIndex}`;
    },
    cardStyle(user) {
      const index = this.users.findIndex(u => u.id === user.id);
      const deg = index * (360 / this.users.length);
      return `transform: rotate(${deg}deg) translateY(-100px)`;
    },
    isCardNumberReversed(user) {
      const index = this.users.findIndex(u => u.id === user.id);
      const deg = index * (360 / this.users.length);
      return deg > 90 && deg < 270;
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
        vote: this.cards[index],
      });
    },
    setUserById(id, user) {
      const userIndex = getUserIndexById(this.users, id);
      this.$set(this.users, userIndex, {
        ...this.users[userIndex],
        ...user
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
      if (!this.newRoomId || this.roomId === this.newRoomId) {
        this.newRoomId = this.roomId;
        return;
      }
      this.$store.commit('setRoomId', this.newRoomId.trim());
      window.location = `/${this.roomId}`;
      socket.emit('joinRoom', {
        user: {
          room: this.roomId,
          name: this.userName,
        },
      });
    },
    onRoomIdClick() {
      const roomIdInput = this.$refs['room__id-input'];
      const roomIdDiv = this.$refs['room__id-div'];
      const temp = roomIdDiv.clientWidth;
      this.roomIdFocused = true;
      this.$nextTick(() => {
        roomIdInput.style.width = `${temp - 16}px`;
        roomIdInput.select();
      });
    },
    onRoomIdBlur() {
      if (!this.newRoomId) {
        this.newRoomId = this.roomId;
      }
      this.roomIdFocused = false;
    },
    onUserNameChange() {
      if (!this.newUserName) {
        this.newUserName = this.userName;
        return;
      }

      this.newUserName = this.newUserName.trim();
      this.userName = this.newUserName;
      socket.emit('changeName', this.userName);
      this.$store.commit('setName', this.userName);
      localStorage.setItem('name', this.userName);
    },
    onUserNameClick() {
      const usernameInput = this.$refs['username-input'];
      const usernameDiv = this.$refs['username-div'];
      const temp = usernameDiv.clientWidth;
      this.usernameFocused = true;
      this.$nextTick(() => {
        usernameInput.style.width = `${temp - 16}px`;
        usernameInput.select();
      });
    },
    onUserNameBlur() {
      this.usernameFocused = false;
      this.onUserNameChange();
    },
    onWelcomeSubmit() {
      this.userName = this.name;
      this.newUserName = this.name;

      this.newRoomId = this.roomId;
    },
    getUserInitials(name) {
      if (!name) {
        return '';
      }
      const nameSplit = name.toUpperCase().split(' ');
      const firstInitial = (nameSplit[0] && nameSplit[0].charAt(0)) || '';
      const secondInitial = (nameSplit[1] && nameSplit[1].charAt(0)) || '';
      return `${firstInitial}${secondInitial}`;
    }
  },
  computed: {
    ...mapState({
      name: state => state.name,
      roomId: state => state.roomId,
      users: state => state.users
    }),
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
    }
  }
};
