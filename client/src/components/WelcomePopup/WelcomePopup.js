import {mapState} from 'vuex';
import {getRandomColor} from '../../utils/colors';
import {generateId, generateName} from '../../utils/random';

export default {
  data() {
    return {
      currentRoomId: '',
      currentName: '',
      isVisible: true
    };
  },
  computed: {
    ...mapState({
      socket: state => state.socket,
      name: state => state.name
    })
  },
  methods: {
    onSubmit() {
      if (!this.currentName) {
        this.currentName = generateName();
      }
      if (!this.currentRoomId) {
        this.currentRoomId = generateId(8);
      }

      this.$store.commit('setName', this.currentName);
      localStorage.setItem('name', this.currentName);
      this.$store.commit('setRoomId', this.currentRoomId);
      localStorage.setItem('roomId', this.currentRoomId);

      this.socket.emit('joinRoom', {
        user: {
          room: this.currentRoomId,
          name: this.currentName,
          color: getRandomColor()
        }
      });

      if(this.$route.params.roomId !== this.currentRoomId){
        this.$router.push(`/${this.currentRoomId}`);
      }
      this.isVisible = false;
    }
  },
  mounted() {
    const name = localStorage.getItem('name');
    if (name) {
      this.currentName = name;
      this.$store.commit('setName', name);
    }
    this.currentRoomId = this.$route.params.roomId || localStorage.getItem('roomId') || '';

    if(this.$route.params.roomId && name){
      this.$nextTick(() => {
        this.socket.emit('joinRoom', {
          user: {
            room: this.currentRoomId,
            name: this.currentName,
            color: getRandomColor()
          }
        });
      });
      this.isVisible = false;
    }
  }
}
