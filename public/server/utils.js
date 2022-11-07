"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.sleep = exports.chooseRandom = exports.checkSuccess = void 0;
function checkSuccess(successRate) {
    return Math.floor(100 * Math.random()) < successRate;
}
exports.checkSuccess = checkSuccess;
function chooseRandom(arr) {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}
exports.chooseRandom = chooseRandom;
function sleep(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
class Message {
    static format(msg, options = {}) {
        const { from, data } = options;
        let obj = {
            "timestamp": this.addTimestamp(),
            "message": msg,
            "from": from || "None"
        };
        if (data) {
            for (let key in data) {
                obj[key] = data[key];
            }
        }
        let json = JSON.stringify(obj);
        return json;
    }
    ;
    static parse(json, key) {
        if (json == null)
            return "";
        let data = JSON.parse(json);
        if (key === "timestamp")
            return new Date(parseInt(data.timestamp)).toLocaleTimeString();
        if (key)
            return data?.[key];
        return data;
    }
    static addTimestamp() {
        let timestamp = Date.now();
        return timestamp;
    }
    static showLast(selector) {
        let log = document.querySelector(selector);
        log?.scrollTo({
            top: log.scrollHeight,
            left: 0,
            behavior: "smooth"
        });
    }
}
exports.Message = Message;
