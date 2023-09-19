// <script>
import Snackbar from './components/Snackbar_vue.js';
import Login from './components/Login_vue.js';
import Sidepanel from './components/SidePanel_vue.js';
import Useraccounts from './components/UserAccounts_vue.js';
import Prosign from './components/ProSign_vue.js';
import Email from './components/Email_vue.js';
import Socialmedia from './components/SocialMedia_vue.js';

export default {
  name: 'App',
  template: /*html*/ `
    <snackbar :message="message"></snackbar>
    <template v-if="accessToken === undefined">
      <login @access-token-change="updateAccessToken" @message="updateSnackbar"></login>
    </template>
    <template v-else>
      <button :style="logoutBtn" type="button" @click="logoutFunc(logoutEndPt)">Log Out</button>
      <div class="grid-container">
        <div class="item1">
          <sidepanel :userData="userData"></sidepanel>
        </div>
        <div class="item2">
          <useraccounts></useraccounts>
        </div>
        <div class="item3">
          <prosign></prosign>
        </div>
        <div class="item4">
          <email></email>
        </div>
        <div class="item5">
          <socialmedia></socialmedia>
        </div>
      </div>
    </template>
  `,

  components: {
    Snackbar,
    Login,
    Sidepanel,
    Useraccounts,
    Prosign,
    Email,
    Socialmedia,
  },
  data() {
    return {
      accessToken: this.getCookie('_a_t'),
      sessionID: this.getCookie('_s_i'),
      userData: '',
      message: null,
    };
  },
  methods: {
    getCookie(name) {
      return document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.at(2);
    },

    updateSnackbar(message) {
      this.message = message;
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
          this.sessionID = undefined;
          this.accessToken = undefined;
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
        }
        this.message = logOutResJSON.messages[0];
      } catch (error) {
        this.error = error.toString();
        this.message = this.error;
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
        this.message = this.error;
      }
    },
  },
  computed: {},

  watch: {
    accessToken(newToken, oldToken) {
      if (newToken != undefined) this.userDataFunc(this.userDataEndPt);
    },
    message() {
      setTimeout(() => {
        this.message = null;
      }, 3000);
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
