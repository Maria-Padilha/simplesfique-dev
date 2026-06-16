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

import VueApexCharts from 'vue3-apexcharts'

const pinia = createPinia();
pinia.use(piniaPersistedstate);
AOS.init();

// Suprimir erro do ResizeObserver no desenvolvimento
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 20);
    super(callback);
  }
};

loadFonts()

createApp(App)
    .use(pinia)
    .use(router)
    .use(VueMask)
    .use(vuetify)
    .use(VueApexCharts)
    .use(Vue3Toastify, {
        autoClose: 4000,
        position: "top-right",
    })
    .mount('#app')
