import { Game } from "../../Game";
import Enemy from "../../../../enemies/Enemy";

/**
 * Define como uma unidade pode ser instanciada dentro de uma pool de spawn.
 */
export type UnitSpawnController = {
    spawnFunction: (scene: Game, x: number, y: number) => Enemy,
    weight: number
}

/**
 * Lista ponderada de unidades que podem aparecer em um estagio.
 */
export type Pool = UnitSpawnController[];

/**
 * Configuracao de um trecho temporal da partida.
 */
export type Stage = {
    startTime: number,
    spawnInterval: number,
    pool: Pool
}

