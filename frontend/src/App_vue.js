// <script>
import Snackbar from './components/Snackbar_vue.js';
import Login from './components/Login_vue.js';
import Logoutbtn from './components/LogOutBtn_vue.js';
import Post from './components/Post_vue.js';
import Accountinfo from './components/AccountInfo_vue.js';
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
          <socialmedia :accessToken="accessToken" @socialmedia-msg="updateSnackbar"></socialmedia>
        </div>
        <div class="item2">
          <post :accessToken="accessToken" @post-msg="updateSnackbar"></post>
        </div>
        <div class="item3">
          <accountinfo :userData="userData"></accountinfo>
        </div>
        <div class="item4">
          <email></email>
        </div>
        <div class="item5">
        <prosign></prosign>
        </div>
      </div>
    </template>
  `,

  components: {
    Snackbar,
    Login,
    Logoutbtn,
    Post,
    Accountinfo,
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
