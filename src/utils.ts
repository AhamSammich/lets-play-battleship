function checkSuccess(successRate: number): boolean {
    return Math.floor(100 * Math.random()) < successRate
}

function addTimestamp(msg?: string): string {
    let timestamp = `[ ${(new Date()).toLocaleTimeString()} ]`
    return timestamp + (msg ? ` - - ${msg}` : "");
}

function removeTimestamp(msg: string): string | void {
    return msg?.replace(/\[[^\[]*\](\s-)*/, "").trim();
  }
  
function getTimestamp(msg: string): string | void {
    if (/\[[^\[]*\](\s-)*/.test(msg) === false) return;
    let timestamp = msg.split("] ")[0];
    return timestamp.replace("[", "").trim();
}

export {
    checkSuccess, 
    addTimestamp, 
    removeTimestamp,
    getTimestamp,
}