import { ref, computed } from "vue";
import { defineStore } from "@/pinia";
// import { defineStore } from "pinia";

export const useCounterStore2 = defineStore("counter2", () => {
  const count = ref(0);
  const double = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, double, increment };
});
