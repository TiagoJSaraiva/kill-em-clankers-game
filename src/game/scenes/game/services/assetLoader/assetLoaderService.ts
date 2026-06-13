export function loadAssets(scene: Phaser.Scene): void {
    
    ////  RELATIVAS AO PLAYER ////

    scene.load.image('player', './assets/player/player-model.png');

    // UI
    scene.load.image('item-slot', './assets/ui/item-slot.png');
    scene.load.image('item-slot-fill', './assets/ui/item-slot-fill.png');
    scene.load.image('selected-item-slot-fill', './assets/ui/selected-item-slot-fill.png');
    scene.load.image('health-bar', './assets/ui/health-bar.png');
    scene.load.image('health-bar-fill', './assets/ui/health-bar-fill.png');
    scene.load.image('energy-bar', './assets/ui/energy-bar.png');
    scene.load.image('energy-bar-fill', './assets/ui/energy-bar-fill.png');

    // PLAYER PISTOL
    scene.load.image('player-pistol-model', './assets/player/pistol/pistol-model.png');
    scene.load.image('player-pistol-projectile', './assets/player/pistol/pistol-projectile.png');
    scene.load.image('player-pistol-icon', './assets/player/pistol/pistol-icon.png');

    // PLAYER SWORD
    scene.load.image('player-sword-model', './assets/player/sword/sword-model.png');
    scene.load.spritesheet('slash-projectile', './assets/player/sword/sword-projectile.png', {
            frameWidth: 182,
            frameHeight: 95
    });
    scene.load.image('player-sword-icon', './assets/player/sword/sword-icon.png');

    // PLAYER CROSSBOW
    scene.load.image('player-crossbow-model', './assets/player/crossbow/crossbow-model.png');
    scene.load.image('player-crossbow-projectile', './assets/player/crossbow/crossbow-projectile.png');
    scene.load.image('player-crossbow-icon', './assets/player/crossbow/crossbow-icon.png');

    // PLAYER CANNON
    scene.load.image('player-cannon-model', './assets/player/cannon/cannon-model.png');
    scene.load.spritesheet('player-cannon-projectile', './assets/player/cannon/cannon-projectile.png', {
        frameWidth: 40,
        frameHeight: 39
    });
    scene.load.image('player-cannon-icon', './assets/player/cannon/cannon-icon.png');

    ////  RELATIVAS AO AMBIENTE  ////

    scene.load.image('bg-far', './assets/background/bg-far.png');
    scene.load.image('bg-near', './assets/background/bg-near.png');

    /// RELATIVAS A INIMIGOS ///

    scene.load.image('shooter-robot-arm', './assets/enemies/shooter-robot/model-arm.png');
    scene.load.image('shooter-robot-cloak', './assets/enemies/shooter-robot/model-cloak.png');
    scene.load.spritesheet('shooter-robot-body', './assets/enemies/shooter-robot/model-body.png', {
        frameWidth: 421,
        frameHeight: 194
    });
    scene.load.image('shooter-robot-shoot-vfx', './assets/enemies/shooter-robot/shoot-vfx.png');

    
    
}
