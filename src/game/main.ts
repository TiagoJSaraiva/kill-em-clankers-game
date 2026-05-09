// import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
// import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#20313e',
    input: { keyboard: true },
    scene: [
        // MainMenu,
        MainGame,
        // GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
