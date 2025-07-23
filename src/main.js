import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import {createPinia} from "pinia";
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import '@/assets/scss/index.scss';
import '@/assets/scss/tailwind.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const pinia = createPinia();
pinia.use(piniaPersistedstate);
AOS.init();

loadFonts()

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app')
