// <script>
export default {
  name: 'Login',

  template: /*html*/ `
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
  `,

  // props: ['accessToken', 'sessionID'],

  data() {
    return {
      username: '',
      password: '',
    };
  },

  emits: ['access-token-change'],

  methods: {
    async loginFunc(endPt) {
      try {
        const response = await fetch(servrURL + endPt, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Username: this.username,
            Password: this.password,
            IP_Address: userIP,
          }),
        });
        const logInResJSON = await response.json();
        if (logInResJSON.success) {
          this.$emit(
            'access-token-change',
            logInResJSON.data.accesstoken,
            logInResJSON.data.session_id
          );
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          document.cookie = `_a_t=${
            logInResJSON.data.accesstoken
          }; expires=${tomorrow.toString()};`;
          document.cookie = `_s_i=${
            logInResJSON.data.session_id
          }; expires=${tomorrow.toString()};`;
        }
        // this.snackbar(logInResJSON.messages[0]);
      } catch (error) {
        this.error = error.toString();
        // this.snackbar(this.error);
      }
    },
  },

  created() {
    this.loginEndPt = 'controller/sessions.php';
  },

  beforeMount() {},
};
// </script>
