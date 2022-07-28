<script setup lang="ts">
import { Socket } from "socket.io-client";
import { nextTick, ref } from "vue";
//@ts-ignore An import path cannot end with a '.ts' extension. Consider importing '../utils.js' instead.ts(2691)
import { Message } from "../utils.ts";

const props = defineProps<{
  socket: Socket;
  messages: string[];
}>();

let msgCount = ref(0);
let players: Record<string, string> = { server: "server" };

function registerPlayer(id: string) {
  if (Object.keys(players).includes(id)) return;
  let playerNumber = Object.keys(players).length + 1;
  players[id] = `Player-${playerNumber}`;
  console.log(players);
}

function sendMessage() {
  //@ts-ignore Type 'HTMLElement | null' is not assignable to type 'HTMLInputElement'.
  //Type 'null' is not assignable to type 'HTMLInputElement'.ts(2322)
  let input: HTMLInputElement = document.getElementById("chat-input");
  if (input == null || input.value == null) return;
  let json: string = Message.format(input.value, props.socket.id);
  props.socket.emit("message", json);
  updateChat(json);
  input.value = "";
}

props.socket.on("message-received", (json: string) => {
  registerPlayer(Message.parse(json, "from"));
  updateChat(json);
});

props.socket.on("server-info", (json: string) => {
  updateChat(json);
});

async function updateChat(json: string) {
  props.messages.push(json);
  msgCount.value++;
  await nextTick();
  Message.showLast(".chat-log");
}
</script>

<template>
  <section id="chat">
    <ul class="chat-log" :count="msgCount">
      <template v-for="i in messages?.length">
        <li
          :data-time="Message.parse(messages?.[i - 1], 'timestamp')"
          :from="players[Message.parse(messages?.[i - 1], 'from')] || 'Me'"
        >
          {{ Message.parse(messages?.[i - 1], "message") }}
        </li>
      </template>
    </ul>
    <div class="input">
      <input
        type="text"
        id="chat-input"
        placeholder="Send a message"
        @change="sendMessage()"
      />
    </div>
  </section>
</template>

<style scoped>
#chat {
  width: 100%;
  position: fixed;
  bottom: calc(0vh + 3rem);
}
.chat-log {
  font-size: large;
  width: 100%;
  height: 8em;
  color: palegoldenrod;
  background-color: hsla(0, 0%, 20%, 0.8);
  padding: 0.25em;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  overflow-y: scroll;
  text-align: left;
  list-style: none;
}

::after, ::before {
  display: block;
  width: fit-content;
  padding: 0.2em 0.5em;
  border-radius: 0.5em;
}

li {
  width: fit-content;
  padding: 0.5em;
  border-radius: 0.5em;
  background-color: #333;
  color: white;
}

li::after {
  content: attr(data-time);
  font-size: x-small;
  color: seashell;
  margin-left: 1em;
}

li::before {
  content: attr(from);
  font-size: xx-small;
  font-weight: bold;
  color: #333;
  background-color: palegoldenrod;
  margin-bottom: 0.5em;
}

li[from="server"],
li[from="server"]::after {
  color: lightgray;
  background-color: transparent;
}

li[from="server"]::before {
  color: #333;
  background-color: white;
}

li[from="Me"] {
  color: palegoldenrod;
  background-color: steelblue;
  align-self: flex-end;
}

li[from="Me"]::before {
  display: none;
}
.chat-log::-webkit-scrollbar {
  background-color: hsl(0, 0%, 20%);
  width: 0.5rem;
}

.chat-log::-webkit-scrollbar-thumb {
  background-color: white;
}

input {
  width: 100%;
  max-height: 2rem;
  padding: 0.25rem;
}
</style>
