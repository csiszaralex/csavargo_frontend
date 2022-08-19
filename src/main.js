import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from '@/router';
import store from '@/store';
import 'bootstrap';
import '@/config/axios';
import BaseButton from './components/UI/BaseButton.vue';
import BaseInput from './components/UI/BaseInput.vue';
import BaseDialog from './components/UI/BaseDialog.vue';

//TODO ha van login átirányít

const app = createApp(App);

app.use(store);
app.use(router);

app.component('BaseButton', BaseButton);
app.component('BaseInput', BaseInput);
app.component('BaseDialog', BaseDialog);

app.mount('#app');
