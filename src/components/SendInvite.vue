<script setup lang="ts">
import { IconSend } from '@iconify-prerendered/vue-mdi';

const props = defineProps<{
    senderName: string
}>()

const shareData = {
    title: "Let's Play Battleship",
    text: `${props.senderName || 'A friend'} has challenged you to Battleship!`,
    url: window.location.href,
}

async function sendLink() {
    const btn = document.getElementById("send-invite");
    const resultMsg = document.getElementById("invite-result");
    try {
        await navigator.share(shareData);
        resultMsg!.textContent = "Invite sent!"
        resultMsg!.classList.remove("hidden");
    } catch (err) {
        resultMsg!.textContent = `Error: ${err}`;
        resultMsg!.classList.remove("hidden");
    }
}

</script>

<template>
    <div id="send-invite" @click="sendLink()">
        Send Invite
        <IconSend />
    </div>
    <p id="invite-result" class="hidden"></p>
</template>

<style scoped>
#invite-result {
    font-size: 0.6em;
    font-weight: normal;
    padding: 0.2em;
}

#send-invite {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
    cursor: pointer;
}
</style>