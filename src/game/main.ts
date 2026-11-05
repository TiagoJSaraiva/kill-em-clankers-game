import { Game as MainGame } from './scenes/game/Game';
import { AUTO, Game, Scale } from 'phaser';
import { Boot } from './scenes/preloader/Boot';
import { Preloader } from './scenes/preloader/Preloader';
import { MainMenu } from './scenes/main-menu/MainMenu';
import { GameOver } from './scenes/game-over/GameOver';

/**
 * Configuracao base do Phaser.
 *
 * Define resolucao, fisica Arcade, cena inicial e lista de cenas usadas pelo
 * jogo. A logica sempre roda em 1920x1080: o modo FIT apenas escala o canvas
 * para caber na janela. O parent pode ser sobrescrito por {@link StartGame}.
 */
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        fullscreenTarget: 'app'
    },
    input: { keyboard: true },
    physics: {
        default: 'arcade', // Habilitado pra funcionar o Phaser.Physics.Arcade
        arcade: {
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

/**
 * Cria a instancia principal do Phaser dentro do elemento informado e registra
 * a tecla F para alternar a tela cheia.
 *
 * @param parent Id do elemento HTML que recebe o canvas do jogo.
 * @returns Instancia do jogo Phaser.
 */
const StartGame = (parent: string) => {

    const game = new Game({ ...config, parent });

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyF' && !event.repeat)
        {
            game.scale.toggleFullscreen();
        }
    });

    return game;

}

export default StartGame;
