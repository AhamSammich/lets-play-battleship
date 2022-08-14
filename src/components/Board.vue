<script setup lang="ts">
import TargetSpace from "./TargetSpace.vue";
import ActionLog from "./ActionLog.vue";
import StatusBar from "./StatusBar.vue";
import ShipStatus from "./ShipStatus.vue";
import { reactive, ref, Ref, onMounted } from "vue";
import type { Socket } from "socket.io-client";
import { Message } from "../utils";
import { Fleet, Ship } from "../ship";
import { Board } from "../board";

const props = defineProps<{
  player: string;
  socket: Socket;
  actions: string[];
}>();

// =========================
// REACTIVE / REF
// =========================

// Triggers ActionLog update
let actionCount = ref(0);

// Triggers ShipStatus update
let hideStatus = ref(false);
let fleet = reactive(
  new Fleet(props.player, ["Carrier", "Cruiser", "Destroyer", "Submarine", "Frigate"])
);

// Triggers TargetSpace update
let board = reactive(new Board("main", 10, 10));

// Triggers StatusBar update
let myTurn = ref(false);
let gameResult: Ref<"win" | "lose" | null> = ref(null);

onMounted(() => {
  setTimeout(() => (hideStatus.value = true), 2500);
});

async function flashStatus() {
  hideStatus.value = false;
  setTimeout(() => (hideStatus.value = true), 1500);
}

function sendTargetId(targetId: string | null): void {
  if (targetId == null) return;
  if (myTurn.value === false) return;
  props.socket.emit("attack", Message.format(targetId, { from: props.socket.id }));
}

function checkForHit(targetId: string): void {
  let ship = fleet.handleAttack(targetId);
  if (ship) flashStatus();
  let result = ship ? "hit" : "miss";
  sendHitOrMiss(result, targetId);
}

function sendHitOrMiss(result: string, target: string): void {
  let resultMsg = `${result.toUpperCase()} at ${target}`;
  let resultData = Message.format(resultMsg, {
    from: props.socket.id,
    data: { target, result },
  });
  props.actions.unshift(Message.format(resultMsg, { data: { result } }));
  actionCount.value++;
  props.socket.emit("attack-result", resultData);
}

function disableGrid() {
  const grid: HTMLElement | null = document.querySelector(".grid");
  grid?.style.setProperty("pointer-events", "none");
}

function enableGrid() {
  const grid: HTMLElement | null = document.querySelector(".grid");
  grid?.style.removeProperty("pointer-events");
}

function sendStatus(shipName: string) {
  props.socket.send(
    Message.format(`You sank ${props.player}'s ${shipName}!`, { from: "Status Report" })
  );
}

function endGame() {
  props.socket.emit("game-over");
  gameResult.value = "lose";
  setTimeout(() => (hideStatus.value = false), 1500);
  disableGrid();
  props.socket.send(
    Message.format(`Congratulations! You've won!`, { from: "Status Report" })
  );
}

// function handleSpecial(ship: Ship) {
//   let special: SpecialCallback = getSpecial(ship)
// }

// =========================
// LISTENERS
// =========================

props.socket.on("player-turn", (id: string) => {
  if (gameResult.value !== null) return;
  myTurn.value = id === props.socket.id;
  myTurn.value ? enableGrid() : disableGrid();
});

props.socket.on("incoming-result", (json: string) => {
  let result = Message.parse(json, "result");
  let targetId = Message.parse(json, "target");
  props.actions.unshift(json);
  actionCount.value++;
  board.getSpaceById(targetId).result = result.toLowerCase();
});

props.socket.on("incoming-attack", (json) => {
  let targetId: string = Message.parse(json, "message");
  checkForHit(targetId);
});

props.socket.on("victory", () => {
  gameResult.value = "win";
  setTimeout(() => (hideStatus.value = false), 1500);
  disableGrid();
  props.socket.emit(
    "message",
    Message.format(`You've lost... Better luck next time!`, { from: "Status Report" })
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
    @click="() => (hideStatus = !hideStatus)"
  />
  <section :id="player" class="board">
    <ul class="header">
      <template v-for="x in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']">
        <li>{{ x }}</li>
      </template>
    </ul>
    <div class="grid">
      <template v-for="y in 10">
        <div class="row" :data-row="y">
          <template v-for="x in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']">
            <TargetSpace
              :column="x"
              :row="y"
              :result="board.getSpaceById(`${x}-${y}`).result"
              @attack="(id: string | null) => sendTargetId(id)"
            />
          </template>
        </div>
      </template>
    </div>
    <ActionLog :actionCount="actionCount" :actions="actions" />
  </section>
</template>

// ================================== // STYLE // ==================================

<style>
.board {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

@media (orientation: portrait) {
  .board {
    --board-top: var(--status-bar);
  }
}

ul.header {
  width: 100%;
  /* height: var(--square-size); */
  font-size: smaller;
  font-weight: bold;
  color: hsl(0, 0%, 20%);
  margin-top: var(--board-top);
  padding-bottom: 0.5em;
  display: grid;
  grid-template-columns: repeat(10, var(--square-size));
  list-style: none;
}

.row {
  display: flex;
  flex-direction: row;
  gap: 0;
}

.row::after {
  content: attr(data-row);
  font-size: smaller;
  font-weight: bold;
  color: hsl(0, 0%, 20%);
  width: 2em;
  padding-top: 0.5em;
  padding-left: 0.5em;
  margin-right: -2.5em;
  vertical-align: middle;
}
</style>
