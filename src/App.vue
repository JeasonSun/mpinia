<script setup>
import { useCounterStore1 } from "./stores/counter1";
import { useCounterStore2 } from "./stores/counter2";

const store1 = useCounterStore1();
const { increment } = useCounterStore1();

const handleClick1 = () => {
  // store1.increment(1);
  increment(1);
  // store1.$patch({count: 1000})
  // store1.$patch((state) => {
  //   state.count = 155;
  // });
  // store1.$subscribe((mutation, type) => {
  //   console.log("mutation", mutation);
  //   console.log("type", type);
  // });
};
store1.$onAction(({ after, onError }) => {
  console.log("before", store1.count);
  after(() => {
    console.log("after", store1.count);
  });
  after(() => {
    console.log("after", store1.count);
  });

  onError((error) => {
    console.log("error", error);
  });
});

const handleReset1 = () => {
  store1.$reset();
};

const handleDispose = () => {
  store1.$dispose();
};

const handleSetState = () => {
  store1.$state = { count: 12032 };
};

const store2 = useCounterStore2();
const handleClick2 = () => {
  // store2.increment();
  store2.$patch((state) => {
    state.count = 150;
  });
};
</script>

<template>
  <p>--------------options------------</p>
  {{ store1.count }} / {{ store1.double }}
  <button @click="handleClick1">修改状态</button>
  <button @click="handleReset1">重置状态</button>
  <button @click="handleDispose">解除响应式</button>
  <button @click="handleSetState">修改$state</button>

  <hr />
  <p>-------------setup----------------</p>
  {{ store2.count }} / {{ store2.double }}
  <button @click="handleClick2">修改状态</button>
</template>
