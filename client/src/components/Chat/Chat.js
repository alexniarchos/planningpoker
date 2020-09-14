import {mapState} from 'vuex';
import {getUserById} from '../../utils/users';

export default {
  data() {
    return {
      chatInput: '',
      chatMessages: [],
      isChatOpen: true
    };
  },
  computed: {
    ...mapState({
      socket: state => state.socket,
      users: state => state.users
    })
  },
  methods: {
    getUserById,
    onSendClick() {
      if (!this.chatInput) {
        return;
      }
      this.socket.emit('message', {
        message: this.chatInput,
      });
      this.chatInput = '';
    },
    formatUsername(message) {
      if (message.senderId === 'Server') {
        return message.senderId;
      }
      const user = getUserById(this.users, message && message.senderId);
      return user && user.name || 'Anonymous';
    },
    usernameStyle(userId) {
      if(userId === 'Server') {
        return '';
      }
      const user = getUserById(this.users, userId);
      return `background-color: ${user.color}`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.socket.on('roomMessage', message => {
        this.chatMessages.push(message);
      });

      this.socket.on('roomMessages', messages => {
        this.chatMessages = messages;
      });
    });
  },
  watch: {
    chatMessages() {
      this.$nextTick(() => {
        this.$refs['chat-messages'].scrollTop = this.$refs['chat-messages'].scrollHeight;
      })
    },
    isChatOpen(val) {
      if(val){
        this.$nextTick(() => {
          this.$refs['chat-messages'].scrollTop = this.$refs['chat-messages'].scrollHeight;
        })
      }
    }
  }
}
