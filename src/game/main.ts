// import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/game/Game';
// import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { MainMenu } from './scenes/main-menu/MainMenu';
import { GameOver } from './scenes/game-over/GameOver';

/**
 * Configuracao base do Phaser.
 *
 * Define resolucao, fisica Arcade, cena inicial e lista de cenas usadas pelo
 * jogo. O parent pode ser sobrescrito por {@link StartGame}.
 */
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#20313e',
    input: { keyboard: true },
    physics: {
        default: 'arcade', // Habilitado pra funcionar o Phaser.Physics.Arcade
        arcade: {
            debug: false
        }
    },
    scene: [
        MainMenu,
        MainGame,
        GameOver
    ]
};

/**
 * Cria a instancia principal do Phaser dentro do elemento informado.
 *
 * @param parent Id do elemento HTML que recebe o canvas do jogo.
 * @returns Instancia do jogo Phaser.
 */
const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
