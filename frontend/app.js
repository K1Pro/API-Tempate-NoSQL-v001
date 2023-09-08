const vm = Vue.createApp({
  data() {
    return {
      username: '',
      password: '',
      loginResponse: '',
      servrURL:
        'http://192.168.54.22/php81/SleekDB-master/template/v001/public/',
      loginEndPt: 'controller/sessions.php',
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch(this.servrURL + this.loginEndPt, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: this.username,
            Password: this.password,
          }),
        });
        const users = await response.json();
        this.loginResponse = users.messages[0];
      } catch (error) {
        this.error = error.toString();
        console.log(this.error);
      }
    },
  },
  computed: {},
  watch: {},
}).mount('#app');
