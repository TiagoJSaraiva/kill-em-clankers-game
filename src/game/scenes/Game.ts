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

        // Carregamento das imagens
         let images = [
            { key: 'player',                 path: './assets/player/model.png' },
            { key: 'player-pistol',          path: './assets/player/model_pistol_mode.png' },
            { key: 'player-sword',           path: './assets/player/model_sword_mode.png' },
            { key: 'player-sword-attacking', path: './assets/player/model_sword_attacking.png' },
            { key: 'player-rifle',           path: './assets/player/model_rifle_mode.png' },
            { key: 'player-cannon',          path: './assets/player/model_cannon_mode.png' },
            { key: 'pistol-projectile',      path: './assets/player/projectiles/pistol_projectile.png' },
            { key: 'bg-far',                 path: './assets/background/bg-far.png' },
            { key: 'bg-near',                path: './assets/background/bg-near.png' },
            { key: 'the-eye-normal',         path: './assets/enemies/eye_enemy/normal.png' },
            { key: 'the-eye-strong',         path: './assets/enemies/eye_enemy/strong.png' },
            { key: 'the-eye-impossible',     path: './assets/enemies/eye_enemy/impossible.png' },
        ];

        images.forEach(image => this.load.image(image.key, image.path));


        
        // Carregamento dos spritesheets
        this.load.spritesheet('slash-projectile', './assets/player/projectiles/slash_projectile.png', {
            frameWidth: 182,
            frameHeight: 95
        });

        this.load.spritesheet('missile-projectile', './assets/player/projectiles/missile_projectile.png', {
            frameWidth: 40,
            frameHeight: 39
        });

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
