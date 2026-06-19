import { Scene } from 'phaser';


export class GameOver extends Scene
{
    private static readonly height: number = 1080;
    private static readonly width: number = 1920;
    private static readonly buttonScale: number = 0.2;
    private static readonly hoverButtonScale: number = 0.22;

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
        this.add.image(GameOver.width / 2, 300, 'game-over').setScale(0.8);
        this.add.image(GameOver.width /2, GameOver.height/2+200, 'score-label').setScale(0.3);
        this.add.image(GameOver.width / 2, GameOver.height / 2, 'menu-bg').setDepth(-1);
        this.scoreAmount = this.add.text(GameOver.width / 2, GameOver.height / 2 + 300, "000000", {
            fontFamily: 'Courier New',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#9c0000'
        }).setOrigin(0.5);

        const counter = { value: 0 };

        let duration = 3000;
        if(this.scoreCounter == 0) duration = 500;
        if(this.scoreCounter <= 50) duration = 1500;

        this.tweens.add({
            targets: counter,
            value: this.scoreCounter,
            duration: duration,
            delay: 500,
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
        this.menuButton = this.add.image(GameOver.width / 2 + 500, GameOver.height / 2+200, 'menu-button').setScale(GameOver.buttonScale).setInteractive().setScale(GameOver.buttonScale);
        this.menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
        this.restartButton = this.add.image(GameOver.width / 2 - 500, GameOver.height / 2+200, 'restart-button').setScale(GameOver.buttonScale).setInteractive().setScale(GameOver.buttonScale);
        this.restartButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        this.menuButton.on('pointerover', () => {
            this.menuButton.setTexture('menu-button-hover').setScale(GameOver.hoverButtonScale);
        });
        this.menuButton.on('pointerout', () => {
            this.menuButton.setTexture('menu-button').setScale(GameOver.buttonScale);
        });

        this.restartButton.on('pointerover', () => {
            this.restartButton.setTexture('restart-button-hover').setScale(GameOver.hoverButtonScale);
        });
        this.restartButton.on('pointerout', () => {
            this.restartButton.setTexture('restart-button').setScale(GameOver.buttonScale);
        });
    }

    update (time: number)
    {

    }
}
