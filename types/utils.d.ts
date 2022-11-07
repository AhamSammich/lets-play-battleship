declare function checkSuccess(successRate: number): boolean;
declare function chooseRandom<T>(arr: Array<T>): T;
declare function sleep(ms?: number): Promise<unknown>;
declare class Message {
    static format(msg: string, options?: {
        from?: string;
        data?: Record<string, any>;
    }): string;
    static parse(json: string, key?: string): string;
    static addTimestamp(): number;
    static showLast(selector: string): void;
}
export { checkSuccess, chooseRandom, sleep, Message };
