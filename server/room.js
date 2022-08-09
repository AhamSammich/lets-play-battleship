class Room {
  static opened = {};
  capacity = 2;
  users = {};

  constructor(hostUser, id) {
    this.id = id;
    this.host = hostUser;
    this.users[hostUser] = hostUser;
  }

  get occupants() {
    return Object.keys(this.users);
  }

  get count() {
    return this.occupants.length;
  }

  get isEmpty() {
    return this.count === 0;
  }

  get isAvailable() {
    return this.count < this.capacity;
  }

  get isFull() {
    return this.count === this.capacity;
  }

  getUser(userId) {
    return this.users[userId];
  }

  assignHost() {
    if (this.isEmpty) return Room.close(this.id);
    this.host = this.occupants[0];
  }

  join(userId) {
    if (this.isAvailable) this.users[userId] = userId;
  }

  leave(userId) {
    try {
      delete this.users[userId];
    } catch (err) {
      console.error(`User ${userId} is not in this room. (${err})`);
    }
    if (this.isEmpty) Room.close(this.id);
    if (userId === this.host) this.assignHost();
  }

  static getAllKeys() {
    return Object.keys(this.opened);
  }

  static getAvailableKey() {
    return this.getAllKeys().find((key) => this.opened[key].isAvailable);
  }

  static findAvailable() {
    return this.opened[this.getAvailableKey()];
  }

  static findById(id) {
    return this.opened[id];
  }

  static getNewId() {
    let i = 1;
    let newId = `Room ${i}`;
    while (this.getAllKeys().includes(newId)) {
      // ID already exists
      i++;
      newId = `Room ${i}`;
    }
    return newId;
  }

  static open(hostUser, id = undefined) {
    id = id || this.getNewId();
    let room = this.findById(id);
    if (room) {
      return console.warn(
        "This Room ID already exists. \nJoin the existing room or specify a different ID."
      );
    }
    room = new Room(hostUser, id);
    this.opened[id] = room;
    return room;
  }

  static close(id) {
    try {
      delete this.opened[id];
    } catch (err) {
      console.error(`${id} is not open. (${err})`);
    }
  }
}

module.exports = {
  Room,
};
