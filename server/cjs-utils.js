function checkSuccess(successRate) {
    return Math.floor(100 * Math.random()) < successRate
}

function sleep(ms=1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Message {
    static format(msg, senderId) {
        return JSON.stringify({
            "timestamp": this.addTimestamp(), 
            "message": msg, 
            "from": senderId 
            });   
    };

    static parse(json, key="") {
        console.log(json)
        let data = JSON.parse(json);
        if (key === "timestamp") return new Date(parseInt(data.timestamp)).toLocaleTimeString();
        if (key) return data?.[key];
        return data;
    }

    static addTimestamp() {
        let timestamp = Date.now();
        return timestamp;
    }
}

module.exports = {
    checkSuccess, 
    sleep,
    Message,
}