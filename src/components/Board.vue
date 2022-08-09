<script setup lang="ts">
import TargetSpace from "./TargetSpace.vue";
import ActionLog from "./ActionLog.vue";
import StatusBar from "./StatusBar.vue";
import ShipStatus from "./ShipStatus.vue";
import { reactive, ref, Ref, onMounted } from "vue";
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
  new Fleet(props.player, ["Carrier", "Cruiser", "Destroyer", "Submarine", "Frigate"])
);
let myTurn = ref(false);
let hideStatus = ref(false);
let gameResult: Ref<"win" | "lose" | null> = ref(null);

onMounted(() => {
  setTimeout(() => (hideStatus.value = true), 3000);
});

async function flashStatus() {
  hideStatus.value = false;
  setTimeout(() => (hideStatus.value = true), 1000);
}

function isValidResult(result: any): boolean {
  return ["hit", "miss"].includes(result);
}

function sendTargetId(targetId: string | null): void {
  if (targetId == null) return;
  if (myTurn.value === false) return;
  props.socket.emit("attack", Message.format(targetId, props.socket.id));
}

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
  props.socket.emit("attack-result", resultData);
}

function updateBoard(targetId: string, result: string): void {
  if (!isValidResult(result)) return;
  const targetElement: any = document.getElementById(targetId);
  targetElement.classList.add(result);
  targetElement.setAttribute("checked", "");
}

function disableBoard() {
  const board: HTMLElement | null = document.querySelector(".board");
  board?.style.setProperty("pointer-events", "none");
}

function enableBoard() {
  const board: HTMLElement | null = document.querySelector(".board");
  board?.style.removeProperty("pointer-events");
}

function sendStatus(shipName: string) {
  props.socket.send(
    Message.format(`You sank ${props.player}'s ${shipName}!`, "Status Report")
  );
}

function endGame() {
  props.socket.emit("game-over");
  gameResult.value = "lose";
  setTimeout(() => (hideStatus.value = false), 1000);
  disableBoard();
  props.socket.send(
    Message.format(`Congratulations! You've won!`, "Status Report")
  );
}

function handleSpecial(ship: Ship) {
  // let special: SpecialCallback = getSpecial(ship)
}

// =========================
// LISTENERS
// =========================

props.socket.on("player-turn", (id: string) => {
  if (gameResult.value !== null) return;
  myTurn.value = (id === props.socket.id);
  myTurn.value ? enableBoard() : disableBoard();
});

props.socket.on("incoming-result", (json: string) => {
  let resultData = Message.parse(json, "message").split(" at ");
  let result = resultData[0].replace(" at ", "").trim();
  let targetId = resultData[1].trim();
  props.actions.unshift(json);
  actionCount.value++;
  updateBoard(targetId, result.toLowerCase());
});

props.socket.on("incoming-attack", (json) => {
  let targetId: string = Message.parse(json, "message");
  checkForHit(targetId);
});

props.socket.on("victory", () => {
  gameResult.value = "win";
  setTimeout(() => (hideStatus.value = false), 1000);
  disableBoard();
  props.socket.emit(
    "message",
    Message.format(`You've lost... Better luck next time!`, "Status Report")
  );
});
</script>

// ================================= // TEMPLATE // =================================

<template>
  <StatusBar
    :playerName="player"
    :playerId="socket.id"
    :playerTurn="myTurn"
    :game-result="gameResult"
    @toggle-status="() => (hideStatus = !hideStatus)"
  />
  <ShipStatus
    :fleet="fleet"
    :collapse="hideStatus"
    @ship-sunk="(shipName) => sendStatus(shipName)"
    @all-sunk="endGame()"
    @special=""
  />
  <section :id="player" class="board">
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

// ================================== // STYLE // ==================================

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
