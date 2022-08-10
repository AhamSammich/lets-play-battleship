<script setup lang="ts">

const props = defineProps<{
  row: number;
  column: number | string;
  result: string | null;
}>();

let checked = false;

const emits = defineEmits(["attack"]);

const id: string = `${props.column}-${props.row}`;

function emitTargetId(): string | void {
  if (checked) {
    console.log(`${id} already checked.`);
    return;
  }
  checked = true;
  return id;
}
</script>

<template>
  <div :id="id" :class="result" @pointerup="$emit('attack', emitTargetId())"></div>
</template>

<style scoped>
div {
  /* width: clamp(30px, calc(100vw / 15), 40px); */
  width: 40px;
  aspect-ratio: 1/1;
  background-color: steelblue;
  border: 0.05em solid white;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

div:hover {
  box-shadow: inset 0 0 0.5em 0.1em hsla(0, 0%, 20%, 0.3),
    inset 0 0 0.5em 0.5em palegoldenrod;
}

.hit {
  background-color: firebrick;
}

.miss {
  background-color: whitesmoke;
}
</style>
