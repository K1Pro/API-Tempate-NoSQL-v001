// <script>
import Login from './components/LoginVue.js';

export default {
  name: 'App',
  components: {
    Login,
  },
  template: /*html*/ `
    <Login></Login>
  `,
  data() {
    return {
      componentName: 'Login',
    };
  },
};
// </script>
