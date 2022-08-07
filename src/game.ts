
interface Player {
    name: string;
}

enum GameState {
    SETUP,
    PLAYER1,
    PLAYER2,
    GAMEOVER,
}

export type {
    Player,
}