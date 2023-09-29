//<script>
export default {
  name: 'Post',

  template: /*html*/ `
      <b>Post</b><br>
      <textarea v-model="postText" rows="3" name="post" placeholder="Type your post..."></textarea><br>
      <input type="search" v-model="imageSearchInput" name="image-search" placeholder="Search for an image…" @keyup.enter="imageSearch()"/><br>
      <button type="button" @click.prevent="imageSearch()">Search</button>
      <button type="button">Upload</button>
      <button type="button" @click.prevent="getActiveSMGroup()">Post</button><br>
      <img v-if="randomImagePath" :src="randomImagePath" alt="random-image">
    `,

  props: ['accessToken'],

  emits: ['post-msg'],

  data() {
    return {
      imageSearchInput: '',
      randomImagePath: '',
      postText: '',
    };
  },

  methods: {
    async imageSearch() {
      const prevSrchTtlRslts = localStorage.getItem(
        `Multisocial-${this.imageSearchInput.toLowerCase()}`
      );
      const prevSrchTtlRsltsMax = prevSrchTtlRslts
        ? Math.floor(prevSrchTtlRslts / 80)
        : 1;
      const randomPage = Math.floor(
        Math.random() * (prevSrchTtlRsltsMax - 1 + 1) + 1
      );
      try {
        const response = await fetch(
          'https://api.pexels.com/v1/search?query=' +
            this.imageSearchInput.toLowerCase() +
            `&page=${randomPage}&per_page=80`,
          {
            method: 'GET',
            headers: {
              Authorization: pexelsKey,
            },
          }
        );
        const imageSearchJSON = await response.json();
        if (imageSearchJSON) {
          localStorage.setItem(
            `Multisocial-${this.imageSearchInput.toLowerCase()}`,
            imageSearchJSON.total_results
          );
          const max =
            imageSearchJSON.total_results > 80
              ? 80
              : imageSearchJSON.total_results;
          const randomImage = Math.floor(Math.random() * (max - 1 + 1) + 1);
          this.randomImagePath =
            imageSearchJSON.photos[randomImage].src['landscape'];
        }
      } catch (error) {
        console.log(error.toString());
      }
    },

    async getActiveSMGroup() {
      try {
        const response = await fetch(
          servrURL + 'controller/socialmedia.php?active=true',
          {
            method: 'GET',
            headers: {
              Authorization: this.accessToken,
            },
          }
        );
        const ActiveSMGroupJSON = await response.json();
        if (ActiveSMGroupJSON.success) {
          console.log(ActiveSMGroupJSON.data.sm_group);
          ActiveSMGroupJSON.data.sm_group.forEach((sm_website) => {
            console.log(sm_website.website);
          });
          this.$emit('post-msg', 'Posting to social media websites...');
        }
      } catch (error) {
        this.$emit('post-msg', error.toString());
      }
    },
  },
};
// </script>
