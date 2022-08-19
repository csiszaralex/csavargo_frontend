import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from '@/router';
import store from '@/store';
import 'bootstrap';
import '@/assets/style/main.scss';
import BaseButton from './components/UI/BaseButton.vue';

//TODO ha van login átirányít

const app = createApp(App);

app.use(store);
app.use(router);

app.component('BaseButton', BaseButton);

app.mount('#app');
