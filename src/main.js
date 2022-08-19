import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from '@/router';
import store from '@/store';
import 'bootstrap';
import BaseButton from './components/UI/BaseButton.vue';
import BaseInput from './components/UI/BaseInput.vue';

//TODO ha van login átirányít

const app = createApp(App);

app.use(store);
app.use(router);

app.component('BaseButton', BaseButton);
app.component('BaseInput', BaseInput);

app.mount('#app');
