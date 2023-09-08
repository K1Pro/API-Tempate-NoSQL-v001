const vm = Vue.createApp({
  data() {
    return {
      username: '',
      password: '',
      servrURL:
        'http://192.168.54.22/php81/SleekDB-master/template/v001/public/',
      // servrURL: 'https://api-template-nosql.k1pro.net/',
      loginEndPt: 'controller/sessions.php',
      userDataEndPt: 'controller/users.php?userid=',
      accessToken: document.cookie
        .match(new RegExp(`(^| )_a_t=([^;]+)`))
        ?.at(2),
      userDataResponse: '',
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
    async login(endPt) {
      try {
        const response = await fetch(this.servrURL + endPt, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: this.username,
            Password: this.password,
          }),
        });
        const userLogIn = await response.json();
        if (userLogIn.success) {
          console.log(userLogIn);
          console.log(userLogIn.data.accesstoken);
          this.accessToken = userLogIn.data.accesstoken;
          document.cookie = `_a_t=${userLogIn.data.accesstoken}`;
          this.userData(this.userDataEndPt);
        }
        this.snackbar(userLogIn.messages[0]);
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },
    async userData(userDataEndPt) {
      try {
        const response = await fetch(this.servrURL + userDataEndPt, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
          },
        });
        const userData = await response.json();
        if (userData.success) {
          this.userDataResponse = userData.data.user.FirstName;
        } else {
          this.snackbar(userData.messages[0]);
          document.cookie =
            '_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          this.accessToken = undefined;
        }
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },
  },
  computed: {},
  watch: {},
}).mount('#app');
