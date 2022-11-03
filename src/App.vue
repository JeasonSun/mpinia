<script setup>
import { useCounterStore1 } from "./stores/counter1";

const store1 = useCounterStore1();
const { increment } = useCounterStore1();

const handleClick1 = () => {
  // store1.increment(1);
  increment(1);
};
</script>

<template>
  <p>--------------options------------</p>
  {{ store1.count }} / {{ store1.double }}
  <button @click="handleClick1">修改状态</button>
  <hr />
</template>
