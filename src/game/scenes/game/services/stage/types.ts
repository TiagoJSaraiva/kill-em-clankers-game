import { Game } from "../../Game";
import Enemy from "../../../../enemies/Enemy";

export type UnitSpawnController = {
    spawnFunction: (scene: Game, x: number, y: number) => Enemy,
    weight: number
}

export type Pool = UnitSpawnController[];

export type Stage = {
    startTime: number,
    spawnInterval: number,
    pool: Pool
}

