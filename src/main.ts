import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/access.ts'
import "@/access";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(VueCropper)
app.use(Vue3ColorPicker)
app.mount('#app')
