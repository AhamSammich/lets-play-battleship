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
    <p class="uid">{{ playerName }} <span>ID:{{ playerId }}</span></p>
    <p class="turn-status"><small>{{ getStatusMsg() }}</small></p>
  </section>
</template>

<style scoped>
#status-bar {
  --color1: 207 44% 49%;
  --color2: 0 0% 20%;
  --alpha: 0.9;
  --hsl: var(--color2);
  --bar-color: hsl(var(--hsl) / var(--alpha));
  font-size: smaller;
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 1rem;
  position: fixed;
  top: 0vh;
  left: 0vw;
  z-index: 5;
  width: 100%;
  height: var(--status-bar);
  background-color: var(--bar-color);
  color: white;
  cursor: pointer;
}

#status-bar.active {
  --hsl: var(--color1);
}

p.uid {
  max-width: 60%;
  font-weight: bold;
  text-align: left;
}

p.uid > span {
  font-size: smaller;
  font-weight: normal;
  font-style: italic;
}

p.turn-status {
  width: 30%;
  transform-origin: center;
  animation: sway 10s alternate infinite linear;
  z-index: 1;
}

@media (orientation: landscape) {
  #status-bar {
    width: calc(50% - var(--nav-size));
    left: var(--nav-size);
  }
}

@media (max-width: 600px) {
  #status-bar {
    flex-direction: column;
  }

  p.uid, p.turn-status {
    max-width: 100%;
    width: 100%;
    text-align: center;
  }
}

@keyframes sway {
  from {
    transform: translateX(-15%);
  }
  50% {
    transform: translateX(0);
    }
  100% {
    transform: translateX(5%);
  }
}
</style>
