
export type UnitSpawnController = {
    spawnFunction: (scene: Phaser.Scene, x: number, y: number, variation: string) => any,
    weight: number
}

export type Pool = UnitSpawnController[];

export type Stage = {
    startTime: number,
    spawnInterval: number,
    pool: Pool
}

