<script setup lang="ts">
import { checkSuccess, chooseRandom, sleep } from "../scripts/utils";
export interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "BATTLE FLEET",
});

const emits = defineEmits(["new-player"]);

async function animateTitle() {
  const titleElem = document.getElementById("title");
  const img = document.querySelector("#sub");
  if (titleElem == null) return;
  img?.classList.add("loading");
  const letters = Array.from(titleElem.querySelectorAll("span"));

  for (let _ of letters) {
    chooseRandom(letters).style.color = checkSuccess(50) ? "firebrick" : "whitesmoke";
    await sleep();
  }
}

function createPlayer() {
  // @ts-ignore
  let username = document.getElementById("user")?.value;
  if (username == null) return;
  animateTitle();
  let player = {
    name: username,
  };
  emits("new-player", player);
}
</script>

<template>
  <form class="splash" @submit.prevent="createPlayer()">
    <div id="title-box">
      <h1 id="title">
        <template v-for="char in title">
          <span :data-i="title.indexOf(char)">{{ char }}</span>
        </template>
        <img id="sub" src="../assets/submarine-icon.png" alt="submarine image" />
      </h1>
      <p id="sub-title">A Vue.js/TypeScript Project</p>
    </div>
    <!-- Quick Play -->
    <!-- emit "start-game" w/ username -->
    <!-- TODO Add tooltip for desired format -->
    <input
      required
      id="user"
      type="text"
      maxlength="15"
      pattern="[A-Za-z0-9_-]+"
      placeholder="Enter username"
    />
    <button type="submit">Join Game</button>

    <!-- FEATURE How To Play -->
    <!-- link to help page -->

    <!-- FEATURE Send Invite -->

    <!-- FEATURE Login -->
  </form>
  <footer>
    <a href="https://www.github.com/ahamsammich/battlefleet">
      <img id="github" src="../assets/GitHub-Mark-64px.png" alt="Link to GitHub">
      <p>Follow this project on GitHub</p>
    </a>
  </footer>
  <!-- TODO Add "Connecting..." splash -->
</template>

<style scoped>
footer {
  position: absolute;
  bottom: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

a, a>p {
  text-decoration: none;
  font-size: smaller;
}

#github {
  width: 40px;
  opacity: 0.8;
}

.splash {
  height: 90vh;
  width: 90vw;
  margin: 0 auto;
  /* background-color: hsl(0 0% 20% / 0.1); */
  border-radius: 0.3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  z-index: 1;
}

#title-box {
  font-size: 2.5rem;
}

h1 {
  font-style: italic;
  letter-spacing: 0.1rem;
  color: steelblue;
  position: relative;
  text-transform: uppercase;
  text-shadow: 0.1rem -0.1rem 0.1rem var(--app-black);
  white-space: nowrap;
}

p {
  font-size: medium;
  color: var(--app-black);
}

img#sub {
  width: 20rem;
  position: absolute;
  opacity: 0.15;
  left: 50%;
  bottom: 0.2em;
  /* transform-origin: center; */
  transform: translate(-50%, 0);
  z-index: -1;
  animation: floatUp 2s ease-in-out;
}

img.loading {
  /* transition: opacity 2s linear; */
  animation: sinkDown 2s ease-in-out;
  opacity: 0;
}

@keyframes floatUp {
  from {
    transform: translate(-70%, 20%);
    opacity: 0;
  }
}

@keyframes sinkDown {
  from {
    opacity: 0.15;
  }
  to {
    transform: translate(-30%, 20%);
    opacity: 0;
  }
}

input,
button {
  font-size: 2rem;
  font-family: inherit;
  padding: 0.25rem 0.5rem;
  height: 5rem;
  width: 20rem;
  background-color: var(--app-white);
  color: var(--app-black);
  border: 0.05rem solid var(--app-white);
  border-radius: 0.3rem;
  box-shadow: 0.05rem -0.05rem 0.5rem 0.1rem hsl(0 0% 20% / 0.5);
}

button {
  font-weight: bold;
  background-color: var(--app-blue);
  color: lightgoldenrodyellow;
}

button:hover {
  background-color: lightgoldenrodyellow;
  color: var(--app-blue);
  cursor: pointer;
}

*:not(img#sub) {
  animation: fadeIn 2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
}

@media (max-width: 500px) {
  .splash {
    transform: scale(0.8);
  }

  h1 {
    white-space: inherit;
  }

  img#sub {
    transform: translate(-50%, -50%);
  }
}
</style>
