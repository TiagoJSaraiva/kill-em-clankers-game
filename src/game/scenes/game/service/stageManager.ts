import ShooterRobot from "../../../enemies/shooter-robot/ShooterRobot";

const stageManager = [
    /* Interface de configuração de cada estágio, onde é possível definir o tempo de início do estágio, o intervalo de spawn dos inimigos e a pool de inimigos que podem aparecer nesse estágio.
       A pool é um array de objetos, onde cada objeto define o nome da classe do inimigo e a variação desse inimigo (por exemplo, "normal", "strong", "impossible", etc).
    */

    stage(0, 60, [ 
        { name: 'ShooterRobot', variation: 'normal', weight: 1 }, 
        { name: 'ShooterRobot', variation: 'strong', weight: 1 } 
    ])
];

const enemyFactories = {
    ShooterRobot: (scene: Phaser.Scene, x: number, y: number, variation: string) => {
        return new ShooterRobot(scene, x, y, variation);
    }
};

function stage(startTime: number, spawnInterval: number, pool: { name: keyof typeof enemyFactories; variation: string; weight: number }[] )
{
    /**
     * @description Construtor usado para gerar os objetos que representam cada estágio do jogo. 
     *  
     * @param startTime     A partir de quantos segundos desde o início de uma partida, o estágio entra em vigor
     * @param spawnInterval Em segundos, o tempo entre o spawn de cada unidade.
     * @param pool          
     */

    const _pool = [];

    for (let item of pool) {
        const factory = enemyFactories[item.name];
        let _function;
        let _weight;

        if (factory) {
            _function = (scene: Phaser.Scene, x: number, y: number) => {
                return factory(scene, x, y, item.variation);
            };

            _weight = item.weight;

            _pool.push({ _function, _weight })
        }
    }

    return {
        startTime,
        spawnInterval,
        _pool
    };
}

export default stageManager