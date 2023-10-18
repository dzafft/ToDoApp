import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from "primevue/config";
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice'; // Import the ToastService




const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService); 
// app.component('Toast', Toast); // Register the Toast component
// app.component('ConfirmDialog', ConfirmDialog)
app.mount('#app');

