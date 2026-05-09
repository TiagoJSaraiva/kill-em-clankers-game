import { Scene } from 'phaser';
import { Player } from '../player/Player';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    /*                    */
    /* MÉTODOS PRINCIPAIS */
    /*                    */

    constructor ()
    {
        super('Game');
    }

    preload () {
        this.load.image('player', './assets/player/model.png');
    }

    create ()
    {
        this.camera = this.cameras.main; // Armazena a câmera principal da cena em um atributo para facilitar o acesso
        this.camera.setBackgroundColor(0x00ff00);
        this.player = new Player(this, 100, 450, 'player'); // Instancia player na cena do game
        this.cursors = this.input.keyboard?.createCursorKeys()!; // Habilita o uso do teclado para movimentação do player
    }

    update () {
        this.player.update(this.cursors, this); // Chama o método de update do player. Olhar a classe player para entender o método
    }

    /*                    */
    /* MÉTODOS AUXILIARES */
    /*                    */
}
