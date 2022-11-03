<script setup>
import { useCounterStore1 } from "./stores/counter1";
import { useCounterStore2 } from "./stores/counter2";

const store1 = useCounterStore1();
const { increment } = useCounterStore1();

const handleClick1 = () => {
  // store1.increment(1);
  increment(1);
};

const store2 = useCounterStore2();
const handleClick2 = () => {
  store2.increment();
};
</script>

<template>
  <p>--------------options------------</p>
  {{ store1.count }} / {{ store1.double }}
  <button @click="handleClick1">修改状态</button>
  <hr />
  <p>-------------setup----------------</p>
  {{ store2.count }} / {{ store2.double }}
  <button @click="handleClick2">修改状态</button>
</template>
