import { stages } from "../stage/createStageService";
import { Stage } from "../stage/types";
import { Game } from "../../Game";
import Phaser from "phaser";

type SpawnState = {
    nextStageStartingTime: number,
    nextSpawnTime: number,
    currentStageIndex: number,
    activeStage: Stage
}

const spawnStates = new WeakMap<Game, SpawnState>();

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

function getNextStageStartingTime(state: SpawnState): number {
    return stages[state.currentStageIndex + 1] ? stages[state.currentStageIndex + 1].startTime : Number.POSITIVE_INFINITY;
}

function getCurrentStage(state: SpawnState): Stage {
    return stages[state.currentStageIndex] ?? state.activeStage;
}

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

function getRandomCoordinates(): { x: number, y: number } {
    const x = 2200;
    const y = Phaser.Math.Between(100, 900);
    return { x, y }
}
