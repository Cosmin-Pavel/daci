export interface Room {
  players?: Player[];
  roomId?: string;
}

export interface Player {
  username: string;
  imageIndex: number;
  cards: string[];
}

export interface GameStateEvent {
  gameState: GameState;
}

export type GameState = "seeCards" | string;

export interface CardsChangedEvent {
  username: string;
  card: string;
}

export interface PlayerCard {
  card: string;
  username: string;
}

export interface Scores {
  [username: string]: number;
}
