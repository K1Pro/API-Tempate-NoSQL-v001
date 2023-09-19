// <script>
import Snackbar from './components/Snackbar_vue.js';
import Login from './components/Login_vue.js';
import Logoutbtn from './components/LogOutBtn_vue.js';
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
      <login @login="updateAccessToken" @login-msg="updateSnackbar"></login>
    </template>
    <template v-else>
      <logoutbtn :accessToken="accessToken" :sessionID="sessionID" @logout="updateAccessToken" @logout-msg="updateSnackbar">></logoutbtn>
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
    Logoutbtn,
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

  watch: {
    accessToken(newToken, oldToken) {
      this.userData = '';
      if (newToken != undefined) this.userDataFunc(this.userDataEndPt);
    },
    message() {
      setTimeout(() => {
        this.message = null;
      }, 3000);
    },
  },

  created() {
    this.userDataEndPt = 'controller/users.php?userid=';
    if (this.accessToken) {
      this.userDataFunc(this.userDataEndPt);
    }
  },
};
// </script>
