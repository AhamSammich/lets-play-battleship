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
  <section id="status-bar" :class="playerTurn ? 'active' : ''" @click="$emit('toggle-status')">
    <p><strong>{{ playerName }}</strong> <em><small>ID: {{ playerId }}</small></em></p>
    <p class="turn-status"><small>{{ getStatusMsg() }}</small></p>
  </section>
</template>

<style scoped>
#status-bar {
  --color1: hsl(207 44% 49% / 0.9);
  --color2: hsl(0 0% 20% / 0.9);
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 1rem;
  position: fixed;
  top: 0vh;
  left: 0vw;
  z-index: 5;
  width: 100%;
  height: var(--status-bar);
  background-color: var(--color2);
  color: white;
  cursor: pointer;
}

@media (orientation: landscape) {
  #status-bar {
    width: calc(100% - var(--nav-size));
    left: var(--nav-size);
  }
}

#status-bar.active {
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
