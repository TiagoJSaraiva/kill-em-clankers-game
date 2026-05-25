import EyeEnemy from "./eye_enemy/EyeEnemy";

const stageManager = [
    stage(0, 240, [ 
        { name: 'EyeEnemy', variation: 'normal' }, 
        { name: 'EyeEnemy', variation: 'strong' } 
    ])

];

const enemyFactories = {
    EyeEnemy: (scene: Phaser.Scene, x: number, y: number, variation: string) => {
        return new EyeEnemy(scene, x, y, variation);
    }
};

function stage(startTime: number, spawnInterval: number, pool: { name: keyof typeof enemyFactories; variation: string }[] )
{
    const poolFunctions = [];

    for (const item of pool) {
        const factory = enemyFactories[item.name];

        if (factory) {
            poolFunctions.push((scene: Phaser.Scene, x: number, y: number) => {
                return factory(scene, x, y, item.variation);
            });
        }
    }

    return {
        startTime,
        spawnInterval,
        poolFunctions
    };
}

export default stageManager