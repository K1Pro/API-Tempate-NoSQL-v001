const vm = Vue.createApp({
  data() {
    return {
      username: '',
      password: '',
      servrURL: servrURLendPt,
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
            IP_Address: userIP,
          }),
        });
        const logInResJSON = await response.json();
        if (logInResJSON.success) {
          this.accessToken = logInResJSON.data.accesstoken;
          document.cookie = `_a_t=${logInResJSON.data.accesstoken}`;
          // this.userDataFunc(this.userDataEndPt);
        }
        console.log(userIP);
        this.snackbar(logInResJSON.messages[0]);
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },
    async logoutFunc(endPt) {
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
            '_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/php81/SleekDB-master/template/v001/frontend;';
          console.log('Logged out');
        }
        this.snackbar(logOutResJSON.messages[0]);
        console.log('Could not log out:');
        console.log(logOutResJSON);
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
          document.cookie =
            '_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/php81/SleekDB-master/template/v001/frontend;';
          this.accessToken = undefined;
          console.log('Could not log in');
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

// creating a component example
vm.component('k1pro', {
  template: `<h1>{{ message }}</h1>`,
  data() {
    return {
      message: 'Hello World!',
    };
  },
});

vm.mount('#app');

// setTimeout(() => {
//   vm.mount('#app');
// }, 3000);
