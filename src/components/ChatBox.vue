<script setup lang="ts">
import { Socket } from "socket.io-client";
import { ref } from "vue";
//@ts-ignore
import { addTimestamp, removeTimestamp, getTimestamp, decoLogger } from "../utils.ts";

const props = defineProps<{
    socket: Socket,
    messages: string[],
}>();

let msgCount = ref(0);

function sendMessage() {
    //@ts-ignore Type 'HTMLElement | null' is not assignable to type 'HTMLInputElement'.
        //Type 'null' is not assignable to type 'HTMLInputElement'.ts(2322)
    let input: HTMLInputElement = document.getElementById("chat-input");
    let msg = addTimestamp(input?.value);
    props.messages.push(msg);
    props.socket.emit("message", msg);
    msgCount.value++;
    input.value = "";
    return msg;
}

props.socket.on("message-received", (data: string) => {
    console.log(`Received: ${data}`);
    props.messages.push(data);
    msgCount.value++;
})

</script>

<template>

<section id="chat">
    <ul class="chat-log" :count="msgCount">
        <template v-for="i in messages?.length">
            <li 
                :data-time="getTimestamp(messages?.[i-1])">{{ removeTimestamp(messages?.[i-1]) }}
                </li>
        </template>
    </ul>
    <div class="input">
        <input
            type="text" 
            id="chat-input" 
            placeholder="Send a message"
            @change="sendMessage()"
            >
    </div>
</section>

</template>

<style scoped>
/* TODO: Add style for server messages. */
#chat {
    width: 100%;
    position: fixed;
    bottom: calc(0vh + 3rem);
}
.chat-log {
    font-size: large;
    width: 100%;
    min-height: 7.8em;
    background-color: hsla(0, 0%, 20%, 0.8);
    color: palegoldenrod;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    text-align: left;
    padding: 0.25em;
    list-style: none;
}

.chat-log > li::before {
    content: attr(data-time);
    font-size: small;
    margin-right: 0.5em;
    padding: 0.2em;
    color: white;
    background-color: #333;
    border-radius: 10%;
    vertical-align: middle;
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
    /* display: grid;
    grid-template-columns: 1fr 5rem; */
}
/* 
@media (max-width: 500px) {
    .chat-log {
        font-size: medium;
    }
} */
/* 
[data-time]::before {
    content: attr(data-time);
    font-size: small;
    margin-right: 1rem;
    padding: 0.2rem;
    color: white;
    background-color: #333;
    border-radius: 5%;
    vertical-align: middle;
} */

</style>