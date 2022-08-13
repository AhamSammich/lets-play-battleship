<script setup lang="ts">

const props = defineProps<{
  row: number;
  column: number | string;
  result: string | null;
}>();


const emits = defineEmits(["attack"]);

const id: string = `${props.column}-${props.row}`;

function emitTargetId(): string | void {
  if (props.result !== null) {
    console.log(`${id} already checked.`);
    return;
  }
  return id;
}
</script>

<template>
  <div :id="id" :class="result" @pointerup="$emit('attack', emitTargetId())"></div>
</template>

<style scoped>

div {
  width: var(--square-size);
  height: var(--square-size);
  background-color: var(--app-blue);
  border: calc(var(--square-size) * 0.01) solid var(--app-bkgd);
  border-collapse: collapse;
  border-radius: calc(var(--square-size) * 0.03);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

div:hover {
  box-shadow: inset 0 0 0.5em 0.1em hsla(0, 0%, 20%, 0.3),
    inset 0 0 0.5em 0.5em lightgoldenrodyellow;
}

.hit {
  background-color: var(--app-red);
}

.miss {
  background-color: var(--app-white);
}
</style>
