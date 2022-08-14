<script setup lang="ts">
import { Socket } from "socket.io-client";
import { ref, Ref, onUpdated } from "vue";
import { Message } from "../utils";

const props = defineProps<{
  name?: string;
  socket: Socket;
  expanded: boolean;
}>();

const emits = defineEmits(["toggle-chat"]);

const msgCount = ref(0);
const messages: Ref<string[]> = ref([]);
const players: Record<string, string> = { Server: "Server" };

function registerPlayer(id: string) {
  if (Object.keys(players).includes(id)) return;
  players[id] = id;
}

function sendMessage(e: { target: any }): void {
  if (e.target == null) return;
  let json: string = Message.format(e.target.value, { "from": props.name });
  props.socket.send(json);
  updateChat(json);
  e.target.value = "";
}

props.socket.on("message-received", (json: string) => {
  registerPlayer(Message.parse(json, "from"));
  updateChat(json);
});

props.socket.on("server-info", (json: string) => {
  updateChat(json);
});

props.socket.on("disconnect", (reason) => {
  updateChat(
    Message.format(`Disconnected from server. ( Reason: ${reason} )`, { from: "Server" })
  );
});

props.socket.on("connect", () => {
  updateChat(
    Message.format(`You are connected. ( ID: ${props.socket.id} )`, { from: "Server" })
  );
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
    <ul
      class="chat-log"
      :count="msgCount"
      :expanded="expanded"
      @pointerup="$emit('toggle-chat')"
    >
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
        @change="sendMessage"
      />
    </div>
  </section>
</template>

<style scoped>
#chat {
  --input-bottom: 2rem;
  --input-height: 2rem;
  width: 100%;
}
.chat-log {
  font-size: large;
  width: 100%;
  color: palegoldenrod;
  background-color: hsla(0, 0%, 20%, 0.7);
  padding: 0.5em 1em;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  position: fixed;
  overflow-y: scroll;
  text-align: left;
  list-style: none;
}

.chat-log::-webkit-scrollbar {
  background-color: hsl(0, 0%, 20%);
  width: 0.5rem;
  height: 0.5rem;
}

.chat-log::-webkit-scrollbar-thumb {
  background-color: lightgoldenrodyellow;
}

input {
  font-size: inherit;
  width: 100%;
  height: var(--chat-input-height);
  padding: 0.25rem 1rem;
  position: fixed;
  left: 0;
  bottom: var(--nav-size);
  background-color: ghostwhite;
  border: none;
  box-shadow: inset 0 0 0.2rem var(--app-black);
}

@media (orientation: portrait) {
  .chat-log {
    max-height: calc(100% - var(--board-height));
    bottom: calc(var(--nav-size) + var(--chat-input-height));
    transform-origin: bottom;
    transition: height 100ms linear, background-color 300ms linear;
    padding: 0.5em;
  }

  .chat-log[expanded="false"] {
    height: fit-content;
  }

  .chat-log[expanded="true"] {
    max-height: unset;
    height: calc(100% - var(--status-bar) - var(--nav-size) - var(--chat-input-height));
    background-color: hsla(0, 0%, 20%, 0.85);
  }
}

@media (orientation: landscape) {
  .chat-log {
    height: calc(100% - var(--status-bar));
    width: calc(100% - var(--nav-size));
    top: calc(var(--status-bar) + var(--chat-input-height));
    left: var(--nav-size);
    bottom: 0;
    padding-bottom: 2rem;
    transform-origin: left;
    transition: width 100ms linear, background-color 300ms linear;
  }

  .chat-log[expanded="false"] {
    width: calc(50% - var(--nav-size));
  }

  .chat-log[expanded="true"] {
    background-color: hsla(0, 0%, 20%, 0.85);
    max-height: unset;
  }

  input {
    width: calc(50% - var(--nav-size));
    top: var(--status-bar);
    left: var(--nav-size);
  }
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
  background-color: var(--app-black);
  border-radius: 0.5em;
  margin-bottom: 1rem;
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
  color: var(--app-black);
  background-color: lightgoldenrodyellow;
  margin-bottom: 0.5em;
}

li[from="Server"],
li[from="Server"]::after {
  color: lightgray;
  background-color: transparent;
}

li[from="Server"]::before {
  color: var(--app-black);
  background-color: white;
}

li[from="Me"] {
  color: lightgoldenrodyellow;
  background-color: var(--app-blue);
  align-self: flex-end;
}

li[from="Me"]::before {
  display: none;
}

li[from="Status Report"] {
  color: white;
  background-color: var(--app-red);
}
</style>
