// 10x10 grid composed of Spaces // Change color of space based on click result.
<script setup lang="ts">
import TargetSpace from "./TargetSpace.vue";
import ActionLog from "./ActionLog.vue";
import StatusBar from "./StatusBar.vue";
import ShipStatus from "./ShipStatus.vue";
import { reactive, ref, onMounted } from "vue";
import { Socket } from "socket.io-client";
import { Message } from "../utils";
import { Fleet, Ship } from "../ship";

const props = defineProps<{
  player: string;
  socket: Socket;
  actions: string[];
}>();

let actionCount = ref(0);
let fleet = reactive(
  new Fleet(
    props.player, 
    ["Carrier", "Cruiser", "Destroyer", "Submarine", "Frigate"]
    ));
let opponent: string;
let myTurn = ref(false);
let hideStatus = ref(false);

onMounted(() => {
  props.socket.emit("ready", props.socket.id);
  setTimeout(() => hideStatus.value = true, 3000);
});

async function flashStatus() {
  hideStatus.value = false;
  setTimeout(() => hideStatus.value = true, 2000);
}

function registerOpponent(id: string) {
  opponent = id;
}

function isValidResult(result: any): boolean {
  return ["hit", "miss"].includes(result);
}

function sendTargetId(targetId: string | null): void {
  if (targetId == null) return;
  if (myTurn.value === false) return;
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
  let ship = fleet.handleAttack(targetId);
  if (ship) flashStatus();
  let result = ship ? "hit" : "miss";
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

props.socket.on("player-turn", (id: string) => {
  myTurn.value = (id === props.socket.id);
})

function sendStatus(shipName: string) {
  props.socket.emit(
    "message",
    Message.format(`You sank ${props.player}'s ${shipName}!`, "Status Report")
    );
}

//TODO: Check for victory/defeat.

</script>

<template>
  <StatusBar 
    :playerName="player" 
    :playerId="socket.id" 
    :playerTurn="myTurn" 
    @toggle-status="() => hideStatus = !hideStatus" />
  <ShipStatus :fleet="fleet" :collapse="hideStatus" @ship-sunk="(shipName) => sendStatus(shipName)"/>
  <section :id="player">
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
  padding-top: 1rem;
  padding-bottom: 0.5em;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  list-style: none;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 0;
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
