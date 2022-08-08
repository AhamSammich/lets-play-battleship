<script setup lang="ts">
// @ts-ignore
import { Message } from "../utils.ts";

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
  let bar = document.querySelector(".log");
  let items = log ? Array.from(log.children) : null;
  log?.toggleAttribute("hidden");
  bar?.toggleAttribute("shifted");
  document.querySelector("#arrow")?.classList.toggle("rot-180");
  items?.[items.length - 1].scrollIntoView();
}

function getResultFromMsg(json?: string): string | void {
  if (json == null) return;
  let msg = Message.parse(json, "message");
  return msg?.split(" ")[0].toLowerCase();
}
</script>

<template>
  <section class="log" id="action-log">
    <!-- Show most recent action at bottom of viewport -->
    <div class="collapsed" @pointerup="toggleFullLog()">
      <img src="../assets/history-line.png" alt="history" style="height: 2em" />
      <p>{{ Message.parse(actions?.[0], "message") }}</p>
      <img
        id="arrow"
        class="rot-180"
        src="../assets/chevron-down.png"
        alt="expand"
        style="height: 1em"
      />
    </div>

    <!-- Show full log as overlay -->
    <ul class="expanded" hidden>
      <template v-for="i in actionCount">
        <li
          :data-time="Message.parse(sortedActions()[i - 1], 'timestamp')"
          :class="getResultFromMsg(sortedActions()[i - 1])"
        >
          {{ Message.parse(sortedActions()[i - 1], "message") }}
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
  transition: transform 300ms linear;
}

.collapsed {
  max-height: 3rem;
  padding: 0.25rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: height 300ms linear, transform 300ms linear;
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
  height: 25em;
  width: 100%;
  padding: 1em 2em;
  top: calc(-100vh / 2 - 2rem);
  overflow-y: scroll;
  list-style: none;
  transform-origin: bottom;
  transition: transform 200ms linear;
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
  transition: transform 200ms linear;
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
  transition: transform 200ms linear;
  transform: scaleY(0);
}
</style>
