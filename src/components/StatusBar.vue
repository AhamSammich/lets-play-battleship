<script setup lang="ts">
const props = defineProps<{
  playerName: string;
  playerId: string;
  playerTurn: boolean;
  gameResult: "win" | "lose" | null;
}>();

const emits = defineEmits(["toggle-status"]);

function getStatusMsg(): string {
  if (props.gameResult) {
    return `YOU ${props.gameResult.toUpperCase()}`;
  }
  if (props.playerTurn) {
    return "It's your turn. Select a target...";
  }
  return "Waiting for Opponent...";
}
</script>

<template>
  <section :class="playerTurn ? 'active' : ''" @pointerup="$emit('toggle-status')">
    <p>{{ playerName }} ( ID: {{ playerId }} )</p>
    <p class="turn-status">{{ getStatusMsg() }}</p>
  </section>
</template>

<style scoped>
section {
  --color1: hsl(207 44% 49% / 0.9);
  --color2: hsl(0 0% 20% / 0.9);
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0.5rem;
  position: fixed;
  top: 0vh;
  left: 0vw;
  width: 100%;
  height: 1.5rem;
  background-color: var(--color2);
  color: white;
  cursor: pointer;
}

section.active {
  background-color: var(--color1);
}

p.turn-status {
  transform-origin: right;
  animation: textCrawl 10s infinite linear;
}

@keyframes textCrawl {
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
