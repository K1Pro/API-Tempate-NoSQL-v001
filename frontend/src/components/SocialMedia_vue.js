//<script>
export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <div class="tab">
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Facebook'}" @click="openSocialMedia">Facebook</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Instagram'}" @click="openSocialMedia">Instagram</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Twitter'}" @click="openSocialMedia">Twitter</button>
    </div>

    <div class="tabcontent">
      <br>
      <b><label for="appid">{{ chosenSocialMedia }} App ID:</label></b><br>
      <input type="text" id="appid" v-model="appid"><br><br>

      <b><label for="apikey">{{ chosenSocialMedia }} API Key:</label></b><br>
      <input type="text" id="apikey"><br><br>

      <b><label for="apikeysecret">{{ chosenSocialMedia }} API Key Secret:</label></b><br>
      <input type="text" id="apikeysecret"><br><br>

      <b><label for="bearertoken">{{ chosenSocialMedia }} Bearer Token:</label></b><br>
      <input type="text" id="bearertoken"><br><br>

      <b><label for="clientid">{{ chosenSocialMedia }} Client ID:</label></b><br>
      <input type="text" id="clientid"><br><br>

      <b><label for="clientsecret">{{ chosenSocialMedia }} Client Secret:</label></b><br>
      <input type="text" id="clientsecret"><br><br>

      <b><label for="accesstoken">{{ chosenSocialMedia }} Access Token:</label></b><br>
      <input type="text" id="accesstoken"><br><br>

      <b><label for="accesstokenexpiry">{{ chosenSocialMedia }} Access Token Expiry:</label></b><br>
      <input type="text" id="accesstokenexpiry"><br><br>

      <b><label for="accesstokensecret">{{ chosenSocialMedia }} Access Token Secret:</label></b><br>
      <input type="text" id="accesstokensecret"><br><br>
    </div>
  `,

  data() {
    return {
      chosenSocialMedia: 'Facebook',
      appid: '',
    };
  },

  methods: {
    openSocialMedia(event) {
      this.chosenSocialMedia = event.target.innerHTML;
      // var i, tabcontent, tablinks;
      // tabcontent = document.getElementsByClassName('tabcontent');
      // for (i = 0; i < tabcontent.length; i++) {
      //   tabcontent[i].style.display = 'none';
      // }
      // tablinks = document.getElementsByClassName('tablinks');
      // for (i = 0; i < tablinks.length; i++) {
      //   tablinks[i].className = tablinks[i].className.replace(' active', '');
      // }
      // document.getElementById(cityName).style.display = 'block';
      // evt.currentTarget.className += ' active';
    },
  },
};
// </script>
