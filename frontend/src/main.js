// import { createApp } from 'vue'
import App from './App_vue.js';
import Snackbar from './components/Snackbar_vue.js';

// import './assets/main.css'

// createApp(App).mount('#app')
let vm = Vue.createApp(App);

//registering global components
vm.component('Snackbar', Snackbar);

vm.mount('#app');
