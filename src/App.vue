<script setup lang="ts">
import StartSplash from "./components/StartSplash.vue";
import Board from "./components/Board.vue";
import NavBar from "./components/NavBar.vue";
import ChatBox from "./components/ChatBox.vue";
import { Socket, io } from "socket.io-client";
import { Ref, ref } from "vue";
import { sleep } from "./utils";

interface Player {
  name: string;
}

let playerName = ref("");
let socket: Ref<Socket | null> = ref(null);
const fullChat = ref(false);
const ready = ref(false);

async function startGame(player: Player) {
  playerName.value = player.name;
  if (socket.value === null) socket.value = io("http://localhost:5500");

  if (socket.value?.disconnected) socket.value.connect();
  while (socket.value.disconnected) {
    console.log("%cConnecting...", "color: seagreen; font-weight: bold;");
    await sleep();
  }
  document.getElementById("splash")?.classList.add("hidden");
  ready.value = true;
  await sleep(3000);
  socket.value?.emit("player-ready", socket.value.id, player.name);
}

function leaveGame() {
  ready.value = false;
  socket.value?.disconnect();
  document.getElementById("splash")?.classList.remove("hidden");
}

function toggleChatSize() {
  fullChat.value = !fullChat.value;
}

</script>

<template>
  <section id="splash" class="splash">
    <StartSplash @new-player="(player: Player) => startGame(player)" />
  </section>
  <template v-if="ready">
    <section class="play-area">
      <Board :player="playerName" :socket="socket!" :actions="[]" />
    </section>
    <ChatBox :name="playerName" :socket="socket!" :expanded="fullChat" />
    <NavBar position="bottom" @toggle-chat="toggleChatSize" @logout="leaveGame" />
  </template>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,600;1,400&display=swap");

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
  margin-top: 2vh;
}

body {
  --app-bkgd: hsl(0, 0%, 85%);
  --app-blue: hsl(207 44% 49% / 0.9);
  --app-red: hsl(0 68% 42% / 0.9);
  --app-white: hsl(0 0% 96% / 0.9);
  --app-black: hsl(0 0% 20% / 0.9);
  font-size: 10px;
  width: clamp(320px, 100vw, 1000px);
  min-height: 100vh;
  background-color: var(--app-bkgd);
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
