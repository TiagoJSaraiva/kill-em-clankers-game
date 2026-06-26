import { Scene, GameObjects } from 'phaser';
import { loadAssets } from './assetLoader/assetLoaderService';

/**
 * Cena do menu inicial.
 *
 * Controla a apresentacao progressiva do titulo, botao de jogar, parallax do
 * fundo, fade para iniciar a partida e musica do menu.
 */
export class MainMenu extends Scene
{
    private static readonly PARALLAX_FAR_SPEED = 0.1;
    private static readonly PARALLAX_NEAR_SPEED = 1.1;
    private static readonly PARALLAX_MIDDLE_SPEED = 0.5;
    private static readonly PARALLAX_VERY_FAR_SPEED = 0.05;

    private static readonly width: number = 1920;
    private static readonly height: number = 1080;
    private static readonly buttonScale: number = 0.2;
    private static readonly hoverButtonScale: number = 0.22;

    private updateChange: boolean = false
    private timeAtUpdateChange: number = 0;
    //private buttonsActive: boolean = false;

    private bgTween?: Phaser.Tweens.Tween;
    private fadeOutStarted: boolean = false;
    private fadeInStarted: boolean = false;

    backgroundFar!: GameObjects.TileSprite;
    backgroundNear!: GameObjects.TileSprite;
    backgroundMiddle!: GameObjects.TileSprite;
    backgroundVeryFar!: GameObjects.TileSprite;
    backgroundCover!: GameObjects.Image;

    title?: GameObjects.Image;
    subtitle?: GameObjects.Image;
    playButton?: GameObjects.Image;
    configButton?: GameObjects.Image;
    exitButton?: GameObjects.Image;
    menuOst?: Phaser.Sound.BaseSound;

    /**
     * Registra a cena com a chave usada pelas transicoes do Phaser.
     */
    constructor ()
    {
        super('MainMenu');
    }

    /**
     * Carrega os assets antes de montar a cena.
     */
    preload() {
        loadAssets(this);
    }

    /**
     * Reinicia estado transiente quando a cena e aberta novamente.
     */
    init() {
        this.updateChange = false;
        this.timeAtUpdateChange = 0;
        //this.buttonsActive = false;
        this.bgTween = undefined;
        this.fadeInStarted = false;
        this.fadeOutStarted = false;

        this.title = undefined;
        this.subtitle = undefined;
        this.playButton = undefined;
        this.configButton = undefined;
        this.exitButton = undefined;
    }

