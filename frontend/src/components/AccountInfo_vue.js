//<script> <li v-for="(value, key) in userDataNoLoginActivity">{{ key }}: {{ value }}</li>   <span v-if="key !== 'LoginActivity'">{{ key }}: {{ value }}</span>
export default {
  name: 'SidePanel',

  template: /*html*/ `
    <b>Account Info</b><br><br>
    <ul>
        <li v-for="value in Object.keys(userData).filter(e => {return (e !== 'LoginActivity')})">{{ userData[value] }}</li>
    </ul>
    <p></p>
  `,

  props: ['userData'],

  data() {
    return {};
  },
};
// </script>
