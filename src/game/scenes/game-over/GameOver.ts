import { Scene } from 'phaser';


export class GameOver extends Scene
{
    private readonly height: number = 1080;
    private readonly width: number = 1920;

    private scoreCounter: number = 0;
    
    scoreAmount: Phaser.GameObjects.Text;


    constructor ()
    {
        super('GameOver');
    }

    init (data: { score: number })
    {
        this.scoreCounter = data.score;
    }

    create ()
    {
        this.add.image(this.width / 2, 300, 'game-over').setScale(0.8);
        this.add.image(this.width /2, this.height/2+200, 'score-label').setScale(0.3);
        this.add.image(this.width / 2, this.height / 2, 'menu-bg').setDepth(-1);
        this.scoreAmount = this.add.text(this.width / 2, this.height / 2 + 300, "000000", {
            fontFamily: 'Courier New',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#9c0000'
        }).setOrigin(0.5);

        const counter = { value: 0 };

        this.tweens.add({
            targets: counter,
            value: this.scoreCounter,
            duration: 3000,
            delay: 5000,
            ease: 'Linear',
            onUpdate: () => {
                this.scoreAmount.setText(Math.floor(counter.value).toString().padStart(6, '0'));
            }
        });
    }

    update (time: number)
    {

    }
}
