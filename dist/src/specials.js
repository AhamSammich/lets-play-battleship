"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpecialAttack {
    name;
    shipType;
    callback;
    constructor(shipType, name, callback) {
        this.name = name;
        this.shipType = shipType;
        this.callback = callback;
    }
    call(options) {
        this.callback(options);
    }
}
const SPECIALS = {
    "EM Railgun": new SpecialAttack("Carrier", "EM Railgun", (options) => {
    }),
};
//# sourceMappingURL=specials.js.map