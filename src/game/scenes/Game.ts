import { Scene } from 'phaser';
import { Player } from '../player/Player';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('Game');
    }

    preload () {
        this.load.image('player', 'assets/player.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.player = new Player(this, 100, 450, 'player');
        this.cursors = this.input.keyboard?.createCursorKeys()!;
    }

    update () {
        this.player.update(this.cursors);
    }
}
