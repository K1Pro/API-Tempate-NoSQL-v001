// <script>
export default {
  name: 'Login',
  template: /*html*/ `
    <!-- Example component below: -->
    <!-- <k1pro></k1pro> -->
    <template v-if="accessToken === undefined">
      <div class="content">
        <div class="loginform">
          <div class="square"></div>
          <div class="inputs">
            <label>Username: </label>
            <input type="text" v-model="username" /><br /><br />
            <label>Password: </label>
            <input type="password" v-model="password" /><br /><br />
            <button type="button" @click="loginFunc(loginEndPt)">Log In</button>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="grid-container">
        <div class="item1">
          <p>
            Hi <b>{{ userData.FirstName }}</b
            >,
          </p>
          <p>Below is your account info:</p>
          <ul>
            <li v-for="(value, key) in userData">{{ key }}: {{ value }}</li>
          </ul>
          <button type="button" @click="logoutFunc(logoutEndPt)">Log Out</button>
          <p></p>
        </div>
        <div class="item2">User Accounts</div>
        <div class="item3">Email</div>
        <div class="item4">ProSign</div>
        <div class="item5">Newsletters</div>
      </div>
    </template>
  `,
  data() {
    return {
      username: '',
      password: '',
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
    async loginFunc(endPt) {
      console.log(endPt);
      try {
        const response = await fetch(servrURL + endPt, {
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
          console.log(logInResJSON);
          this.accessToken = logInResJSON.data.accesstoken;
          this.sessionID = logInResJSON.data.session_id;
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          document.cookie = `_a_t=${
            logInResJSON.data.accesstoken
          }; expires=${tomorrow.toString()};`;
          document.cookie = `_s_i=${
            logInResJSON.data.session_id
          }; expires=${tomorrow.toString()};`;
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
        const response = await fetch(servrURL + endPt + this.sessionID, {
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
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
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
        const response = await fetch(servrURL + endPt, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
          },
        });
        const userDataResJSON = await response.json();
        // return userDataResJSON;
        if (userDataResJSON.success) {
          this.userData = userDataResJSON.data.user;
          console.log('Logged in');
        } else {
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
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
    this.loginEndPt = 'controller/sessions.php';
    this.logoutEndPt = 'controller/sessions.php?sessionid=';
    this.userDataEndPt = 'controller/users.php?userid=';
    if (this.accessToken) {
      this.userDataFunc(this.userDataEndPt);
    } else {
      console.log('No Access Token');
    }
  },
  beforeMount() {},
};
// </script>
