//<script>
export default {
  name: 'SidePanel',

  template: /*html*/ `
    <p>
        Hi <b>{{ userData.FirstName }}</b>,
    </p>
    <p>Below is your account info:</p>
    <ul>
        <li v-for="(value, key) in userData">{{ key }}: {{ value }}</li>
    </ul>
    <p></p>
  `,

  props: ['userData'],

  data() {
    return {};
  },
};
// </script>
