"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.Space = void 0;
const utils_1 = require("./utils");
const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
class Space {
    x;
    y;
    id;
    // result: "hit" | "miss" | null;
    result;
    constructor(x, y, result = null) {
        this.x = x;
        this.y = y;
        this.id = `${COLUMNS[x]}-${y + 1}`;
        this.result = result;
    }
}
exports.Space = Space;
class Board {
    columns;
    rows;
    spaces;
    id;
    static build(columns, rows) {
        let newSpaces = {};
        let [x, y] = [0, 0];
        while (y < rows) {
            while (x < columns) {
                let space = new Space(x, y);
                newSpaces[space.id] = space;
                x++;
            }
            x = 0;
            y++;
        }
        return newSpaces;
    }
    constructor(id, columns = 10, rows = 10) {
        this.id = id;
        this.columns = columns;
        this.rows = rows;
        this.spaces = Board.build(columns, rows);
    }
    get allSpaces() { return Object.keys(this.spaces); }
    get unchecked() {
        return this.allSpaces.filter(key => this.spaces[key].result === null);
    }
    get hits() {
        return this.allSpaces.filter(key => this.spaces[key].result === "hit");
    }
    get misses() {
        return this.allSpaces.filter(key => this.spaces[key].result === "miss");
    }
    getColumn(column) {
        if (typeof column === "string") {
            let letter = column.toUpperCase();
            return this.allSpaces.filter(id => id.startsWith(letter));
        }
        return this.allSpaces.filter(id => this.spaces[id].x === column);
    }
    getRow(row) {
        return this.allSpaces.filter(id => this.spaces[id].y === row);
    }
    getSpaceById(id) { return this.spaces[id]; }
    getSpaceByCoordinates(coord) {
        let returnId = `${COLUMNS[coord.x]}-${coord.y + 1}`;
        return this.spaces[returnId];
    }
    getRight = (targetSpace) => {
        if (targetSpace.x === this.columns - 1)
            return null;
        let [x, y] = [
            targetSpace.x + 1,
            targetSpace.y,
        ];
        return this.getSpaceByCoordinates({ x, y });
    };
    getLeft = (targetSpace) => {
        if (targetSpace.x === 0)
            return null;
        let [x, y] = [
            targetSpace.x - 1,
            targetSpace.y,
        ];
        return this.getSpaceByCoordinates({ x, y });
    };
    getAbove = (targetSpace) => {
        if (targetSpace.y === 0)
            return null;
        let [x, y] = [
            targetSpace.x,
            targetSpace.y - 1,
        ];
        return this.getSpaceByCoordinates({ x, y });
    };
    getBelow = (targetSpace) => {
        if (targetSpace.y === this.rows - 1)
            return null;
        let [x, y] = [
            targetSpace.x,
            targetSpace.y + 1,
        ];
        return this.getSpaceByCoordinates({ x, y });
    };
    getRandomAdjacent(target) {
        const options = [
            this.getLeft, this.getRight, this.getAbove, this.getBelow
        ];
        let origin = this.getSpaceById(target);
        let getter = (0, utils_1.chooseRandom)(options);
        return getter(origin);
    }
}
exports.Board = Board;
//# sourceMappingURL=board.js.map