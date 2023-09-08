const vm = Vue.createApp({
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      console.log(`${this.username} ${this.password}`);
      // return `${this.firstName} ${this.middleName} ${this.lastName}`;
    },
  },
  computed: {},
  watch: {},
}).mount('#app');
