<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Board from "./components/Board.vue";
import NavBar from "./components/NavBar.vue";
import ChatBox from "./components/ChatBox.vue";
import io from "socket.io-client";
//@ts-ignore
import { addTimestamp } from "../src/utils.ts";

const socket = io('http://localhost:5500');


</script>

<template>
  <section class="play-area">
    <Board 
      owner="Player-1" 
      :socket=socket
      :actions="[]" 
      />
  </section>
  <ChatBox 
    :socket=socket
    :messages="[addTimestamp('Connected to chat.')]"
    />
  <NavBar position="bottom" />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 3vh;
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
</style>
