"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fleet = exports.Ship = void 0;
const utils_1 = require("./utils");
const ShipSize = {
    Frigate: 2,
    Submarine: 3,
    Destroyer: 3,
    Cruiser: 4,
    Carrier: 5,
};
class Ship {
    type;
    id;
    givenName;
    hitPoints;
    location = [];
    constructor(type, name) {
        this.type = type;
        this.id = `${type}`;
        this.givenName = name;
        this.hitPoints = ShipSize[type];
    }
    giveName(newName) {
        this.givenName = newName;
    }
    get name() {
        return this.givenName || this.id;
    }
    get orientation() {
        let getX = (coord) => coord.split("-")[0];
        let [point1, point2] = [this.location[0], this.location[1]];
        if (getX(point1) === getX(point2)) {
            return "vertical";
        }
        ;
        return "horizontal";
    }
    addHit(numOfHits = 1) {
        let remainingPoints = (this.hitPoints -= numOfHits || 1);
        this.hitPoints = remainingPoints > 0 ? remainingPoints : 0;
        if (this.hitPoints === 0)
            console.log(`${this.name} is sunk.`);
    }
    get isSunk() {
        return this.hitPoints === 0;
    }
    addLocation(coordinate) {
        this.location.push(coordinate);
    }
    setLocation(coordinates) {
        this.location = coordinates;
    }
}
exports.Ship = Ship;
class Fleet {
    id;
    ships = [];
    constructor(userId, ships) {
        this.id = userId;
        if (ships)
            this.ships = this.buildShips(ships);
        for (let ship of this.ships)
            this.placeShip(ship);
    }
    get locations() {
        let locs = [];
        this.ships.forEach((ship) => locs.push(...ship.location));
        return locs;
    }
    buildShips(shipTypes) {
        let newShips = [];
        for (let type of shipTypes) {
            newShips.push(new Ship(type));
        }
        return newShips;
    }
    addShips(ships) {
        this.ships.push(...ships);
    }
    placeShip(ship) {
        // Get random start point
        const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        const getRandomNum = () => Math.floor(Math.random() * 10);
        let [x, y] = [getRandomNum(), getRandomNum() + 1];
        let origin = `${columns[x]}-${y}`;
        let locationUnvailable = this.inLocations(origin);
        while (locationUnvailable) {
            [x, y] = [getRandomNum(), getRandomNum() + 1];
            origin = `${columns[x]}-${y}`;
            locationUnvailable = this.inLocations(origin);
        }
        const shipSize = ship.hitPoints;
        while (ship.location.length < shipSize) {
            let axis = (0, utils_1.checkSuccess)(50) ? "vertical" : "horizontal";
            let coord = axis === "horizontal" ? x : y;
            let locs = [];
            while (locs.length < shipSize - 1) {
                coord++;
                if (axis === "horizontal") {
                    coord = coord < 10 ? coord : coord - shipSize;
                }
                else {
                    coord = coord <= 10 ? coord : coord - shipSize;
                }
                let newLoc = axis === "horizontal"
                    ? `${columns[coord]}-${y}`
                    : `${columns[x]}-${coord}`;
                locs.push(newLoc);
            }
            if (locs.some((loc) => this.inLocations(loc)))
                continue;
            ship.setLocation([origin, ...locs]);
            console.log(ship.name, ship.location);
        }
    }
    inLocations(point) {
        return this.locations.includes(point);
    }
    handleAttack(point) {
        if (!this.inLocations(point))
            return false;
        let ship = this.ships.find((ship) => ship.location.includes(point));
        if (ship == null)
            return false;
        console.log(`${ship.name} was hit.`);
        ship.addHit();
        return ship;
    }
}
exports.Fleet = Fleet;
//# sourceMappingURL=ship.js.map