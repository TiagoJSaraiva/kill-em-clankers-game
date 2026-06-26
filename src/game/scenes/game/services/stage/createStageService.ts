import ShooterRobot from "../../../../enemies/shooter-robot/ShooterRobot";
import { Stage, Pool, UnitSpawnController } from "./types";
import { VariationName } from "../../../../enemies/types";
import { Game } from "../../Game";
import { VanRobot } from "../../../../enemies/van-robot/VanRobot";
import { GranadeRobot } from "../../../../enemies/granade-robot/GranadeRobot";

/**
 * Factories que convertem uma configuracao de stage em instancias de inimigos.
 */
const enemyFactories = {
    ShooterRobot: (scene: Game, x: number, y: number, variation: VariationName) => {
        return new ShooterRobot(scene, x, y, variation, scene.player);
    },
    VanRobot: (scene: Game, x: number, y: number, variation: VariationName) => {
        return new VanRobot(scene, x, y, variation, scene.player);
    },
    GranadeRobot: (scene: Game, x: number, y: number, variation: VariationName) => {
        return new GranadeRobot(scene, x, y, variation, scene.player);
    }
};

/**
 * Configuracao declarativa de uma unidade dentro da pool de um estagio.
 */
type unitSpawnConfig = {
    name: keyof typeof enemyFactories, 
    variation: VariationName, 
    weight: number
}

/**
 * Sequencia de estagios da partida.
 *
 * Cada estagio define quando entra em vigor, o intervalo de spawn e a pool
 * ponderada de inimigos permitidos naquele trecho.
 */
export const stages = [
    /* Interface de configuração de cada estágio, onde é possível definir o tempo de início do estágio, o intervalo de spawn dos inimigos e a pool de inimigos que podem aparecer nesse estágio.
       A pool é um array de objetos, onde cada objeto define o nome da classe do inimigo e a variação desse inimigo (por exemplo, "normal", "strong", "impossible", etc).
    */

    stage(0, 10, [ 
        { name: 'VanRobot', variation: 'normal', weight: 1 }, 
        { name: 'GranadeRobot', variation: 'normal', weight: 1 },
        { name: 'ShooterRobot', variation: 'normal', weight: 1 } 
    ]),
    stage(30, 10, [
        { name: 'VanRobot', variation: 'strong', weight: 1 }, 
        { name: 'GranadeRobot', variation: 'strong', weight: 1 },
        { name: 'ShooterRobot', variation: 'strong', weight: 1 } 
    ]),
    stage(60, 10, [
        { name: 'VanRobot', variation: 'normal', weight: 1 }, 
        { name: 'GranadeRobot', variation: 'normal', weight: 1 },
        { name: 'ShooterRobot', variation: 'normal', weight: 1 } 
    ]),
    stage(90, 10, [
        { name: 'VanRobot', variation: 'impossible', weight: 1 }, 
        { name: 'GranadeRobot', variation: 'impossible', weight: 1 },
        { name: 'ShooterRobot', variation: 'impossible', weight: 1 } 
    ]),
] as Stage[];

/* FUNÇÕES */

/**
 * Construtor usado para gerar os objetos que representam cada estagio do jogo.
 *
 * @param startTime A partir de quantos segundos desde o inicio da partida o
 * estagio entra em vigor.
 * @param spawnInterval Tempo em segundos entre o spawn de cada unidade.
 * @param poolConfig Configuracao declarativa da pool do estagio. `name` e
 * `variation` sao usados para gerar a funcao de spawn dinamicamente.
 * @returns Objeto de estagio consumido pelo servico de spawn.
 */
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
