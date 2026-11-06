import { Scene } from 'phaser';
import { loadAssets } from './assetLoader/assetLoaderService';

/**
 * Tela de carregamento.
 *
 * Mostra o progresso dos assets e, ao terminar, aguarda um clique. O clique
 * libera o audio, que o navegador bloqueia antes de uma interacao, e apresenta
 * os controles ao jogador.
 */
export class Preloader extends Scene
{
    private static readonly centerX = 960;
    private static readonly titleY = 330;
    private static readonly subtitleOffsetY = 230; // Mesma distancia entre titulo e subtitulo usada no menu
    private static readonly barY = 700;
    private static readonly barWidth = 900;
    private static readonly barHeight = 24;
    private static readonly fontFamily = '"Courier New", monospace';
    private static readonly cyan = 0x4fe3ff;
    private static readonly magenta = 0xff4fd8;

    private loadFailed: boolean = false;
    private barFill: Phaser.GameObjects.Rectangle;
    private barFrame: Phaser.GameObjects.Rectangle;
    private statusText: Phaser.GameObjects.Text;

    /**
     * Registra a cena com a chave usada pelas transicoes do Phaser.
     */
    constructor ()
    {
        super('Preloader');
    }

    /**
     * Monta a tela e inicia o carregamento de todos os assets do jogo.
     */
    preload ()
    {
        this.loadFailed = false;
        this.add.image(Preloader.centerX, Preloader.titleY, 'main-menu-title');
        this.add.image(Preloader.centerX, Preloader.titleY + Preloader.subtitleOffsetY, 'main-menu-subtitle');
        this.createProgressBar();

        this.load.on(Phaser.Loader.Events.PROGRESS, this.updateProgress, this);
        this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, this.showLoadError, this);

        loadAssets(this);
    }

    /**
     * Exibe o convite para iniciar, exceto se algum asset tiver falhado.
     */
    create ()
    {
        if (this.loadFailed)
        {
            return;
        }

        this.barFrame.destroy();
        this.barFill.destroy();
        this.showStartPrompt();

        this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start('MainMenu');
        });
    }

    /**
     * Cria a moldura e o preenchimento da barra, alem do texto de status.
     */
    private createProgressBar (): void
    {
        const left = Preloader.centerX - (Preloader.barWidth / 2);

        this.barFrame = this.add.rectangle(Preloader.centerX, Preloader.barY, Preloader.barWidth + 12, Preloader.barHeight + 12)
            .setStrokeStyle(3, Preloader.cyan);
        this.barFill = this.add.rectangle(left, Preloader.barY, 0, Preloader.barHeight, Preloader.magenta)
            .setOrigin(0, 0.5);

        this.statusText = this.add.text(Preloader.centerX, Preloader.barY + 60, 'Carregando... 0%', {
            fontFamily: Preloader.fontFamily,
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#4fe3ff'
        }).setOrigin(0.5);
    }

    /**
     * Atualiza a barra. No fim, o texto muda porque decodificar as musicas
     * ainda leva um tempo depois do download.
     *
     * @param progress Progresso do carregamento, entre 0 e 1.
     */
    private updateProgress (progress: number): void
    {
        if (this.loadFailed)
        {
            return;
        }

        this.barFill.setSize(Preloader.barWidth * progress, Preloader.barHeight);
        this.statusText.setText(progress >= 1
            ? 'Preparando...'
            : `Carregando... ${Math.floor(progress * 100)}%`);
    }

    /**
     * Informa a falha na tela, ja que o jogo nao funciona sem os assets.
     *
     * @param file Arquivo que nao pode ser carregado.
     */
    private showLoadError (file: Phaser.Loader.File): void
    {
        this.loadFailed = true;
        console.error(`Falha ao carregar o asset: ${file.key}`);
        this.statusText
            .setText('Falha ao carregar o jogo. Recarregue a página para tentar de novo.')
            .setColor('#ff5a5a');
    }

    /**
     * Exibe o texto pulsante de inicio e o resumo dos controles.
     */
    private showStartPrompt (): void
    {
        const prompt = this.statusText
            .setText('Clique para começar')
            .setFontSize(44)
            .setY(Preloader.barY)
            .setColor('#ffffff');

        this.tweens.add({
            targets: prompt,
            alpha: 0.35,
            duration: 700,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.add.text(
            Preloader.centerX,
            Preloader.barY + 110,
            'Setas: mover  ·  Espaço: atacar  ·  Q W E R: trocar de arma  ·  F: tela cheia',
            {
                fontFamily: Preloader.fontFamily,
                fontSize: '28px',
                color: '#4fe3ff'
            }
        ).setOrigin(0.5);
    }
}
