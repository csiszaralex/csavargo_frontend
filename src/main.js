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
import BaseTable from './components/UI/BaseTable.vue';
import BaseFile from './components/UI/BaseFile.vue';
import { getItem } from './utility/localStorage';

if (getItem('token')) {
  store.dispatch('changeAuth', { token: getItem('token') });
  store.dispatch('renew');
}

const app = createApp(App);

app.use(store);
app.use(router);

app.component('BaseButton', BaseButton);
app.component('BaseInput', BaseInput);
app.component('BaseDialog', BaseDialog);
app.component('BaseTable', BaseTable);
app.component('BaseFile', BaseFile);

app.mount('#app');
