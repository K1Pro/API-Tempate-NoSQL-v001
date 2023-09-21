//<script>
export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <span>Social Media</span><br><br>
    <input type="search" v-model="imageSearchInput" name="image-search" placeholder="Search for an image…"/><br>
    <button type="button" @click.prevent="imageSearch()">Search</button>
  `,

  data() {
    return {
      imageSearchInput: '',
    };
  },

  methods: {
    async imageSearch() {
      try {
        const response = await fetch(
          'https://api.pexels.com/v1/search?query=' +
            this.imageSearchInput +
            '&page=1&per_page=80',
          {
            method: 'GET',
            headers: {
              Authorization: pexelsKey,
            },
          }
        );
        const imageSearchJSON = await response.json();
        if (imageSearchJSON) {
          console.log(imageSearchJSON.total_results);
        }
      } catch (error) {
        console.log(error.toString());
      }
    },
  },
};
// </script>
