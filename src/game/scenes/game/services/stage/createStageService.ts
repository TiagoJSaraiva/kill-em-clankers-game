import ShooterRobot from "../../../../enemies/shooter-robot/ShooterRobot";
import { Stage, Pool, UnitSpawnController } from "./types";
import { VariationName } from "../../../../enemies/types";
import { Game } from "../../Game";
import { VanRobot } from "../../../../enemies/van-robot/VanRobot";

const enemyFactories = {
    ShooterRobot: (scene: Game, x: number, y: number, variation: VariationName) => {
        return new ShooterRobot(scene, x, y, variation, scene.player);
    },
    VanRobot: (scene: Game, x: number, y: number, variation: VariationName) => {
        return new VanRobot(scene, x, y, variation, scene.player);
    }
};

/* CONTRATOS LOCAIS*/

type unitSpawnConfig = {
    name: keyof typeof enemyFactories, 
    variation: VariationName, 
    weight: number
}

export const stages = [
    /* Interface de configuração de cada estágio, onde é possível definir o tempo de início do estágio, o intervalo de spawn dos inimigos e a pool de inimigos que podem aparecer nesse estágio.
       A pool é um array de objetos, onde cada objeto define o nome da classe do inimigo e a variação desse inimigo (por exemplo, "normal", "strong", "impossible", etc).
    */

    stage(0, 10, [ 
        { name: 'ShooterRobot', variation: 'normal', weight: 1 }, 
        { name: 'ShooterRobot', variation: 'strong', weight: 1 } 
    ]),
    stage(30, 10, [
        { name: 'VanRobot', variation: 'normal', weight: 1 }, 
        { name: 'ShooterRobot', variation: 'strong', weight: 1 } 
    ]),
] as Stage[];

/* FUNÇÕES */

function stage(startTime: number, spawnInterval: number, poolConfig: unitSpawnConfig[] ): Stage
{
    /**
     * @description Construtor usado para gerar os objetos que representam cada estágio do jogo. 
     *  
     * @param startTime     A partir de quantos segundos desde o início de uma partida, o estágio entra em vigor
     * @param spawnInterval Em segundos, o tempo entre o spawn de cada unidade.
     * @param poolConfig    Dados de configuração da pool de um certo estágio. @var poolConfig[number].name e @var poolConfig[number].variation são usados pra gerar
     *                      dinâmicamente a função de spawn da unidade, com base no nome e na variante dela.      
     */

    let pool: Pool = []; // Variável que vai armazenar de fato a pool referente a um Stage, criada com base em @var poolConfig

    for (let item of poolConfig) {
        const factory = enemyFactories[item.name];
        let spawnFunction: UnitSpawnController["spawnFunction"];
        let weight: number;

        if (factory) {
            spawnFunction = (scene: Game, x: number, y: number) => {
                return factory(scene, x, y, item.variation);
            };

            weight = item.weight;

            pool.push({ spawnFunction, weight } as UnitSpawnController)
        }
    }

    return {
        startTime,
        spawnInterval,
        pool
    };
}
