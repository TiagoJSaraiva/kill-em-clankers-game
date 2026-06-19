import { Scene } from 'phaser';


export class GameOver extends Scene
{
    private readonly height: number = 1080;
    private readonly width: number = 1920;

    private scoreCounter: number = 0;
    
    scoreAmount: Phaser.GameObjects.Text;
    restartButton: Phaser.GameObjects.Image;
    menuButton: Phaser.GameObjects.Image;

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
            },
            onComplete: () => {
                this.setupButtons();
            }
        });
    }

    private setupButtons(): void
    {
        this.menuButton = this.add.image(this.width / 2, this.height / 2 + 500, 'menu-button').setScale(0.3).setInteractive();
        this.menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
        this.restartButton = this.add.image(this.width / 2, this.height / 2 + 400, 'restart-button').setScale(0.3).setInteractive();
        this.restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        this.menuButton.on('pointerover', () => {
            this.menuButton.setTexture('menu-button-hover');
        });
        this.menuButton.on('pointerout', () => {
            this.menuButton.setTexture('menu-button');
        });

        this.restartButton.on('pointerover', () => {
            this.restartButton.setTexture('restart-button-hover');
        });
        this.restartButton.on('pointerout', () => {
            this.restartButton.setTexture('restart-button');
        });
    }

    update (time: number)
    {

    }
}
