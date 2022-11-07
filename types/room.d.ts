declare class Room {
    static opened: Record<string, Room>;
    capacity: number;
    users: Record<string, string>;
    id: string;
    host: string;
    constructor(hostUser: string, id: string);
    get occupants(): string[];
    get count(): number;
    get isEmpty(): boolean;
    get isAvailable(): boolean;
    get isFull(): boolean;
    getUser(userId: string): string;
    assignHost(): void;
    join(userId: string): void;
    leave(userId: string): void;
    static getAllKeys(): string[];
    static getAvailableKey(): string | void;
    static findAvailable(): Room;
    static findById(id: string): Room;
    static getNewId(): string;
    static open(hostUser: string): Room;
    static close(id: string): void;
}
export default Room;
