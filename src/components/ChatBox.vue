<script setup lang="ts">
import { Socket } from "socket.io-client";
import { ref, Ref, onUpdated } from "vue";
//@ts-ignore An import path cannot end with a '.ts' extension. Consider importing '../utils.js' instead.ts(2691)
import { Message } from "../utils.ts";

const props = defineProps<{
  name?: string;
  socket: Socket;
  expanded: boolean;
}>();

const msgCount = ref(0);
const messages: Ref<string[]> = ref([]);
const players: Record<string, string> = { server: "server" };

function registerPlayer(id: string) {
  if (Object.keys(players).includes(id)) return;
  let playerNumber = Object.keys(players).length + 1;
  // players[id] = `Player-${playerNumber} `;
  players[id] = id;
  console.log(players);
}

function sendMessage() {
  //@ts-ignore Type 'HTMLElement | null' is not assignable to type 'HTMLInputElement'.
  //Type 'null' is not assignable to type 'HTMLInputElement'.ts(2322)
  let input: HTMLInputElement = document.getElementById("chat-input");
  if (input == null || input.value == null) return;
  let json: string = Message.format(input.value, props.name);
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
  messages.value.push(json);
  msgCount.value++;
}

onUpdated(() => {
  setTimeout(() => Message.showLast(".chat-log"), 200);
});
</script>

<template>
  <section id="chat">
    <ul class="chat-log" :count="msgCount" :expanded="expanded">
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
  bottom: calc(0vh + 2rem);
}
.chat-log {
  font-size: large;
  width: 100%;
  height: 7.5em;
  color: palegoldenrod;
  background-color: hsla(0, 0%, 20%, 0.7);
  padding: 0.5em 1em;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  overflow-y: scroll;
  text-align: left;
  list-style: none;
  transition: height 100ms linear,
    background-color 300ms linear;
}

.chat-log[expanded="true"] {
  height: calc(100vh - 5rem);
  background-color: hsla(0, 0%, 20%, 0.85);
}

::after,
::before {
  display: block;
  width: -moz-fit-content;
  width: fit-content;
  padding: 0.2em 0.5em;
  border-radius: 0.5em;
}

li {
  width: -moz-fit-content;
  width: fit-content;
  padding: 0.5em 0.75em;
  color: white;
  background-color: #333;
  border-radius: 0.5em;
}

li::after {
  content: attr(data-time);
  width: 100%;
  font-size: x-small;
  color: seashell;
  text-align: right;
}

li::before {
  content: attr(from);
  font-size: xx-small;
  font-weight: bold;
  color: #333;
  background-color: lightgoldenrodyellow;
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
  color: lightgoldenrodyellow;
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
  background-color: lightgoldenrodyellow;
}

input {
  width: 100%;
  height: 2rem;
  padding: 0.25rem;
  background-color: ghostwhite;
  border: 0.2rem inset whitesmoke;
}
</style>
