import { Scene } from 'phaser';
import { Player } from '../../player/Player';
import manageSpawn from '../../services/spawn/spawnService';

export class Game extends Scene
{
    private static readonly PARALLAX_FAR_SPEED = 0.35;
    private static readonly PARALLAX_NEAR_SPEED = 1.1;

    camera: Phaser.Cameras.Scene2D.Camera;
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    backgroundFar: Phaser.GameObjects.TileSprite;
    backgroundNear: Phaser.GameObjects.TileSprite;
    elapsedTime: number;

    constructor ()
    {
        super('Game');
    }

    preload () {
        // Carregamentos das texturas que serão usadas na cena
        let image = (key: string, path: string) => {return { key, path };};

        // Carregamento das imagens
        let images = [
        //  KEY                             PATH 
            image('player',                 './assets/player/model.png'),
            image('player-pistol',          './assets/player/model_pistol_mode.png'),
            image('player-sword',           './assets/player/model_sword_mode.png'),
            image('player-sword-attacking', './assets/player/model_sword_attacking.png'),
            image('player-rifle',           './assets/player/model_rifle_mode.png'),
            image('player-cannon',          './assets/player/model_cannon_mode.png'),
            image('pistol-projectile',      './assets/player/projectiles/pistol_projectile.png'),
            image('arrow-projectile',       './assets/player/projectiles/arrow_projectile.png'),
            image('bg-far',                 './assets/background/bg-far.png'),
            image('bg-near',                './assets/background/bg-near.png'),
            image('shooter-robot-normal',         './assets/enemies/shooter-robot/normal.png'),
            image('shooter-robot-strong',         './assets/enemies/shooter-robot/strong.png'),
            image('shooter-robot-impossible',     './assets/enemies/shooter-robot/impossible.png'),
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
        this.elapsedTime = 0;
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

    update (_time: number, delta: number) { // Adicionado _ em _time para ser ignorado pelo lint
        this.elapsedTime += delta;

        // Atualização do parallax, da esquerda pra direita
        this.backgroundFar.tilePositionX += Game.PARALLAX_FAR_SPEED;
        this.backgroundNear.tilePositionX += Game.PARALLAX_NEAR_SPEED;
        manageSpawn(this, this.elapsedTime);
        this.player.update(this.cursors, this);
    }
}
