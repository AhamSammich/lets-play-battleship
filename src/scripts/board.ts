import { checkSuccess, chooseRandom } from "./utils";

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export class Space {
    x;
    y;
    id;
    // result: "hit" | "miss" | null;
    result: string | null;

    constructor(x: number, y: number, result=null) {
        this.x = x;
        this.y = y;
        this.id = `${COLUMNS[x]}-${y + 1}`
        this.result = result;
    }
}

export class Board {
    columns;
    rows;
    spaces;
    id: string;

    static build(columns: number, rows: number): Record<string, Space> {
        let newSpaces: Record<string, Space> = {};
        let [x, y] = [0, 0];
        while (y < rows) {
            while(x < columns) {
                let space = new Space(x, y);
                newSpaces[space.id] = space;
                x++;
            }
            x = 0;
            y++;
        }
        return newSpaces;
    }

    constructor(id: string, columns=10, rows=10) {
        this.id = id;
        this.columns = columns;
        this.rows = rows;
        this.spaces = Board.build(columns, rows);
    }

    get allSpaces(): string[] {return Object.keys(this.spaces)}

    get unchecked(): string[] {
        return this.allSpaces.filter(key => this.spaces[key].result === null);
    }

    get hits(): string[] {
        return this.allSpaces.filter(key => this.spaces[key].result === "hit");
    }

    get misses(): string[] {
        return this.allSpaces.filter(key => this.spaces[key].result === "miss");
    }

    getColumn(column: string | number): string[] {
        if (typeof column === "string") {
            let letter = column.toUpperCase();
            return this.allSpaces.filter(id => id.startsWith(letter));
        }
        return this.allSpaces.filter(id => this.spaces[id].x === column);
    }

    getRow(row: number): string[] {
        return this.allSpaces.filter(id => this.spaces[id].y === row);
    }

    getSpaceById(id: string): Space {return this.spaces[id]}
    
    getSpaceByCoordinates(coord: {x: number, y: number}): Space {
        let returnId = `${COLUMNS[coord.x]}-${coord.y + 1}`;
        return this.spaces[returnId];
    }

    getRight = (targetSpace: Space): Space | null => {
        if (targetSpace.x === this.columns - 1) return null;
        let [x, y] = [
            targetSpace.x + 1, 
            targetSpace.y,
        ]
        return this.getSpaceByCoordinates({x, y});
    }

    getLeft = (targetSpace: Space): Space | null => {
        if (targetSpace.x === 0) return null;
        let [x, y] = [
            targetSpace.x - 1,
            targetSpace.y,
        ]
        return this.getSpaceByCoordinates({x, y});
    }

    getAbove = (targetSpace: Space): Space | null => {
        if (targetSpace.y === 0) return null;
        let [x, y] = [
            targetSpace.x,
            targetSpace.y - 1, 
        ]
        return this.getSpaceByCoordinates({x, y});
    }

    getBelow = (targetSpace: Space): Space | null => {
        if (targetSpace.y === this.rows - 1) return null;
        let [x, y] = [
            targetSpace.x,
            targetSpace.y + 1, 
        ]
        return this.getSpaceByCoordinates({x, y});
    }

    getRandomAdjacent(target: string) {
        const options: Function[] = [
            this.getLeft, this.getRight, this.getAbove, this.getBelow
        ];
        let origin = this.getSpaceById(target);
        let getter: Function = chooseRandom(options);
        return getter(origin);
    }
}