    /**
     * Cria as camadas de fundo e inicia a trilha do menu.
     */
    create ()
    {
        const { width, height } = this.scale;

        this.backgroundCover = this.add.image(MainMenu.width / 2, MainMenu.height / 2, 'menu-bg').setDepth(-1);

        this.backgroundFar = this.add.tileSprite(0, 0, width, height, 'bg-far');
        this.backgroundFar.setOrigin(0, 0);
        this.backgroundFar.setDepth(-20);

        this.backgroundNear = this.add.tileSprite(0, 0, width, height, 'bg-near');
        this.backgroundNear.setOrigin(0,-0.3);
        this.backgroundNear.setDepth(-10);

        this.backgroundMiddle = this.add.tileSprite(0, 0, width, height, 'bg-middle');
        this.backgroundMiddle.setOrigin(0,-0.18);
        this.backgroundMiddle.setDepth(-15);

        this.backgroundVeryFar = this.add.tileSprite(0, 0, width, height, 'bg-very-far');
        this.backgroundVeryFar.setOrigin(0, 0);
        this.backgroundVeryFar.setDepth(-25);

        this.playMenuOst();
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.stopMenuOst, this);
    }

    /**
     * Atualiza o parallax e gerencia a sequencia de entrada/saida do menu.
     *
     * @param time Tempo total da cena em milissegundos.
     * @param delta Tempo desde o ultimo frame em milissegundos.
     */
    update(time: number, delta: number): void{
        const dt = delta / 1000;

        this.backgroundFar.tilePositionX += MainMenu.PARALLAX_FAR_SPEED * 60 * dt;
        this.backgroundNear.tilePositionX += MainMenu.PARALLAX_NEAR_SPEED * 60 * dt;
        this.backgroundMiddle.tilePositionX += MainMenu.PARALLAX_MIDDLE_SPEED * 60 * dt;
        this.backgroundVeryFar.tilePositionX += MainMenu.PARALLAX_VERY_FAR_SPEED * 60 * dt;

        if(!this.updateChange) {
            if(time > 3000 && !this.title) {
                this.title = this.add.image(MainMenu.width / 2, 220, 'main-menu-title').setDepth(1);
            }
            if(time > 3500 && !this.subtitle) {
                this.subtitle = this.add.image(MainMenu.width / 2, 450, 'main-menu-subtitle').setDepth(2).setScale(0.3);
            }
            if(time > 4000 && !this.playButton) {
                this.playButton = this.add.image(MainMenu.width / 2, 800, 'play-button').setScale(MainMenu.buttonScale);
            }
            // if(time > 4300 && !this.configButton) {
            //     this.configButton = this.add.image(MainMenu.width / 2 - 500, 800, 'config-button').setScale(MainMenu.buttonScale);
            // }
            // if(time > 4600 && !this.exitButton) {
            //     this.exitButton = this.add.image(MainMenu.width / 2 + 500, 800, 'exit-button').setScale(MainMenu.buttonScale);
            // }
            if(this.playButton /*&& this.configButton && this.exitButton && !this.buttonsActive */) {
                this.setupButtons();
            }
            if(time > 5000 && !this.bgTween && !this.fadeOutStarted) {
                this.fadeOutStarted = true;

                this.bgTween = this.tweens.add({
                    targets: this.backgroundCover,
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',
                });  
            }

        } else {
            let _time = time - this.timeAtUpdateChange;

            if(this.playButton) {
                this.playButton.destroy();
                this.playButton = undefined;
            }

            //this.buttonsActive = false;

            if(_time > 2000 && this.title) {
                this.title.destroy();
                this.title = undefined;
            }
            if(_time > 1200 && this.subtitle) {
                this.subtitle.destroy();
                this.subtitle = undefined;    
            }
            if(_time > 200 && this.configButton) {
                this.configButton.destroy();
                this.configButton = undefined;
            }
            if(_time > 400 && this.exitButton) {
                this.exitButton.destroy();
                this.exitButton = undefined;
            }
            if(_time > 3000 && !this.fadeInStarted) {
                this.fadeInStarted = true;

                this.bgTween?.stop();

                this.bgTween = this.tweens.add({
                    targets: this.backgroundCover,
                    alpha: 1,
                    duration: 500,
                    ease: 'Linear',
                    onComplete: () => {
                        setTimeout(() => {
                            this.scene.start('Game');
                        }, 500);
                    }
                });
            }
        }
    }

    /**
     * Ativa interacao, hover e transicao para o botao de jogar.
     */
    setupButtons() {
        if (!this.playButton /*|| !this.configButton || !this.exitButton*/) {
            console.error('Botões do menu não estão definidos.');
            return;
        }
        //this.buttonsActive = true;

        this.playButton!.setInteractive({ useHandCursor: true });
        // this.configButton!.setInteractive({ useHandCursor: true });
        // this.exitButton!.setInteractive({ useHandCursor: true });

        this.playButton!.on('pointerover', () => {
            this.playButton!.setTexture('play-button-hover');
            this.playButton!.setScale(MainMenu.hoverButtonScale);
        });

        this.playButton!.on('pointerout', () => {
            this.playButton!.setTexture('play-button');
            this.playButton!.setScale(MainMenu.buttonScale);
        });

        this.playButton!.on('pointerdown', () => {
            this.timeAtUpdateChange = this.time.now;
            this.updateChange = true;
        });

        // this.configButton!.on('pointerover', () => {
        //     this.configButton!.setTexture('config-button-hover');
        //     this.configButton!.setScale(MainMenu.hoverButtonScale);
        // });

        // this.configButton!.on('pointerout', () => {
        //     this.configButton!.setTexture('config-button');
        //     this.configButton!.setScale(MainMenu.buttonScale);
        // });

        // this.configButton!.on('pointerdown', () => {
        //     // Lógica para abrir as configurações do jogo
        //     console.log('Configurações do jogo');
        // });

        // this.exitButton!.on('pointerover', () => {
        //     this.exitButton!.setTexture('exit-button-hover');
        //     this.exitButton!.setScale(MainMenu.hoverButtonScale);
        // });

        // this.exitButton!.on('pointerout', () => {
        //     this.exitButton!.setTexture('exit-button');
        //     this.exitButton!.setScale(MainMenu.buttonScale);
        // });

        // this.exitButton!.on('pointerdown', () => {
        //     // Lógica para sair do jogo
        //     console.log('Sair do jogo');
        // });
    }

    /**
     * Inicia a musica de fundo do menu em loop.
     */
    private playMenuOst(): void
    {
        this.menuOst = this.sound.add('menu-ost', {
            loop: true,
        });

        this.menuOst.play();
    }

    /**
     * Para e remove a musica quando a cena e desligada.
     */
    private stopMenuOst(): void
    {
        if (!this.menuOst)
        {
            return;
        }

        this.menuOst.stop();
        this.menuOst.destroy();
        this.menuOst = undefined;
    }
}
