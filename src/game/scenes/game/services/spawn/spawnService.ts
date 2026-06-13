import { stages } from "../stage/createStageService";
import { Stage } from "../stage/types";

let nextStageStartingTime: number = 0;
let nextSpawnTime: number = 0;
let currentStageIndex: number = 0; 

// Variável que vai armazenar o estágio ativo, ou seja, o estágio que deve ser usado para spawnar os inimigos.
// Inicialmente é o primeiro estágio da lista de estágios,
// mas vai ser atualizada pela função manageSpawn() a cada segundo, quando for necessário mudar de estágio.

let activeStage: Stage = stages[currentStageIndex]; 

export default function manageSpawn(scene: Phaser.Scene, elapsedTime: number) {
    /**
     * @description O objetivo dessa função é ser chamada em update a cada segundo, recebendo o tempo que já passou no jogo e comparando com o tempo
     *              de @var nextStageStartingTime, e se for maior ou igual, o próximo estágio na lista de estágios é chamado.
     */
    if(elapsedTime >= nextStageStartingTime) { // Se o tempo que já passou no jogo for maior ou igual ao tempo de início do próximo estágio, é hora de mudar de estágio.
        activeStage = getCurrentStage();
        nextStageStartingTime = getNextStageStartingTime();
        currentStageIndex++;
    }   

    if(elapsedTime >= nextSpawnTime) { // Se o tempo que já passou no jogo for maior ou igual ao próximo tempo de spawn, é hora de spawnar as unidades.
        spawnUnits(scene);
        nextSpawnTime = elapsedTime + activeStage.spawnInterval;
    }
}

function getNextStageStartingTime(): number {
    /**
     * @description Função que retorna o tempo de início do próximo estágio, ou seja, o tempo a partir do qual o próximo estágio deve entrar em vigor.
     *              Se não houver um próximo estágio, ou seja, se o estágio atual for o último da lista de estágios, a função retorna infinito, ou seja, 
     *              o próximo estágio nunca vai entrar em vigor. Uma espécie de fallback pra evitar erros em runtime.
     */
    return stages[currentStageIndex + 1] ? stages[currentStageIndex + 1].startTime : Number.POSITIVE_INFINITY;
}

function getCurrentStage(): Stage {
    return stages[currentStageIndex];
}

function spawnUnits(scene: Phaser.Scene) {
    /**
     * @description Função que é responsável por spawnar as unidades, usando a pool do estágio ativo. 
     *              A função de spawn de cada unidade é chamada, e o tipo da unidade a ser spawnada é definido com base no peso de cada unidade na pool.
     *              Quanto maior o peso de uma unidade, mais chances ela tem de ser spawnada.
     */
    const pool = activeStage.pool;

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
            console.log('Spawning unit with weight:', unit.weight);
            const { x, y } = getRandomCoordinates();
            unit.spawnFunction(scene, x, y);
            return;
        }
    }
}

function getRandomCoordinates(): { x: number, y: number } {
    /**
     * @description Função que retorna coordenadas aleatórias dentro dos limites do mundo do jogo, para serem usadas como ponto de spawn das unidades.
     *              O eixo x é fixado em 2200, para que as unidades sempre spawnem do lado direito da tela, e o eixo y é gerado aleatoriamente entre 100 e 900, para que as unidades possam spawnar em diferentes alturas.
     */
    const x = 2200; // Coordenada fixa no eixo x, para que as unidades sempre spawnem do lado direito da tela
    const y = Phaser.Math.Between(100, 900); // Coordenada aleatória no eixo y, para que as unidades possam spawnar em diferentes alturas
    return { x, y }
}
