import { stages } from "../stage/createStageService";
import { StageService } from "../stage/stageTypes";

let nextStageChange: number = 0;
let activeStage: StageService.Stage;

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

function getCurrentStage(elapsedTime: number): StageService.Stage {
    let stage: StageService.Stage;
    for(stage of stages) {
        if(stage.startTime == elapsedTime) {
            return stage;
        }
    }

    return activeStage;
}