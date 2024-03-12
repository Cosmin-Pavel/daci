export interface Room {
    players?: Player[]
    roomId?: string
}

export interface Player {
    username:string
    imageIndex:number
    cards:string[]
}

export type GameState = "seeCards" | "altceva"