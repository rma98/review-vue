import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/styles/global.css';
import './assets/styles/tableStyles.css';
import './assets/styles/cardStyles.css';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);
app.use(router);
app.use(store); // Registra o store
app.mount('#app');
