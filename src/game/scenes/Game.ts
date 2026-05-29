import { Scene } from 'phaser';
import { Player } from '../player/Player';

export class Game extends Scene
{
    private static readonly PARALLAX_FAR_SPEED = 0.35;
    private static readonly PARALLAX_NEAR_SPEED = 1.1;

    camera: Phaser.Cameras.Scene2D.Camera;
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    backgroundFar: Phaser.GameObjects.TileSprite;
    backgroundNear: Phaser.GameObjects.TileSprite;

    constructor ()
    {
        super('Game');
    }

    preload () {
        // Carregamentos das texturas que serão usadas na cena
            this.load.image('player', './assets/player/model.png');
            this.load.image('player-pistol', './assets/player/model_pistol_mode.png');
            this.load.image('player-sword', './assets/player/model_sword_mode.png');
            this.load.image('player-sword-attacking', './assets/player/model_sword_attacking.png');
            this.load.image('player-rifle', './assets/player/model_rifle_mode.png');
            this.load.image('player-cannon', './assets/player/model_cannon_mode.png');

            this.load.image('pistol-projectile', './assets/player/projectiles/pistol_projectile.png');
            this.load.spritesheet('slash-projectile', './assets/player/projectiles/slash_projectile.png', {
                frameWidth: 182,
                frameHeight: 95
            });
            this.load.image('arrow-projectile', './assets/player/projectiles/arrow_projectile.png');
            this.load.spritesheet('missile-projectile', './assets/player/projectiles/missile_projectile.png', {
                frameWidth: 40,
                frameHeight: 39
            });

            this.load.image('bg-far', './assets/background/bg-far.png');
            this.load.image('bg-near', './assets/background/bg-near.png');


            // Carregamento das texturas dos inimigos
            this.load.image('the-eye-normal', './assets/enemies/eye_enemy/normal.png');
            this.load.image('the-eye-strong', './assets/enemies/eye_enemy/strong.png');
            this.load.image('the-eye-impossible', './assets/enemies/eye_enemy/impossible.png');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x20313e);

        const { width, height } = this.scale;

        // Criação dos backgrounds com efeito de parallax
        this.backgroundFar = this.add.tileSprite(0, 0, width, height, 'bg-far');
        this.backgroundFar.setOrigin(0, 0);
        this.backgroundFar.setDepth(-20); // Camada mais "longe"

        this.backgroundNear = this.add.tileSprite(0, 0, width, height, 'bg-near');
        this.backgroundNear.setOrigin(0, 0);
        this.backgroundNear.setDepth(-10); // Camada mais "perto"

        this.player = new Player(this, 100, 450, 'player');
        this.player.setDepth(-1); // Camada do player, afrente dos backgrounds, mas atrás dos projéteis
        this.cursors = this.input.keyboard?.createCursorKeys()!;
    }

    update () {
        // Atualização do parallax, da esquerda pra direita
        this.backgroundFar.tilePositionX -= Game.PARALLAX_FAR_SPEED;
        this.backgroundNear.tilePositionX -= Game.PARALLAX_NEAR_SPEED;

        this.player.update(this.cursors, this);
    }
}
