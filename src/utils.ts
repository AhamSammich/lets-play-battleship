function checkSuccess(successRate: number): boolean {
    return Math.floor(100 * Math.random()) < successRate
}

function chooseRandom<T>(arr: Array<T>) {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

function sleep(ms=1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Message {
    static format(msg: string, options: {
        from?: string,
        data?: Record<string, any>,
        }={}): string {
        const { from, data } = options;
        let obj: Record<string, any> = {
            "timestamp": this.addTimestamp(), 
            "message": msg, 
            "from": from || "None"
            }
        if (data) {
            for (let key in data) {
                obj[key] = data[key];
            }
        }
        let json =  JSON.stringify(obj);  
        return json; 
    };

    static parse(json: string, key?: string): string {
        if (json == null) return "";
        let data = JSON.parse(json);
        if (key === "timestamp") return new Date(parseInt(data.timestamp)).toLocaleTimeString();
        if (key) return data?.[key];
        return data;
    }

    static addTimestamp(): number {
        let timestamp = Date.now();
        return timestamp;
    }

    static showLast(selector: string) {
        let chat = document.querySelector(selector);
        // let items = chat ? Array.from(chat.children) : null;
        // if (items && items.length > 1) items[items.length-1].scrollIntoView({
        //   behavior: "smooth", block: "end",
        // });
        // EXPERIMENT
        chat?.scrollTo({
            top: chat.scrollHeight,
            left: 0,
            behavior: "smooth"
        })
    }
}

export {
    checkSuccess, 
    chooseRandom,
    sleep,
    Message
}