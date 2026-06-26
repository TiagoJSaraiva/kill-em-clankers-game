import { stages } from "../stage/createStageService";
import { Stage } from "../stage/types";
import { Game } from "../../Game";
import Phaser from "phaser";

/**
 * Estado interno de spawn associado a uma cena Game especifica.
 */
type SpawnState = {
    nextStageStartingTime: number,
    nextSpawnTime: number,
    currentStageIndex: number,
    activeStage: Stage
}

const spawnStates = new WeakMap<Game, SpawnState>();

/**
 * Atualiza o estagio ativo e instancia inimigos quando o intervalo permitir.
 *
 * @param scene Cena principal da partida.
 * @param elapsedTime Tempo de partida em segundos.
 */
export default function manageSpawn(scene: Game, elapsedTime: number) {
    const state = getSpawnState(scene);

    if(elapsedTime >= state.nextStageStartingTime) {
        state.activeStage = getCurrentStage(state);
        state.nextStageStartingTime = getNextStageStartingTime(state);
        state.currentStageIndex++;
    }

    if(elapsedTime >= state.nextSpawnTime) {
        spawnUnits(scene, state);
        state.nextSpawnTime = elapsedTime + state.activeStage.spawnInterval;
    }
}

/**
 * Retorna o estado persistente de spawn da cena, criando-o no primeiro uso.
 */
function getSpawnState(scene: Game): SpawnState
{
    let state = spawnStates.get(scene);

    if (!state)
    {
        state = {
            nextStageStartingTime: 0,
            nextSpawnTime: 0,
            currentStageIndex: 0,
            activeStage: stages[0]
        };
        spawnStates.set(scene, state);
    }

    return state;
}

/**
 * @returns Tempo de inicio do proximo estagio ou infinito se nao existir.
 */
function getNextStageStartingTime(state: SpawnState): number {
    return stages[state.currentStageIndex + 1] ? stages[state.currentStageIndex + 1].startTime : Number.POSITIVE_INFINITY;
}

/**
 * @returns Estagio atual ou o ultimo estagio ativo como fallback.
 */
function getCurrentStage(state: SpawnState): Stage {
    return stages[state.currentStageIndex] ?? state.activeStage;
}

/**
 * Sorteia uma unidade da pool ponderada e registra o inimigo criado na cena.
 */
function spawnUnits(scene: Game, state: SpawnState) {
    const pool = state.activeStage.pool;

    if(pool.length === 0) {
        return;
    }

    const totalWeight = pool.reduce((sum, unit) => {
        return unit.weight > 0 ? sum + unit.weight : sum;
    }, 0);

    if(totalWeight <= 0) {
        return;
    }

    const randomWeight = Math.random() * totalWeight;
    let accumulatedWeight = 0;

    for(let unit of pool) {
        if(unit.weight <= 0) {
            continue;
        }

        accumulatedWeight += unit.weight;

        if(randomWeight < accumulatedWeight) {
            const { x, y } = getRandomCoordinates();
            const enemy = unit.spawnFunction(scene, x, y);
            scene.registerEnemy(enemy);
            return;
        }
    }
}

/**
 * @returns Coordenadas iniciais fora da direita da tela e altura aleatoria.
 */
function getRandomCoordinates(): { x: number, y: number } {
    const x = 2200;
    const y = Phaser.Math.Between(100, 900);
    return { x, y }
}
