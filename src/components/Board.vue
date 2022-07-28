// 10x10 grid composed of Spaces // Change color of space based on click result.
<script setup lang="ts">
import TargetSpace from "./TargetSpace.vue";
import ActionLog from "./ActionLog.vue";
import { ref } from "vue";
import { Socket } from "socket.io-client";
// @ts-ignore
import { checkSuccess, Message } from "../utils.ts";

const props = defineProps<{
  owner: string;
  socket: Socket;
  actions: string[];
}>();

let actionCount = ref(0);
let opponent: string;

//TODO: Track player turn.
//TODO: Display player/opponent id or name.
function registerOpponent(id: string) {
  opponent = id;
}

function isValidResult(result: any): boolean {
  return ["hit", "miss"].includes(result);
}

function sendTargetId(targetId: string | null): void {
  if (targetId == null) return;
  props.socket.emit("attack", Message.format(targetId, props.socket.id));
}

props.socket.on("incoming-attack", (json) => {
  let opponentId: string = Message.parse(json, "from");
  if (opponentId === props.socket.id) return;
  if (opponent == undefined) registerOpponent(opponentId);
  let targetId: string = Message.parse(json, "message");
  checkForHit(targetId);
});

function checkForHit(targetId: string): void {
  //TODO: Implement actual ship position data.
  const result = checkSuccess(50) ? "hit" : "miss";
  let resultMsg = `${result.toUpperCase()} at ${targetId}`;
  sendHitOrMiss(resultMsg);
}

function sendHitOrMiss(resultMsg: string): void {
  let resultData = Message.format(resultMsg, props.socket.id);
  props.actions.unshift(Message.format(`Opponent ${resultMsg}`));
  actionCount.value++;
  props.socket.emit("attack-result", resultData, opponent);
}

props.socket.on("incoming-result", (json: string) => {
  let resultData = Message.parse(json, "message").split(" at ");
  let result = resultData[0].replace(" at ", "").trim();
  let targetId = resultData[1].trim();
  props.actions.unshift(json);
  actionCount.value++;
  updateBoard(targetId, result.toLowerCase());
});

function updateBoard(targetId: string, result: string): void {
  if (!isValidResult(result)) return;
  const targetElement: any = document.getElementById(targetId);
  targetElement.classList.add(result);
  targetElement.setAttribute("checked", "");
}
</script>

<template>
  <section :id="owner">
    <ul class="header">
      <template v-for="x in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']">
        <li>{{ x }}</li>
      </template>
    </ul>
    <template v-for="y in 10">
      <div class="row" :data-row="y">
        <template v-for="x in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']">
          <TargetSpace
            :column="x"
            :row="y"
            @attack="(id: string | null) => sendTargetId(id)"
          />
        </template>
      </div>
    </template>
    <ActionLog :actionCount="actionCount" :actions="actions" />
  </section>
</template>

<style>
section {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

ul.header {
  width: 100%;
  font-size: medium;
  font-weight: bold;
  color: hsl(0, 0%, 20%);
  padding-bottom: 0.5em;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  list-style: none;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 0;
  /* box-shadow: 0.1em -0.1em 0.3em 0.1em hsla(0, 0%, 20%, 0.9); */
}

.row::after {
  content: attr(data-row);
  font-size: large;
  font-weight: bold;
  color: hsl(0, 0%, 20%);
  width: 2em;
  padding-top: 0.5em;
  padding-left: 0.5em;
  margin-right: -2.5em;
  vertical-align: middle;
}
</style>
