function checkSuccess(successRate) {
    return Math.floor(100 * Math.random()) < successRate
}

class Timestamp {

    static add(msg) {
        let timestamp = `[ ${(new Date()).toLocaleTimeString()} ]`
        return timestamp + (msg ? ` - - ${msg}` : "");
    }

    static remove(msg) {
        return msg?.replace(/\[[^\[]*\](\s-)*/, "").trim();
    }
    
    static get(msg) {
        if (/\[[^\[]*\](\s-)*/.test(msg) === false) return;
        let timestamp = msg.split("] ")[0];
        return timestamp.replace("[", "").trim();
    }
}

module.exports = {
    checkSuccess, 
    Timestamp,
}