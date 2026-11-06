import { Scene } from 'phaser';

/**
 * Primeira cena do jogo.
 *
 * Carrega apenas o que a tela de carregamento precisa exibir e entrega o
 * controle para a cena Preloader.
 */
export class Boot extends Scene
{
    /**
     * Registra a cena com a chave usada pelas transicoes do Phaser.
     */
    constructor ()
    {
        super('Boot');
    }

    /**
     * Carrega o logo exibido durante o carregamento dos demais assets.
     */
    preload ()
    {
        this.load.image('main-menu-title', './assets/images/menu/main-menu-title.png');
        this.load.image('main-menu-subtitle', './assets/images/menu/main-menu-subtitle.png');
    }

    /**
     * Remove o aviso HTML, ja que o canvas assume a tela a partir daqui.
     */
    create ()
    {
        document.getElementById('page-loading')?.remove();
        this.scene.start('Preloader');
    }
}
