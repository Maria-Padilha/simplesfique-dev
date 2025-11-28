import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import {createPinia} from "pinia";
import piniaPersistedstate from 'pinia-plugin-persistedstate'

import '@/assets/scss/index.scss';
import '@/assets/scss/tailwind.css';

import VueMask from '@devindex/vue-mask';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const pinia = createPinia();
pinia.use(piniaPersistedstate);
AOS.init();

// Patch global para suprimir ResizeObserver warning
const resizeObserverErrMsg = 'ResizeObserver loop completed with undelivered notifications.';
window.addEventListener('error', (e) => {
  if (e.message === resizeObserverErrMsg) {
    e.stopImmediatePropagation();
  }
});

loadFonts()

createApp(App)
    .use(pinia)
    .use(router)
    .use(VueMask)
    .use(vuetify)
    .use(Vue3Toastify, {
        autoClose: 3000,
        position: "top-right",
    })
    .mount('#app')
