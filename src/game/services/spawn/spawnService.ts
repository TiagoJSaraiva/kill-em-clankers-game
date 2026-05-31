import { stages } from "../stage/createStageService";
import { Stage } from "../stage/types";

let nextStageChange: number = 0;
let activeStage: Stage;

export default function manageSpawn(scene: Phaser.Scene, elapsedTime: number) {
    /**
     * @description O objetivo dessa função é ser chamada em update a cada segundo, recebendo o tempo que já passou no jogo e comparando com o tempo
     *              de @var nextStageChange, e se for maior ou igual, o próximo estágio na lista de estágios é chamado.
     */
    activeStage = getCurrentStage(elapsedTime);
    nextStageChange = getNextStageChange();
}

function getNextStageChange(): number {
    

    return 0;
}

function getCurrentStage(elapsedTime: number): Stage {
    let stage: Stage;
    for(stage of stages) {
        if(stage.startTime == elapsedTime) {
            return stage;
        }
    }

    return activeStage;
}