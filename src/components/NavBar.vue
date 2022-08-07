<script setup lang="ts">
const props = defineProps<{
  position: "top" | "bottom" | "left" | "right";
}>();

defineEmits(["toggle-chat"]);
</script>

<template>
  <nav>
    <img src="../assets/settings-gear.png" alt="config" />
    <img src="../assets/chat-box.png" alt="chat" @pointerup="$emit('toggle-chat')"/>
    <img src="../assets/book-question.png" alt="help" />
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  width: 100%;
  background-color: rgba(51, 51, 51, 0.5);
  color: ghostwhite;
  position: fixed;
  bottom: 0vh;
  padding: 0.25rem;
}

img {
  height: inherit;
  transform: scale(0.75);
  cursor: pointer;
}
</style>
