// import { createApp } from 'vue'
import App from './AppVue.js';
import Snackbar from './components/SnackbarVue.js';

// import './assets/main.css'

// createApp(App).mount('#app')
let vm = Vue.createApp(App);

//registering global components
vm.component('Snackbar', Snackbar);

vm.mount('#app');
