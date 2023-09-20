//<script>
export default {
  name: 'SidePanel',

  template: /*html*/ `
    <p>
        Hi <b>{{ userData.FirstName }}</b>,
    </p>
    <p>Below is your account info:</p>
    <ul>
        <li v-for="(value, key) in userDataNoLoginActivity">{{ key }}: {{ value }}</li>
    </ul>
    <p></p>
  `,

  props: ['userData'],

  computed: {
    userDataNoLoginActivity() {
      delete this.userData.Activity;
      delete this.userData.LoginActivity;
      return this.userData;
    },
  },

  data() {
    return {};
  },
};
// </script>
