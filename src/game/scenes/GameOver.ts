import { Scene } from 'phaser';


export class GameOver extends Scene
{
    private readonly height: number = 1080;
    private readonly width: number = 1920;
    
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.add.image(this.width / 2, 220, 'game-over');
        this.add.image(this.width, this.height/2, 'score-label');
        
    }
}
