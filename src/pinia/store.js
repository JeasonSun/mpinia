import {
  getCurrentInstance,
  inject,
  reactive,
  effectScope,
  computed,
  isReactive,
  isRef,
  toRefs,
} from "vue";
import { piniaSymbol } from "./rootStore";

function isComputed(target) {
  return !!(isRef(target) && target.effect);
}

function isObject(target) {
  return !!(typeof target === "object" && target !== null);
}

function mergeReactiveObject(target, state) {
  for (let key in state) {
    let oldValue = target[key];
    let newValue = state[key];
    if (isObject(oldValue) && isObject(newValue)) {
      target[key] = mergeReactiveObject(oldValue, newValue);
    } else {
      target[key] = newValue;
    }
  }
  return target;
}

function createSetupStore(id, setup, pinia, isOption) {
  let scope;
  function $patch(partialStateOrMutation) {
    if (typeof partialStateOrMutation === "object") {
      mergeReactiveObject(pinia.state.value[id], partialStateOrMutation);
    } else {
      console.log(pinia.state.value[id]);
      partialStateOrMutation(pinia.state.value[id]);
    }
  }

  const partialStore = {
    $patch,
  };
  const store = reactive(partialStore);
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

  if (!isOption) {
    pinia.state.value[id] = {};
  }

  for (let key in setupStore) {
    const prop = setupStore[key];
    if (typeof prop === "function") {
      setupStore[key] = wrapAction(key, prop);
    }

    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      if (!isOption) {
        // setup API， 需要将state同步到整体pinia.state上
        pinia.state.value[id][key] = prop;
      }
    }
  }

  pinia._s.set(id, store);
  Object.assign(store, setupStore);
  console.log(pinia);
  return store;
}

function createOptionsStore(id, options, pinia) {
  const { state, actions, getters } = options;

  function setup() {
    // 这里会对用户传递的state, actions,getters做处理
    pinia.state.value[id] = state ? state() : {};
    const localState = toRefs(pinia.state.value[id]);

    const localGetters = Object.keys(getters || {}).reduce((memo, name) => {
      memo[name] = computed(() => {
        const store = pinia._s.get(id);
        return getters[name].call(store);
      });
      return memo;
    }, {});
    return Object.assign({}, localState, actions, localGetters);
  }
  createSetupStore(id, setup, pinia, true);
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
