import { checkSuccess } from "./utils";

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
    this.id = `${type}`;
    this.givenName = name;
    this.hitPoints = ShipSize[type];
  }

  giveName(newName: string): void {
    this.givenName = newName;
  }

  get name() {
    return this.givenName || this.id;
  }

  addHit(numOfHits=1) {
    let remainingPoints: number = (this.hitPoints -= numOfHits || 1);
    this.hitPoints = remainingPoints > 0 ? remainingPoints : 0;
    if (this.hitPoints === 0) console.log(`${this.name} is sunk.`)
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
  // locations: string[] = [];

  constructor(userId: string, ships?: ShipType[]) {
      this.id = userId;
      if (ships) this.ships = this.buildShips(ships);
      for (let ship of this.ships) this.placeShip(ship);
  }

  get locations(): string[] {
    let locs: string[] = [];
    this.ships.forEach(ship => locs.push(...ship.location));
    return locs
  }

  buildShips(shipTypes: ShipType[]): Ship[] {
      let newShips = [];
      for (let type of shipTypes) {
          newShips.push(new Ship(type, this.id))
      }
      return newShips;
  }

  addShips(ships: Ship[]) {
      this.ships.push(...ships);
  }

  placeShip(ship: Ship) {
    // Get random start point
    const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const getRandomNum = () => Math.floor(Math.random() * 10);
    let [x, y] = [getRandomNum(), getRandomNum() + 1];
    let origin = `${columns[x]}-${y}`;
    let locationUnvailable = this.inLocations(origin)
    while (locationUnvailable) {
      [x, y] = [getRandomNum(), getRandomNum() + 1];
      origin = `${columns[x]}-${y}`;
      locationUnvailable = this.inLocations(origin);
    }

    const shipSize = ship.hitPoints;
    while (ship.location.length < shipSize) {
      let axis = checkSuccess(50) ? "vertical" : "horizontal";
      let coord = axis === "horizontal" ? x : y;
      let locs = [];
      while (locs.length < shipSize - 1) {
        coord++;
        if (axis === "horizontal") {
          coord = coord < 10 ? coord : (coord - shipSize);
        } else {
          coord = coord <= 10 ? coord : (coord - shipSize);
        }
        let newLoc = axis === "horizontal" ? `${columns[coord]}-${y}` : `${columns[x]}-${coord}`;
        locs.push(newLoc);
      }
      if (locs.some(loc => this.inLocations(loc))) continue;
      ship.setLocation([origin, ...locs]);
      console.log(ship.name, ship.location);
    }
  }

  inLocations(point: string): boolean {
    return this.locations.includes(point);
  }

  handleAttack(point: string): Ship | false {
    if (!this.inLocations(point)) return false;

    let ship = this.ships.find(ship => ship.location.includes(point));
    if (ship == null) return false;
    
    console.log(`${ship.name} was hit.`)
    ship.addHit();
    return ship;
  }
}

export { Ship, Fleet };
