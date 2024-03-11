export interface Room {
    playersArray?: Player[]
    roomId?: string
}

export interface Player {
    username:string
    imageIndex:number
}