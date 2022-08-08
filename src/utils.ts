function checkSuccess(successRate: number): boolean {
    return Math.floor(100 * Math.random()) < successRate
}

function sleep(ms=1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Message {

    static format(msg: string, senderId?: string): string {
        let json =  JSON.stringify({
            "timestamp": this.addTimestamp(), 
            "message": msg, 
            "from": senderId || "None"
            });  
        return json; 
    };

    static parse(json: string, key?: string): string {
        if (json == null) return "";
        let data = JSON.parse(json);
        if (key === "timestamp") return new Date(parseInt(data.timestamp)).toLocaleTimeString();
        if (key) return data?.[key];
        return data;
    }

    static addTimestamp(msg?: string): number {
        let timestamp = Date.now();
        return timestamp;
    }

    static showLast(selector: string) {
        let chat = document.querySelector(selector);
        let items = chat ? Array.from(chat.children) : null;
        if (items && items.length > 1) items[items.length-1].scrollIntoView({
          behavior: "smooth", block: "end",
        });
    }
}

export {
    checkSuccess, 
    sleep,
    Message
}