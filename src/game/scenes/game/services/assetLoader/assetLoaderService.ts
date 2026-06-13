export function loadAssets(scene: Phaser.Scene): void {
    /** 
     *  @description Função responsável por carregar todos os assets do jogo.
     * 
     *  @param scene : cena do jogo onde os assets serão carregados
     */

    ////  RELATIVAS AO PLAYER ////

    scene.load.image('player', './assets/images/player/player-model.png');

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

    
    
}
