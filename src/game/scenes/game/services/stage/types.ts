import { Game } from "../../Game";

export type UnitSpawnController = {
    spawnFunction: (scene: Game, x: number, y: number) => any,
    weight: number
}

export type Pool = UnitSpawnController[];

export type Stage = {
    startTime: number,
    spawnInterval: number,
    pool: Pool
}

