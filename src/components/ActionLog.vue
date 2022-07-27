<script setup lang="ts">
// @ts-ignore
import { removeTimestamp, getTimestamp } from "../utils.ts";

const props = defineProps<{
  actionCount: number;
  actions: string[];
}>();

function sortedActions() {
  return [...props.actions].reverse();
}

//TODO: Split log into Player/Opponent columns.
function toggleFullLog() {
  let log = document.querySelector(".expanded");
  let items = log ? Array.from(log.children) : null;
  log?.toggleAttribute("hidden");
  document.querySelector("#arrow")?.classList.toggle("rot-180");
  items?.[items.length - 1].scrollIntoView();
}

function getResultFromMsg(msg?: string): string | void {
  return removeTimestamp(msg)?.split(" ")[0].toLowerCase();
}
</script>

<template>
  <section class="log" id="action-log">
    <!-- Show most recent action at bottom of viewport -->
    <div class="collapsed" @pointerup="toggleFullLog()">
      <img src="../assets/history-line.png" alt="history" style="height: 2em" />
      <p>{{ removeTimestamp(actions?.[0]) }}</p>
      <img
        id="arrow"
        class="rot-180"
        src="../assets/chevron-top.png"
        alt="expand"
        style="height: 1em"
      />
    </div>

    <!-- Show full log as overlay -->
    <ul class="expanded" hidden>
      <template v-for="i in actionCount">
        <li
          :data-time="getTimestamp(sortedActions()[i - 1])"
          :class="getResultFromMsg(sortedActions()[i - 1])"
        >
          {{ removeTimestamp(sortedActions()[i - 1]) }}
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
.log {
  font-size: large;
  width: 100%;
  margin-top: 0.5rem;
  background-color: hsla(0, 0%, 20%, 0.5);
  color: palegoldenrod;
  border-radius: 3px;
  box-shadow: 0.1em -0.1em 0.3em 0.1em hsla(0, 0%, 20%, 0.9);
  cursor: pointer;
}

.collapsed {
  max-height: 3rem;
  padding: 0.25rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.expanded {
  font-size: medium;
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  background-color: hsla(0, 0%, 20%, 0.95);
  box-shadow: 0.1em -0.1em 0.3em 0.1em hsla(0, 0%, 20%, 0.9);
  border-radius: 3px;
  height: calc(100vh / 2);
  width: 100%;
  padding: 1em 2em;
  top: calc(-100vh / 2);
  overflow-y: scroll;
  list-style: none;
}

li {
  width: 100%;
}

li::after {
  content: attr(data-time);
  font-size: small;
  padding: 0.2em;
  color: palegoldenrod;
  background-color: #333;
  border-radius: 10%;
  vertical-align: middle;
  float: right;
}

.expanded::-webkit-scrollbar {
  background-color: hsl(0, 0%, 20%);
  width: 0.5rem;
}

.expanded::-webkit-scrollbar-thumb {
  background-color: white;
}
img {
  max-height: inherit;
  margin: 0.5em;
}

.hit {
  color: red;
}

.miss {
  color: whitesmoke;
}

.rot-180 {
  transform: rotate(180deg);
}

[hidden] {
  transition: transform 3s linear;
  transform: scaleY(0) translateY(100vh);
  opacity: 0;
  height: 0;
}

@keyframes collapse {
  to {
    transform: scaleY(0);
    opacity: 0;
  }
}
</style>
