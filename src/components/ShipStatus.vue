<script setup lang="ts">
import { Ship, Fleet } from "../ship";
const props = defineProps<{
    fleet: Fleet;
    hidden: boolean;
}>();

</script>

<template>
    <ul class="fleet" :hidden="hidden">
        <template v-for="ship in fleet.ships">
            <li class="ship">
                <p :class="ship.isSunk? 'sunk': ''">{{ ship.name }}</p>
                <template v-if="ship.isSunk">
                    <p class="sunk">SUNK</p>
                </template>                
                <ul class="hp">
                    <template v-for="point in ship.hitPoints">
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
    transition: transform 300ms linear;
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
    color: red;
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

[hidden="true"] {
  transition: transform 300ms linear;
  transform: scaleY(0);
}
</style>
