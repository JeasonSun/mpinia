import { effectScope, ref } from "vue";
import { piniaSymbol } from "./rootStore";

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
      app.provide(piniaSymbol, pinia);
    },
  };

  return pinia;
}
