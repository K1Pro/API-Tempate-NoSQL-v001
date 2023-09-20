//<script>
export default {
  name: 'LogOutBtn',

  template: /*html*/ `
    <button :style="logoutBtn" type="button" @click="logoutFunc(logoutEndPt)">Log Out</button>
  `,

  props: ['accessToken', 'sessionID'],

  emits: ['logout', 'logout-msg'],

  methods: {
    async logoutFunc(endPt) {
      try {
        const response = await fetch(servrURL + endPt + this.sessionID, {
          method: 'DELETE',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const logOutResJSON = await response.json();
        if (logOutResJSON.success) {
          this.$emit('logout', undefined, undefined, '');
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
        }
        this.$emit('logout-msg', logOutResJSON.messages[0]);
      } catch (error) {
        this.error = error.toString();
        this.$emit('logout-msg', this.error);
      }
    },
  },

  created() {
    this.logoutEndPt = 'controller/sessions.php?sessionid=';

    // <style scoped>
    this.logoutBtn = {
      position: 'absolute',
      top: '5px',
      right: '15px',
    };
    // </style>
  },
};
// </script>
