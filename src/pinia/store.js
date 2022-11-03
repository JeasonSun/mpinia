import {
  getCurrentInstance,
  inject,
  reactive,
  effectScope,
  computed,
} from "vue";
import { piniaSymbol } from "./rootStore";

function createSetupStore(id, setup, pinia) {}

function createOptionsStore(id, options, pinia) {
  const { state, actions, getters } = options;
  let scope;
  const store = reactive({});

  function setup() {
    // 这里会对用户传递的state, actions,getters做处理
    const localState = (pinia.state.value[id] = state ? state() : {});
    return Object.assign(localState, actions);
  }

  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  function wrapAction(name, action) {
    return function () {
      let ret = action.apply(store, arguments);
      // TODO: action执行后可能是Promise
      return ret;
    };
  }

  for (let key in setupStore) {
    const prop = setupStore[key];
    if (typeof prop === "function") {
      setupStore[key] = wrapAction(key, prop);
    }
  }

  pinia._s.set(id, store);
  Object.assign(
    store,
    setupStore,
    Object.keys(getters || {}).reduce((memo, name) => {
      memo[name] = computed(() => {
        return getters[name].call(store);
      });
      return memo;
    }, {})
  );
  return store;
}

export function defineStore(idOrOptions, setup) {
  let id;
  let options;
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }

  const isSetupStore = typeof setup === "function";

  function useStore() {
    let instance = getCurrentInstance();
    const pinia = instance && inject(piniaSymbol);

    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }

    const store = pinia._s.get(id);
    return store;
  }

  return useStore;
}
