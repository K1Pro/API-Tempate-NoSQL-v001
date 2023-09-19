//<script>
export default {
  name: 'Snackbar',

  template: /*html*/ `
  <div class="snackbar" :class="{ show: message }"> {{ message }}</div>
  `,

  props: ['message'],
};
// </script>
