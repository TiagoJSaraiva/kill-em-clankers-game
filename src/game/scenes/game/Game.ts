import { Scene } from 'phaser';
import { Player } from '../../player/Player';
import manageSpawn from './services/spawn/spawnService';
import { loadAssets } from './services/assetLoader/assetLoaderService';
import Phaser from 'phaser';

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
        // Método para carregar os assets do jogo, como imagens, spritesheets, sons, etc.
        loadAssets(this);

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

        this.player = new Player(this, 100, 450);
        this.player.setDepth(-1); // Camada do player, afrente dos backgrounds, mas atrás dos projéteis
        this.cursors = this.input.keyboard?.createCursorKeys()!;

        this.physics.world.setBoundsCollision(true, false, true, true);
        // left, right, up, down
    }

    update (time: number) { 
        const elapsedTimeInSeconds = Math.floor(time / 1000);

        manageSpawn(this, elapsedTimeInSeconds);

        // Atualização do parallax, da esquerda pra direita
        this.backgroundFar.tilePositionX += Game.PARALLAX_FAR_SPEED;
        this.backgroundNear.tilePositionX += Game.PARALLAX_NEAR_SPEED;
        this.player.update(this.cursors, this);
    }
}
