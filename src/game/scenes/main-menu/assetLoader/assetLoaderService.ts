export function loadAssets(scene: Phaser.Scene): void {
    /** 
     *  @description Função responsável por carregar todos os assets do jogo.
     * 
     *  @param scene : cena do jogo onde os assets serão carregados
     */
    
    ////  RELATIVAS AOS MENU ////

    scene.load.image('main-menu-title', './assets/images/menu/main-menu-title.png');
    scene.load.image('main-menu-subtitle', './assets/images/menu/main-menu-subtitle.png');

    scene.load.image('game-over', './assets/images/menu/game-over.png');
    scene.load.image('score-label', './assets/images/menu/score-label.png');
    scene.load.image('restart-button', './assets/images/menu/restart-button.png');
    scene.load.image('restart-button-hover', './assets/images/menu/restart-button-hover.png');
    scene.load.image('menu-button', './assets/images/menu/menu-button.png');
    scene.load.image('menu-button-hover', './assets/images/menu/menu-button-hover.png');

    scene.load.image('config-button', './assets/images/menu/config-button.png');
    scene.load.image('config-button-hover', './assets/images/menu/config-button-hover.png');
    scene.load.image('play-button', './assets/images/menu/play-button.png');
    scene.load.image('play-button-hover', './assets/images/menu/play-button-hover.png');
    scene.load.image('exit-button', './assets/images/menu/exit-button.png');
    scene.load.image('exit-button-hover', './assets/images/menu/exit-button-hover.png');
    scene.load.image('menu-bg', './assets/images/menu/menu-bg.png');

    ////  RELATIVAS AO AUDIO ////

    scene.load.audio('menu-ost', './assets/audio/Menu-OST.mp3');
    scene.load.audio('game-ost', './assets/audio/Game-OST.mp3');

    ////  RELATIVAS AO PLAYER ////

    scene.load.spritesheet('player', './assets/images/player/player-model.png', {
        frameWidth: 379,
        frameHeight: 364
    });

    // UI
    scene.load.image('item-slot', './assets/images/ui/item-slot.png');
    scene.load.image('item-slot-fill', './assets/images/ui/item-slot-fill.png');
    scene.load.image('selected-item-slot-fill', './assets/images/ui/selected-item-slot-fill.png');
    scene.load.image('health-bar', './assets/images/ui/health-bar.png');
    scene.load.image('health-bar-fill', './assets/images/ui/health-bar-fill.png');
    scene.load.image('energy-bar', './assets/images/ui/energy-bar.png');
    scene.load.image('energy-bar-fill', './assets/images/ui/energy-bar-fill.png');

    // PLAYER PISTOL
    scene.load.image('player-pistol-model', './assets/images/player/pistol/pistol-model.png');
    scene.load.image('player-pistol-projectile', './assets/images/player/pistol/pistol-projectile.png');
    scene.load.image('player-pistol-icon', './assets/images/player/pistol/pistol-icon.png');

    // PLAYER SWORD
    scene.load.image('player-sword-model', './assets/images/player/sword/sword-model.png');
    scene.load.spritesheet('slash-projectile', './assets/images/player/sword/sword-projectile.png', {
            frameWidth: 182,
            frameHeight: 95
    });
    scene.load.image('player-sword-icon', './assets/images/player/sword/sword-icon.png');

    // PLAYER CROSSBOW
    scene.load.image('player-crossbow-model', './assets/images/player/crossbow/crossbow-model.png');
    scene.load.image('player-crossbow-projectile', './assets/images/player/crossbow/crossbow-projectile.png');
    scene.load.image('player-crossbow-icon', './assets/images/player/crossbow/crossbow-icon.png');

    // PLAYER CANNON
    scene.load.image('player-cannon-model', './assets/images/player/cannon/cannon-model.png');
    scene.load.spritesheet('player-cannon-projectile', './assets/images/player/cannon/cannon-projectile.png', {
        frameWidth: 40,
        frameHeight: 39
    });
    scene.load.image('player-cannon-icon', './assets/images/player/cannon/cannon-icon.png');

    ////  RELATIVAS AO AMBIENTE  ////

    scene.load.image('bg-far', './assets/images/background/bg-far.png');
    scene.load.image('bg-near', './assets/images/background/bg-near.png');
    scene.load.image('bg-middle', './assets/images/background/bg-middle.png');
    scene.load.image('bg-very-far', './assets/images/background/bg-very-far.png');

    /// RELATIVAS A INIMIGOS ///

    scene.load.image('shooter-robot-arm', './assets/images/enemies/shooter-robot/model-arm.png');
    scene.load.image('shooter-robot-cloak', './assets/images/enemies/shooter-robot/model-cloak.png');
    scene.load.spritesheet('shooter-robot-body', './assets/images/enemies/shooter-robot/model-body.png', {
        frameWidth: 421,
        frameHeight: 194
    });
    scene.load.image('shooter-robot-shoot-vfx', './assets/images/enemies/shooter-robot/shoot-vfx.png');


    scene.load.spritesheet('van-robot-body', './assets/images/enemies/van-robot/model-body.png', {
        frameWidth: 951,
        frameHeight: 400
    });
    scene.load.image('van-robot-arm', './assets/images/enemies/van-robot/model-arm.png');
    // Van robot usa mesmo VFX de tiro do shooter robot (shooter-robot-shoot-vfx)

    scene.load.spritesheet('granade-robot-body', './assets/images/enemies/granade-robot/model-body.png', {
        frameWidth: 203,
        frameHeight: 221
    });
    scene.load.image('granade-robot-arm-holding-granade', './assets/images/enemies/granade-robot/holding-granade-arm.png');
    scene.load.image('granade-robot-arm', './assets/images/enemies/granade-robot/arm.png');
    scene.load.image('granade-robot-projectile', './assets/images/enemies/granade-robot/projectile.png');
    scene.load.spritesheet('granade-explosion', './assets/images/enemies/granade-robot/explosion-vfx.png', {
        frameWidth: 333,
        frameHeight: 388
    });
}
