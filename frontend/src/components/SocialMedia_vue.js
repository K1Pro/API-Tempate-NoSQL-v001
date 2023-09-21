//<script>
export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <b>Social Media</b><br>
    <textarea v-model="postText" rows="3" placeholder="Type your post..."></textarea><br>
    <input type="search" v-model="imageSearchInput" name="image-search" placeholder="Search for an image…" @keyup.enter="imageSearch()"/>
    <button type="button" @click.prevent="imageSearch()">Search</button><br>
    <img v-if="randomImagePath" :src="randomImagePath" alt="random-image">
  `,

  data() {
    return {
      imageSearchInput: '',
      randomImagePath: '',
      postText: '',
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
          console.log('total results' + imageSearchJSON.total_results);
          const max =
            imageSearchJSON.total_results > 80
              ? 80
              : imageSearchJSON.total_results;
          const randomImage = Math.floor(Math.random() * (max - 0 + 1) + 0);
          console.log('random number' + randomImage);
          console.log(imageSearchJSON.photos);
          console.log(imageSearchJSON.photos[randomImage].src['landscape']);
          this.randomImagePath =
            imageSearchJSON.photos[randomImage].src['landscape'];
        }
      } catch (error) {
        console.log(error.toString());
      }
    },
  },
};
// </script>
