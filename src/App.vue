<script setup lang="ts">
import StartSplash from "./components/StartSplash.vue";
import Board from "./components/Board.vue";
import NavBar from "./components/NavBar.vue";
import ChatBox from "./components/ChatBox.vue";
import { Socket, io } from "socket.io-client";
import { ref } from "vue";
import { Player } from "./game";

let playerName = ref("");
let socket: Socket = io("http://localhost:5500");
const fullChat = ref(false);
const ready = ref(false);

function startGame(player: Player) {
  playerName.value = player.name;
  document.getElementById("splash")?.classList.add("hidden");
  ready.value = true;
}
</script>

<template>
  <section id="splash" class="splash">
    <StartSplash @new-player="(player: Player) => startGame(player)"/>
  </section>
  <template v-if="ready">
    <section class="play-area">
      <Board :player="playerName" :socket="socket" :actions="[]" />
    </section>
    <ChatBox :name="playerName" :socket="socket" :expanded="fullChat" />
    <NavBar position="bottom" @toggle-chat="() => (fullChat = !fullChat)" />
  </template>
</template>

<style>
@import url(
  'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,600;1,400&display=swap'
  );

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Rubik, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2vh;
}

body {
  font-size: 10px;
  width: clamp(320px, 100vw, 1000px);
  min-height: 100vh;
  background-color: hsl(0, 0%, 85%);
  display: grid;
  grid-template-rows: max-content 1fr max-content;
}

.play-area {
  display: flex;
  flex-direction: col;
  justify-content: center;
  align-items: center;
  gap: 1em;
}

.hidden {
  display: none;
}
</style>
