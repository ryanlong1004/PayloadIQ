


import './reset.css';
import './style.css';
import 'uno.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { loadPlugins } from './utils/pluginLoader';
import App from './App.vue';

const app = createApp(App);
const store = createPinia();
app.use(store);
loadPlugins(app, store);
app.mount('#app');
