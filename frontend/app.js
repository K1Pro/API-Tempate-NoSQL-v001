const vm = Vue.createApp({
  data() {
    return {
      username: '',
      password: '',
      servrURL:
        'http://192.168.54.22/php81/SleekDB-master/template/v001/public/',
      // servrURL: 'https://api-template-nosql.k1pro.net/',
      loginEndPt: 'controller/sessions.php',
      logoutEndPt: 'controller/sessions.php?sessionid=',
      userDataEndPt: 'controller/users.php?userid=',
      accessToken: this.getCookie('_a_t'),
      sessionID: '',
      userData: '',
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
    async loginFunc(endPt) {
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
        const logInResJSON = await response.json();
        if (logInResJSON.success) {
          this.accessToken = logInResJSON.data.accesstoken;
          document.cookie = `_a_t=${logInResJSON.data.accesstoken}`;
          // this.userDataFunc(this.userDataEndPt);
        }
        this.snackbar(logInResJSON.messages[0]);
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },
    async logoutFunc(endPt) {
      console.log('logging out');
      console.log(this.sessionID);
      try {
        const response = await fetch(this.servrURL + endPt + this.sessionID, {
          method: 'DELETE',
          headers: {
            Authorization: this.accessToken,
          },
        });
        const logOutResJSON = await response.json();
        // return userDataResJSON;
        if (logOutResJSON.success) {
          this.userData = '';
          this.sessionID = '';
          this.accessToken = undefined;
          document.cookie =
            '_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          console.log('Logged out');
        } else {
          this.snackbar(logOutResJSON.messages[0]);
          console.log(logOutResJSON);
          // document.cookie =
          //   '_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          // this.accessToken = undefined;
          // console.log('Logged out');
        }
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },
    async userDataFunc(endPt) {
      try {
        const response = await fetch(this.servrURL + endPt, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
          },
        });
        const userDataResJSON = await response.json();
        // return userDataResJSON;
        if (userDataResJSON.success) {
          this.userData = userDataResJSON.data.user;
          this.sessionID =
            userDataResJSON.data.user.LoginActivity[0].session_id;
          console.log('Logged in');
        } else {
          this.snackbar(userDataResJSON.messages[0]);
          document.cookie =
            '_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          this.accessToken = undefined;
          console.log('Logged out');
        }
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },
  },
  computed: {},
  watch: {
    accessToken(newToken, oldToken) {
      console.log(`New token: ${newToken}`);
      console.log(`Old token: ${oldToken}`);
      this.userDataFunc(this.userDataEndPt);
    },
  },
  created() {
    if (this.accessToken) {
      this.userDataFunc(this.userDataEndPt);
    } else {
      console.log('No Access Token');
    }
  },
  beforeMount() {},
});

vm.mount('#app');

// setTimeout(() => {
//   vm.mount('#app');
// }, 3000);
