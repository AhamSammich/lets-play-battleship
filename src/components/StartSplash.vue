<script setup lang="ts">
// const props = defineProps<{
//   hidden: boolean
// }>();

const emits = defineEmits(["new-player"]);

function createPlayer() {
  // @ts-ignore
  let username = document.getElementById("user")?.value;
  let player = {
    "name": username
  }
  emits("new-player", player);
}
</script>

<template>
<!-- TODO Add a title -->
  <form class="splash" @submit.prevent="createPlayer()">
  <!-- Quick Play -->
  <!-- emit "start-game" w/ username -->
    <input
      required
      id="user"
      type="text"
      maxlength="15"
      pattern="[A-Za-z0-9_-]+"
      placeholder="Enter username"
    />
    <button type="submit">Join Game</button>

  <!-- FEATURE How To Play -->
  <!-- link to help page -->

  <!-- FEATURE Send Invite -->

  <!-- FEATURE Login -->
  </form>
  <!-- TODO Add "Connecting..." splash -->
</template>

<style scoped>

.splash {
  height: 90vh;
  width: 90vw;
  margin: 0 auto;
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
  font-family: inherit;
  padding: 0.25rem 0.5rem;
  height: 5rem;
  width: 20rem;
  background-color: var(--app-white);
  color: var(--app-black);
  border: 0.05rem solid  var(--app-white);
  border-radius: 0.3rem;
  box-shadow: 0.05rem -0.05rem 0.5rem 0.1rem hsl(0 0% 20% / 0.5);
}

button {
  font-weight: bold;
  background-color: var(--app-blue);
  color: lightgoldenrodyellow;
}

button:hover {
  background-color: lightgoldenrodyellow;
  color: var(--app-blue);
  cursor: pointer;
}
</style>
