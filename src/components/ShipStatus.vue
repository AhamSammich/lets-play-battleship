<script setup lang="ts">
import { Ship, Fleet } from "../ship";
const props = defineProps<{
  fleet: Fleet;
  collapse: boolean;
}>();

const reportedSunk: Ship[] = [];

const emits = defineEmits(["ship-sunk"]);

function checkSunk(ship: Ship): boolean {
  if (!ship.isSunk) return false;
  if (reportedSunk.includes(ship)) return true;
  reportedSunk.push(ship);
  emits("ship-sunk", ship.name);
  return true;
}
</script>

<template>
  <ul class="fleet" :collapse="collapse">
    <template v-for="ship in fleet.ships">
      <li class="ship">
        <p :class="ship.isSunk ? 'sunk' : ''">{{ ship.name }}</p>
        <template v-if="checkSunk(ship)">
          <p class="sunk">SUNK</p>
        </template>
        <ul class="hp">
          <template v-for="_ in ship.hitPoints">
            <li></li>
          </template>
        </ul>
      </li>
    </template>
  </ul>
</template>

<style scoped>
* {
  list-style: none;
}
.fleet {
  font-size: large;
  letter-spacing: 0.05em;
  width: 100%;
  padding: 0.25em 1em;
  background-color: hsl(0 0% 20% / 0.95);
  color: white;
  position: fixed;
  top: 1.5rem;
  left: 0vw;
  transform-origin: top;
  transition: transform 100ms linear;
  z-index: 5;
}

.ship {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5em;
  text-align: left;
}

.sunk {
  transform-origin: left;
  transform: scale(0.75);
  color: hsl(0, 0%, 60%);
  /* text-shadow: 0.1em -0.05em 0.1em palevioletred; */
}

.hp {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.hp > * {
  width: 1em;
  height: 0.5em;
  margin: 0.2em;
  background-color: palegreen;
  box-shadow: 0.05em -0.05em 0.1em 0.05em lightseagreen;
  border-radius: 0.1em;
}



[collapse="true"] {
  transform: scaleY(0);
}

</style>
