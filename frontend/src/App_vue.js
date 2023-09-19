// <script>
import Login from './components/Login_vue.js';

export default {
  name: 'App',
  template: /*html*/ `
    <snackbar></snackbar>
    <template v-if="accessToken === undefined">
      <login @access-token-change="updateAccessToken"></login>
    </template>
    <template v-else>
      <button :style="logoutBtn" type="button" @click="logoutFunc(logoutEndPt)">Log Out</button>
      <div class="grid-container">
        <div class="item1">
          <p>
            Hi <b>{{ userData.FirstName }}</b>,
          </p>
          <p>Below is your account info:</p>
          <ul>
            <li v-for="(value, key) in userData">{{ key }}: {{ value }}</li>
          </ul>
          <p></p>
        </div>
        <div class="item2">User Accounts</div>
        <div class="item3">ProSign</div>
        <div class="item4">Email</div>
        <div class="item5">Social Media</div>
      </div>
    </template>
  `,

  components: {
    Login,
  },
  data() {
    return {
      accessToken: this.getCookie('_a_t'),
      sessionID: this.getCookie('_s_i'),
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

    updateAccessToken(accessToken, sessionID) {
      this.accessToken = accessToken;
      this.sessionID = sessionID;
    },

    async logoutFunc(endPt) {
      try {
        const response = await fetch(servrURL + endPt + this.sessionID, {
          method: 'DELETE',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const logOutResJSON = await response.json();
        if (logOutResJSON.success) {
          this.userData = '';
          this.sessionID = '';
          this.accessToken = undefined;
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
        }
        this.snackbar(logOutResJSON.messages[0]);
      } catch (error) {
        this.error = error.toString();
        this.snackbar(this.error);
      }
    },

    async userDataFunc(endPt) {
      try {
        const response = await fetch(servrURL + endPt, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        if (userDataResJSON.success) {
          this.userData = userDataResJSON.data.user;
        } else {
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          this.accessToken = undefined;
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
      console.log('this has changed');
      if (newToken != undefined) this.userDataFunc(this.userDataEndPt);
    },
  },

  created() {
    this.logoutEndPt = 'controller/sessions.php?sessionid=';
    this.userDataEndPt = 'controller/users.php?userid=';
    if (this.accessToken) {
      this.userDataFunc(this.userDataEndPt);
    }

    // <style scoped>
    this.logoutBtn = {
      position: 'absolute',
      top: '5px',
      right: '15px',
    };
    // </style>
  },
};
// </script>
