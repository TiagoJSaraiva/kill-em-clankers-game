import { Scene } from 'phaser';


/**
 * Cena exibida apos a derrota do jogador.
 *
 * Mostra o placar final com animacao de contagem e oferece botoes para voltar
 * ao menu ou reiniciar a partida.
 */
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

    /**
     * Registra a cena com a chave usada pelas transicoes do Phaser.
     */
    constructor ()
    {
        super('GameOver');
    }

    /**
     * Recebe a pontuacao final enviada pela cena principal.
     *
     * @param data Dados enviados pela transicao para GameOver.
     */
    init (data: { score: number })
    {
        this.scoreCounter = data.score;
    }

    /**
     * Cria layout, contador animado de score e botoes ao final da animacao.
     */
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

    /**
     * Configura botoes de voltar ao menu e reiniciar a partida.
     */
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

    /**
     * Reservado para futuras animacoes por frame da tela de Game Over.
     */
    update (time: number)
    {

    }
}
