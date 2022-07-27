/**
 * Tracks ship identity and hits
 */

interface ShipType { name: string, size: number}


class Ship {
    id: string;
    addedName?: string;
    type: string;
    hitPoints: number;

    constructor(userId: string, type: ShipType) {
        this.id = `${type.name}-${userId}`;
        this.type = type.name;
        this.hitPoints = type.size;
    }

    get name(): string {return this.addedName || this.id}

    get isSunk(): boolean {return this.hitPoints === 0}

    // Add a unique name to be displayed in lieu of the id.
    addName(newName: string): void {this.addedName = newName}

    addHit(numOfHits: number): void {
        let remainingPoints: number = this.hitPoints -= numOfHits || 1;
        this.hitPoints = remainingPoints > 0 ? remainingPoints : 0;
    }

    sink(): void {
        if (this.hitPoints > 0) {
            throw new Error(`${this.name || this.id}`)
        }
    }
}

export default Ship;