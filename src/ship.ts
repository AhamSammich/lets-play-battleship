const ShipSize = {
    Frigate: 2,
    Submarine: 3,
    Destroyer: 3,
    Cruiser: 4,
    Carrier: 5,
} as const

type ShipType = keyof typeof ShipSize;

class Ship {
    type: ShipType;
  id: string;
  givenName?: string;
  hitPoints: number;
  location: string[] = [];

  constructor(type: ShipType, userId: string, name?: string) {
    this.type = type;
    this.id = `${type}(${userId})`;
    this.givenName = name;
    this.hitPoints = ShipSize[type];
  }

  giveName(newName: string): void {
    this.givenName = newName;
  }

  get name() {
    return this.givenName || this.id;
  }

  addHit(numOfHits: number) {
    let remainingPoints: number = (this.hitPoints -= numOfHits || 1);
    this.hitPoints = remainingPoints > 0 ? remainingPoints : 0;
  }

  get isSunk(): boolean {
    return this.hitPoints === 0;
  }

  addLocation(coordinate: string) {
    this.location.push(coordinate);
  }

  setLocation(coordinates: string[]) {
    this.location = coordinates;
  }

}

class Fleet {
    id: string;
    ships: Ship[] = [];

    constructor(userId: string, ships?: ShipType[]) {
        this.id = userId;
        if (ships) this.ships = this.buildShips(ships);
    }

    buildShips(shipTypes: ShipType[]): Ship[] {
        let newShips = [];
        for (let type of shipTypes) {
            newShips.push(new Ship(type, this.id))
        }
        console.log(`SHIPS BUILT:\n${newShips}`);
        return newShips;
    }

    addShips(ships: Ship[]) {
        this.ships.push(...ships);
    }
}

export { Ship, Fleet };
