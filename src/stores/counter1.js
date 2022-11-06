import { defineStore } from "@/pinia";
// import { defineStore } from "pinia";

export const useCounterStore1 = defineStore("counter1", {
  state: () => {
    return {
      count: 0,
    };
  },
  getters: {
    double() {
      return this.count * 2;
    },
  },
  actions: {
    increment(payload) {
      this.count += payload;
    },
  },
});
