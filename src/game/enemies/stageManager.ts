import ShooterRobot from "./shooter-robot/ShooterRobot";

const stageManager = [
    /* Interface de configuração de cada estágio, onde é possível definir o tempo de início do estágio, o intervalo de spawn dos inimigos e a pool de inimigos que podem aparecer nesse estágio.
       A pool é um array de objetos, onde cada objeto define o nome da classe do inimigo e a variação desse inimigo (por exemplo, "normal", "strong", "impossible", etc).
    */
    stage(0, 240, [ 
        { name: 'ShooterRobot', variation: 'normal' }, 
        { name: 'ShooterRobot', variation: 'strong' } 
    ])
];

const enemyFactories = {
    ShooterRobot: (scene: Phaser.Scene, x: number, y: number, variation: string) => {
        return new ShooterRobot(scene, x, y, variation);
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