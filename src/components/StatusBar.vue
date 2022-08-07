<script setup lang="ts">
const props = defineProps<{
    playerName: string;
    playerId: string;
    playerTurn: boolean;
}>();

function checkTurn() {
    return props.playerTurn;
}

</script>

<template>
    <section :class="playerTurn ? 'active' : ''">
        <p>{{ playerName }} ({{ playerId }})</p>
        <template v-if="checkTurn()"><p>Your Turn</p></template>
        <template v-if="!checkTurn()"><p>Opponent Turn</p></template>
    </section>
</template>

<style scoped>
section {
    --color1: hsl(207 44% 49% / 0.8);
    --color2: hsl(0 0% 20% / 0.8);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    position: fixed;
    top: 0vh;
    left: 0vw;
    width: 100%;
    height: 1.5rem;
    background-color: var(--color2);
    color: white;
}

section.active {
    background-color: var(--color1);
}

</style>