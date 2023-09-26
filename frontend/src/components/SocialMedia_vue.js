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
      <h2>{{ chosenSocialMedia }}</h2>

      <b><label for="appid">App ID:</label></b><br>
      <input type="text" id="appid" v-model="appid" @change="patchSocialMedia"><br><br>

      <b><label for="apikey">API Key:</label></b><br>
      <input type="text" id="apikey" v-model="apikey" @change="patchSocialMedia"><br><br>

      <b><label for="apikeysecret">API Key Secret:</label></b><br>
      <input type="text" id="apikeysecret" v-model="apikeysecret" @change="patchSocialMedia"><br><br>

      <b><label for="bearertoken">Bearer Token:</label></b><br>
      <input type="text" id="bearertoken" v-model="bearertoken" @change="patchSocialMedia"><br><br>

      <b><label for="clientid">Client ID:</label></b><br>
      <input type="text" id="clientid" v-model="clientid" @change="patchSocialMedia"><br><br>

      <b><label for="clientsecret">Client Secret:</label></b><br>
      <input type="text" id="clientsecret" v-model="clientsecret" @change="patchSocialMedia"><br><br>

      <b><label for="accesstoken">Access Token:</label></b><br>
      <input type="text" id="accesstoken" v-model="accesstoken" @change="patchSocialMedia"><br><br>

      <b><label for="accesstokenexpiry">Access Token Expiry:</label></b><br>
      <input type="datetime-loca" id="accesstokenexpiry" v-model="accesstokenexpiry" @change="patchSocialMedia"><br><br>

      <b><label for="accesstokensecret">Access Token Secret:</label></b><br>
      <input type="text" id="accesstokensecret" v-model="accesstokensecret" @change="patchSocialMedia"><br><br>
    </div>
  `,

  props: ['accessToken'],

  data() {
    return {
      chosenSocialMedia: 'Facebook',
      appid: '',
      apikey: '',
      apikeysecret: '',
      bearertoken: '',
      clientid: '',
      clientsecret: '',
      accesstoken: '',
      accesstokenexpiry: '',
      accesstokensecret: '',
    };
  },

  methods: {
    openSocialMedia(event) {
      this.chosenSocialMedia = event.target.innerHTML;
      this.getSocialMedia(event.target.innerHTML);
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

    async patchSocialMedia(event) {
      console.log(event.target.value);
      console.log(event.target.id);
      try {
        const response = await fetch(servrURL + 'controller/socialmedia.php', {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            [event.target.id]: event.target.value,
          }),
        });
        const patchSocialMediaJSON = await response.json();
        if (patchSocialMediaJSON.success) {
        }
      } catch (error) {
        this.error = error.toString();
      }
    },

    async getSocialMedia(endPt) {
      try {
        const response = await fetch(
          servrURL + 'controller/socialmedia.php?smwebsite=' + endPt,
          {
            method: 'GET',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          }
        );
        const getSocialMediaJSON = await response.json();
        if (getSocialMediaJSON.success) {
          const SMData = getSocialMediaJSON.data.sm_group;
          this.appid = SMData.appid;
          this.apikey = SMData.apikey;
          this.apikeysecret = SMData.apikeysecret;
          this.bearertoken = SMData.bearertoken;
          this.clientid = SMData.clientid;
          this.clientsecret = SMData.clientsecret;
          this.accesstoken = SMData.accesstoken;
          this.accesstokenexpiry = SMData.accesstokenexpiry;
          this.accesstokensecret = SMData.accesstokensecret;
        } else {
          this.appid = '';
          this.apikey = '';
          this.apikeysecret = '';
          this.bearertoken = '';
          this.clientid = '';
          this.clientsecret = '';
          this.accesstoken = '';
          this.accesstokenexpiry = '';
          this.accesstokensecret = '';
        }
      } catch (error) {
        this.error = error.toString();
      }
    },
  },

  created() {
    this.getSocialMedia(this.chosenSocialMedia);
  },
};
// </script>
