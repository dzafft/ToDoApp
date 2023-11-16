import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice"; // Import the ToastService
import NoteList from "./components/NoteList.vue";
import CreateNote from "./components/CreateNote.vue";
import { createRouter, createWebHashHistory } from "vue-router"; // Import createRouter and createWebHashHistory
import { createPinia } from 'pinia';

const pinia = createPinia();
const routes = [
  { path: "/notelist", component: NoteList, name: "notelist" },
  { path: "/", component: CreateNote, name: "createnote" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(router);
app.use(pinia);

app.mount("#app");
