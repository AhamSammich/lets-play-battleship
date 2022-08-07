<script setup lang="ts">

defineEmits(["new-player"]);
// onStartGame

function createPlayer() {
  let input = document.getElementById("user");
  let playerName = input? input.value : "Player";
  console.log(playerName);
  return {
    name: playerName
  }
}
</script>

<template>
  <section class="splash">
  <!-- Quick Play -->
  <!-- emit "start-game" w/ username -->
    <input
      required
      id="user"
      type="text"
      maxlength="15"
      placeholder="Enter username"
    />
    <button @pointerup="$emit('new-player', createPlayer())">Start Game</button>

  <!-- How To Play -->
  <!-- link to help page -->

  <!-- Join Game -->

  <!-- Login -->
  </section>
</template>

<style scoped>

.splash {
  height: 90vh;
  width: 90vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  z-index: 1;
}

input,
button {
  font-size: 2rem;
  padding: 0.25rem;
  height: 5rem;
  width: 20rem;
}
</style>
