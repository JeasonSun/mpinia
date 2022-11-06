import { createApp } from "vue";
import { createPinia } from "@/pinia";
// import { createPinia } from "pinia";
import App from "./App.vue";
import { useCounterStore1} from './stores/counter1';

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

const store1 = useCounterStore1();
console.log(store1.count)

app.mount("#app");
