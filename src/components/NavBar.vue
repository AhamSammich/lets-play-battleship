<script setup lang="ts">
const props = defineProps<{
  position: "top" | "bottom" | "left" | "right";
}>();

const emits = defineEmits(["toggle-status", "toggle-chat", "logout"]);

function handleLogout(): void {
  // TODO Create Confirm.vue component;
  let yes = confirm("Are you sure you want to leave?");
  if (yes) emits("logout");
}

function toggleStatus(): void {
  document.getElementById("status-bar")?.click();
}
</script>

<template>
  <nav>
    <img src="../assets/location-target-icon.png" alt="status" @pointerup="toggleStatus" />
    <img src="../assets/chat-box.png" alt="chat" @pointerup="$emit('toggle-chat')" />
    <!-- <img src="../assets/settings-gear.png" alt="config" /> -->
    <img
      src="../assets/logout-line-icon.png"
      alt="exit"
      @pointerup="handleLogout"
    />
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: var(--nav-size);
  width: 100%;
  background-color: rgba(51, 51, 51, 0.5);
  color: ghostwhite;
  box-shadow: 0.1em -0.1em 0.3em 0.1em hsla(0, 0%, 20%, 0.9);
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0.25rem 5%;
}

@media (orientation: landscape) {
  nav {
    width: var(--nav-size);
    height: 100%;
    flex-direction: column;
    padding: 5% 0.25rem;
  }
}

img {
  height: var(--nav-size);
  transform: scale(0.75);
  cursor: pointer;
}
</style>
