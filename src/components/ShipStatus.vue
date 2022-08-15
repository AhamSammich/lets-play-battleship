<script setup lang="ts">
import { Ship, Fleet } from "../scripts/ship";
const props = defineProps<{
  fleet: Fleet;
  collapse: boolean;
}>();

const reportedSunk: string[] = [];

const emits = defineEmits(["ship-sunk", "all-sunk"]);

function checkSunk(ship: Ship): boolean {
  if (!ship.isSunk) return false;
  if (reportedSunk.includes(ship.name)) return true;
  reportedSunk.push(ship.name);
  emits("ship-sunk", ship.name);
  if (reportedSunk.length === 5) emits("all-sunk");
  return true;
}

function useSpecial({ target }: Event) {
  // let ship = fleet.ships.find(ship => ship.name === target.textContent);
  // emits("special", ship);
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
  font-size: larger;
  letter-spacing: 0.05em;
  width: 100%;
  padding: 0.25rem 1rem;
  background-color: hsl(0 0% 20% / 0.95);
  color: white;
  position: fixed;
  top: var(--status-bar);
  left: 0;
  transform-origin: top;
  transition: transform 100ms linear;
  z-index: 5;
}

[collapse="true"] {
  transform: scaleY(0);
}

.ship {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
  text-align: left;
}

.sunk {
  transform-origin: left;
  transform: scale(0.75);
  color: hsl(0, 0%, 60%);
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
  margin: 0.5em 0.25em;
  background-color: hsl(120 93% 79%);
  box-shadow: 0.05em -0.05em 0.1em 0.05em hsl(120 93% 79% / 0.5);
  border-radius: 0.1em;
}

@media (orientation: landscape) {
  .fleet {
    width: calc(50% - var(--nav-size));
    height: calc(100% - var(--status-bar) - var(--chat-input-height));
    top: calc(var(--status-bar) + var(--chat-input-height));
    left: var(--nav-size);
    transform-origin: left;
  }
  
  [collapse="true"] {
    transform: scaleX(0);
  }

  .ship {
    font-size: larger;
    margin: 5vh 2vw;
  }
}

</style>
