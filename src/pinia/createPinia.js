import { effectScope, ref } from "vue";
import { piniaSymbol } from "./rootStore";

export let activePinia;

export const setActivePinia = (pinia) => {
  activePinia = pinia;
};

export function createPinia() {
  const scope = effectScope();
  const state = scope.run(() => ref({}));

  const _p = [];
  const pinia = {
    _s: new Map(),
    _e: scope,
    use: function (plugin) {
      _p.push(plugin);
      return this;
    },
    _p,
    state,
    install(app) {
      setActivePinia(pinia);
      app.provide(piniaSymbol, pinia);
    },
  };

  return pinia;
}
