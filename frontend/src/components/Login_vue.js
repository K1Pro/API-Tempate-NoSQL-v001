// <script>
export default {
  name: 'Login',

  template: /*html*/ `
    <div class="content">
      <div class="loginform">
        <div class="square"></div>
        <div class="inputs">
          <form>
            <label for="username">Username: </label>
            <input type="text" v-model="username" id="username" autocomplete="username"/><br /><br />
            <label for="password">Password: </label>
            <input type="password" v-model="password" id="password"/><br /><br />
            <button type="button" @click.prevent="loginFunc(loginEndPt)">Log In</button>
          </form>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      username: '',
      password: '',
    };
  },

  emits: ['login', 'login-msg'],

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
            'login',
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
        this.$emit('login-msg', logInResJSON.messages[0]);
      } catch (error) {
        this.error = error.toString();
        this.$emit('login-msg', this.error);
      }
    },
  },

  created() {
    this.loginEndPt = 'controller/sessions.php';
  },

  beforeMount() {},
};
// </script>
