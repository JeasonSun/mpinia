import { effectScope, ref } from "vue";
import { piniaSymbol } from "./rootStore";

export function createPinia() {
  const scope = effectScope();
  const state = scope.run(() => ref({}));

  const pinia = {
    _s: new Map(),
    _e: scope,
    state,
    install(app) {
      app.provide(piniaSymbol, pinia);
    },
  };                                                                                                

  return pinia;
}
