//<script>
export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <div class="tab">
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Facebook'}" @click="openSocialMedia">Facebook</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Instagram'}" @click="openSocialMedia">Instagram</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Twitter'}" @click="openSocialMedia">Twitter</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'LinkedIn'}" @click="openSocialMedia">LinkedIn</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Google'}" @click="openSocialMedia">Google</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Pinterest'}" @click="openSocialMedia">Pinterest</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Reddit'}" @click="openSocialMedia">Reddit</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'TikTok'}" @click="openSocialMedia">TikTok</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'YouTube'}" @click="openSocialMedia">YouTube</button>
      <button class="tablinks" :class="{active: chosenSocialMedia == 'Pexels'}" @click="openSocialMedia">Pexels</button>
    </div>

    <div class="tabcontent">
      <h2>{{ chosenSocialMedia }}<input type="checkbox" id="active" v-model="active" @click="patchSocialMedia" /></h2>

      <b><label for="accesstoken">Access Token:</label></b><br>
      <input type="text" id="accesstoken" v-model="accesstoken" @change="patchSocialMedia"><br><br>

      <b><label for="accesstokenexpiry">Access Token Expiry:</label></b><br>
      <input type="datetime-local" id="accesstokenexpiry" :value="accesstokenexpiry" @change="patchSocialMedia"><br><br>

      <b><label for="accesstokensecret">Access Token Secret:</label></b><br>
      <input type="text" id="accesstokensecret" v-model="accesstokensecret" @change="patchSocialMedia"><br><br>

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

      <b><label for="accesstokensecret">Access Token Secret:</label></b><br>
      <input type="text" id="accesstokensecret" v-model="accesstokensecret" @change="patchSocialMedia"><br><br>

      <b><label for="urn">URN:</label></b><br>
      <input type="text" id="urn" v-model="urn" @change="patchSocialMedia"><br><br>
    </div>
  `,

  props: ['accessToken'],

  emits: ['socialmedia-msg'],

  data() {
    return {
      chosenSocialMedia: 'Facebook',
      accesstoken: '',
      accesstokenexpiry: '',
      accesstokensecret: '',
      appid: '',
      apikey: '',
      apikeysecret: '',
      bearertoken: '',
      clientid: '',
      clientsecret: '',
      urn: '',
      active: false,
    };
  },

  methods: {
    openSocialMedia(event) {
      this.chosenSocialMedia = event.target.innerHTML;
      this.getSocialMedia(event.target.innerHTML);
    },

    async patchSocialMedia(event) {
      const inputValue =
        event.target.type == 'checkbox'
          ? `${event.target.checked}`
          : event.target.value;
      try {
        const response = await fetch(servrURL + 'controller/socialmedia.php', {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            website: this.chosenSocialMedia,
            [event.target.id]: inputValue,
          }),
        });
        const patchSocialMediaJSON = await response.json();
        if (patchSocialMediaJSON.success) {
          this.$emit('socialmedia-msg', patchSocialMediaJSON.messages[0]);
        }
      } catch (error) {
        this.error = error.toString();
        this.$emit('socialmedia-msg', this.error);
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
          this.active = SMData.active;
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
          this.active = false;
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
