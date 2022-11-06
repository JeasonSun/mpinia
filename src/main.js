import { createApp } from "vue";
import { createPinia } from "@/pinia";
// import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();
pinia.use(function ({ store }) {
  const { $id } = store;
  const local = localStorage.getItem(`${$id}_pinia_state`);
  if (local) {
    store.$state = JSON.parse(local);
  }
  store.$subscribe(function ({ storeId: $id }, state) {
    localStorage.setItem(`${$id}_pinia_state`, JSON.stringify(state));
  });
});

app.use(pinia);

app.mount("#app");
