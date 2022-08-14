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

function getServerUrl(): string {
  const devServer = window.location.host === "localhost:3000";
  let port = devServer ? 5055 : window.location.port;
  let url = devServer ? "http://localhost:5055" : window.location.origin;
  console.log(`%cServed on port ${port}`, "color: green; font-size: larger;");
  return url;
}

function openSocket(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    let style = document.body.style;
    let connectAttempts = 0;
    if (socket.value === null) socket.value = io(getServerUrl());
    while (socket.value.disconnected) {
      style.cursor = "progress";
      connectAttempts++;
      socket.value.connect();
      console.log("%cAttempting to connect...", "color: gold;");
      await sleep();
      if (connectAttempts >= 5) {
        style.removeProperty("cursor");
        reject(new Error("Multiple failures to connect."));
        break;
      }
    }
    style.removeProperty("cursor");
    socket.value.once("disconnect", async (reason) => {
      if (reason !== "io client disconnect") await openSocket();
    });
    resolve(socket.value.connected);
  });
}

async function startGame(player: Player) {
  playerName.value = player.name;
  let connected = false;
  try {
    connected = await openSocket();
  } catch (err: Error) {
    console.error(err.message);
  }
  if (connected === false) return;
  console.log("%cconnected.", "color: seagreen;");
  document.getElementById("splash")?.classList.add("hidden");
  StartSplash
  ready.value = true;
  await sleep(2000);
  socket.value?.emit("player-ready", socket.value.id, player.name);
}

function leaveGame() {
  window.location.reload();
}

function toggleChatSize() {
  fullChat.value = !fullChat.value;
  if (fullChat.value === true) document.getElementById("chat-input")?.focus();
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
    <ChatBox
      :name="playerName"
      :socket="socket!"
      :expanded="fullChat"
      @toggle-chat="toggleChatSize"
    />
    <NavBar position="bottom" @toggle-chat="toggleChatSize" @logout="leaveGame" />
  </template>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,600;0,800;0,900;1,300;1,400;1,600;1,800;1,900&display=swap');
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
  --square-size: 40px;
  --status-height: 30%;
  --status-bar: 1.5rem;
  --chat-input-height: 1.5rem;
  --nav-size: 2rem;
  --board-top: calc(var(--status-bar) + var(--chat-input-height));
  --board-height: calc(var(--square-size) * 10 + 15rem);

  --app-bkgd: hsl(0, 0%, 85%);
  --app-blue: hsl(207 44% 49% / 0.9);
  --app-red: hsl(0 68% 42% / 0.9);
  --app-white: hsl(0 0% 96% / 0.9);
  --app-black: hsl(0 0% 20% / 0.9);

  font-size: 10px;
  width: clamp(320px, 100vw, 100vw);
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

@media (min-height: 500px) {
  body {
    --square-size: 4vh;
    --status-bar: 2.5rem;
    --chat-input-height: 2.5rem;
    --nav-size: 4vh;
    font-size: large;
  }
}

@media (orientation: landscape) {
  body {
    --square-size: 3.5vw;
    --nav-size: 4vw;
    --board-top: 0vh;
  }

  @media (min-width: 800px) {
    body {
      --square-size: 4vw;
    }
  }

  .play-area {
    float: right;
    margin-right: 5%;
  }
}

@media (max-width: 400px) {
  body {
    --square-size: 30px;
  }
}

/* @media (max-height: 500px) and (orientation: landscape) {
  body {
    --font-size: 
    --square-size: 30px;
    --nav-size: 3rem;
  }
} */

.hidden {
  display: none;
}
</style>
