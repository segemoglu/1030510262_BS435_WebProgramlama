export type ImageOption = {
    id: string
    url: string
    isReal: boolean
}

export type RoundData = {
    id: number
    theme: string
    hint: string
    options: ImageOption[]
}

export type GameState = 'START' | 'PLAY' | 'FINISHED'
export type GameMode = 'NORMAL' | 'HARD'

export type ScoreEntry = {
    player_name: string
    score: number
    mode: string
    date: string
}
