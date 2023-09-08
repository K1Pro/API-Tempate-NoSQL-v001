const vm = Vue.createApp({
  data() {
    return {
      username: '',
      password: '',
      loginResponse: '',
      servrURL:
        'http://192.168.54.22/php81/SleekDB-master/template/v001/public/',
      loginEndPt: 'controller/sessions.php',
      mode: 1,
      accessToken: document.cookie
        .match(new RegExp(`(^| )_a_t=([^;]+)`))
        ?.at(2),
    };
  },
  methods: {
    snackbar(message) {
      const snackbar = document.getElementById('snackbar');
      snackbar.innerHTML = message;
      snackbar.className = 'show';
      setTimeout(function () {
        snackbar.className = snackbar.className.replace('show', '');
      }, 3000);
    },
    getCookie(name) {
      return document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.at(2);
    },
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
        if (users.success) {
          this.mode = 2;
          console.log(users);
          console.log(users.data.accesstoken);
          document.cookie = `_a_t=${users.data.accesstoken}`;
        }
        this.snackbar(users.messages[0]);
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },
  },
  computed: {},
  watch: {},
}).mount('#app');
