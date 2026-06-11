export function loadAssets(scene: Phaser.Scene): void {
    
    /*  RELATIVAS AO PLAYER */
    scene.load.image('player', './assets/player/model.png');

    // PLAYER PISTOL
    scene.load.image('player-pistol-model', './assets/player/pistol/pistol-model.png');
    scene.load.image('player-pistol-projectile', './assets/player/pistol/pistol-projectile.png');
    scene.load.image('player-pistol-icon', './assets/player/pistol/pistol-icon.png');

    // PLAYER SWORD
    scene.load.image('player-sword-model', './assets/player/sword/sword-model.png');
    scene.load.image('player-sword-model-attacking', './assets/player/sword/sword-model-attacking.png');
    scene.load.spritesheet('slash-projectile', './assets/player/projectiles/slash_projectile.png', {
            frameWidth: 182,
            frameHeight: 95
    });
    scene.load.image('player-sword-icon', './assets/player/sword/sword-icon.png');

    //PLAYER CROSSBOW
    scene.load.image('player-crossbow-model', './assets/player/model_rifle_mode.png');


    scene.load.image('player-cannon', './assets/player/model_cannon_mode.png');
    scene.load.image('arrow-projectile', './assets/player/projectiles/arrow_projectile.png');
    scene.load.image('bg-far', './assets/background/bg-far.png');
    scene.load.image('bg-near', './assets/background/bg-near.png');
    scene.load.image('shooter-robot-normal', './assets/enemies/shooter-robot/normal.png');
    scene.load.image('shooter-robot-strong', './assets/enemies/shooter-robot/strong.png');
    scene.load.image('shooter-robot-impossible', './assets/enemies/shooter-robot/impossible.png');

    
    scene.load.spritesheet('missile-projectile', './assets/player/projectiles/missile_projectile.png', {
        frameWidth: 40,
        frameHeight: 39
    });
}
