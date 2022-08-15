import { Ship, ShipType } from "./ship";

class SpecialAttack {
    name: string;
    shipType: ShipType;
    callback: Function;

    constructor(shipType: ShipType, name: string, callback: Function) {
        this.name = name;
        this.shipType = shipType;
        this.callback = callback;
    }

    call(options?: {}): void {
        this.callback(options);
    }
}

const SPECIALS = {
    "EM Railgun" : new SpecialAttack(
        "Carrier", 
        "EM Railgun", 
        (options: { 
            target: string, 
            orientation: "vertical" | "horizontal" 
        }) => {
            
        }
    ),
}

export {

}