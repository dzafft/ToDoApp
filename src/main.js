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
app.mount('#app');

