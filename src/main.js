import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import 'flowbite';
import router  from './router/index.js';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

createApp(App).use(router).mount('#app');
