<script setup lang="ts">
import { Message } from "../utils";

const props = defineProps<{
  actionCount: number;
  actions: string[];
}>();

function sortedActions() {
  return [...props.actions].reverse();
}

function toggleFullLog() {
  let log = document.querySelector(".expanded");
  let items = log ? Array.from(log.children) : null;
  if (items === null || items.length === 0) return;
  log?.toggleAttribute("hidden");
  document.querySelector("#arrow")?.classList.toggle("rot-180");
  items[items.length - 1].scrollIntoView();
}
</script>

<template>
  <section class="log" id="action-log">
    <div class="collapsed" @pointerup="toggleFullLog()">
      <img src="../assets/history-line.png" alt="history" style="height: 2em" />
      <p 
        :data-from="Message.parse(actions?.[0], 'from')"
        :class="Message.parse(actions?.[0], 'result')"
      >
        {{ Message.parse(actions?.[0], "message") }}
      </p>
      <img
        id="arrow"
        class="rot-180"
        src="../assets/chevron-down.png"
        alt="expand"
        style="height: 1em"
      />
    </div>

    <!-- Show full log as overlay -->
    <ul class="expanded" hidden @pointerup="toggleFullLog()">
      <template v-for="i in actionCount">
        <li
          :data-from="Message.parse(sortedActions()[i - 1], 'from')"
          :class="Message.parse(sortedActions()[i - 1], 'result')"
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
  letter-spacing: 0.05em;
  font-weight: bold;
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
  align-items: flex-end;
  position: absolute;
  background-color: hsla(0, 0%, 20%, 0.9);
  box-shadow: 0.1em -0.1em 0.3em 0.1em hsla(0, 0%, 20%, 0.9);
  border-radius: 3px;
  height: 25em;
  width: 100%;
  padding: 1em;
  top: 2.75em;
  overflow-y: scroll;
  list-style: none;
  transform-origin: bottom;
  transition: transform 200ms linear;
}

.expanded::-webkit-scrollbar {
  background-color: hsl(0, 0%, 20%);
  width: 0.5rem;
}

.expanded::-webkit-scrollbar-thumb {
  background-color: white;
}

li {
  width: 100%;
  letter-spacing: 0.03em;
  text-align: left;
}

li.hit {
  color: red;
  text-shadow: 0.1em 0.1em 3em firebrick;
}

li.miss {
  color: whitesmoke;
  text-shadow: 0.1em 0.1em 3em whitesmoke;
}

li[data-from="None"] {
  text-align: right;
}

li::after,
li::before {
  font-size: x-small;
  padding: 0.2em 0.5em;
  border-radius: 10%;
  vertical-align: middle;
  text-shadow: none;
}

li::before {
  content: "You";
  color: lightgoldenrodyellow;
  background-color: steelblue;
  margin-right: 2em;
  float: left;
}

li[data-from="None"]::before,
li:not([data-from="None"])::after {
  display: none;
}

li[data-from="None"]::after {
  content: "Opp";
  color: white;
  background-color: hsl(0, 0%, 20%);
  margin-left: 2em;
  float: right;
}

img {
  max-height: inherit;
  margin: 0.5em;
  transition: transform 200ms linear;
}

p {
  animation: fadeFromLeft 1s ease-out;
  position: relative;
}

p::after {
  content: "";
  display: block;
  border-radius: 0.3em;
  height: 0.1em;
  width: 100%;
  position: absolute;
  margin-top: 0.6em;
  opacity: 0;
  animation: slideScale 3s linear infinite 1s;
}

p.hit::after {
  background-color: firebrick;
  box-shadow: 0 0 1em 0.01em red;
}

p.miss::after {
  background-color: white;
  box-shadow: 0 0 1em 0.01em whitesmoke;
}

p[data-from="None"] {
  animation: fadeFromRight 1s ease-out;
}

p[data-from="None"]::after {
  animation-direction: reverse;
}

@keyframes fadeFromLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideScale {
  from {
    transform-origin: left;
    transform: scaleX(3) scaleY(0);
    opacity: 0;
  }
  50% {
    transform: scaleX(0.25) scaleY(1);
    opacity: 1;
  }
  to {
    transform-origin: right;
    transform: scaleX(3) scaleY(0);
    opacity: 0;
  }
}

.rot-180 {
  transform: rotate(180deg);
}

[hidden] {
  transition: transform 200ms linear;
  transform: scaleY(0);
}

</style>
