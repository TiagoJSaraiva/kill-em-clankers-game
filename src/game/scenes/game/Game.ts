import { Scene } from 'phaser';
import { Player } from '../../player/Player';
import manageSpawn from './services/spawn/spawnService';
import { loadAssets } from './services/assetLoader/assetLoaderService';
import Phaser from 'phaser';
import Enemy from '../../enemies/Enemy';
import { EnemyProjectile } from '../../enemies/EnemyProjectile';
import Projectile from '../../player/projectiles/Projectile';

type ArcadeOverlapObject = Parameters<Phaser.Types.Physics.Arcade.ArcadePhysicsCallback>[0];

export class Game extends Scene
{
    private static readonly PARALLAX_FAR_SPEED = 0.1;
    private static readonly PARALLAX_NEAR_SPEED = 1.1;
    private static readonly PARALLAX_MIDDLE_SPEED = 0.5;
    private static readonly PARALLAX_VERY_FAR_SPEED = 0.05;

    camera: Phaser.Cameras.Scene2D.Camera;
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    backgroundFar: Phaser.GameObjects.TileSprite;
    backgroundNear: Phaser.GameObjects.TileSprite;
    backgroundMiddle: Phaser.GameObjects.TileSprite;
    backgroundVeryFar: Phaser.GameObjects.TileSprite;
    enemies: Phaser.Physics.Arcade.Group;
    playerProjectiles: Phaser.Physics.Arcade.Group;
    enemyProjectiles: Phaser.Physics.Arcade.Group;

    constructor ()
    {
        super('Game');
    }

    preload () {
        loadAssets(this);
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x2A195C);

        const { width, height } = this.scale;

        this.backgroundFar = this.add.tileSprite(0, 0, width, height, 'bg-far');
        this.backgroundFar.setOrigin(0, 0);
        this.backgroundFar.setDepth(-20);

        this.backgroundNear = this.add.tileSprite(0, 0, width, height, 'bg-near');
        this.backgroundNear.setOrigin(0,-0.3);
        this.backgroundNear.setDepth(-10);

        this.backgroundMiddle = this.add.tileSprite(0, 0, width, height, 'bg-middle');
        this.backgroundMiddle.setOrigin(0,-0.3);
        this.backgroundMiddle.setDepth(-15);

        this.backgroundVeryFar = this.add.tileSprite(0, 0, width, height, 'bg-very-far');
        this.backgroundVeryFar.setOrigin(0, 0);
        this.backgroundVeryFar.setDepth(-25);

        this.enemies = this.physics.add.group();
        this.playerProjectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();

        this.player = new Player(this, 100, 450);
        this.player.setDepth(-1);
        this.cursors = this.input.keyboard?.createCursorKeys()!;

        this.physics.world.setBoundsCollision(true, false, true, true);
        this.configureCollisions();
    }

    update (time: number, delta: number) {
        const elapsedTimeInSeconds = Math.floor(time / 1000);

        manageSpawn(this, elapsedTimeInSeconds);

        this.backgroundFar.tilePositionX += Game.PARALLAX_FAR_SPEED;
        this.backgroundNear.tilePositionX += Game.PARALLAX_NEAR_SPEED;
        this.backgroundMiddle.tilePositionX += Game.PARALLAX_MIDDLE_SPEED;
        this.backgroundVeryFar.tilePositionX += Game.PARALLAX_VERY_FAR_SPEED;
        this.player.update(this.cursors, this);
        this.updateGroup(this.enemies, time, delta);
        this.updateGroup(this.playerProjectiles, time, delta);
        this.updateGroup(this.enemyProjectiles, time, delta);
    }

    registerEnemy(enemy: Enemy): void
    {
        this.enemies.add(enemy);
    }

    registerPlayerProjectile(projectile: Projectile): void
    {
        this.playerProjectiles.add(projectile);
    }

    registerEnemyProjectile(projectile: EnemyProjectile): void
    {
        this.enemyProjectiles.add(projectile);
    }

    private configureCollisions(): void
    {
        this.physics.add.overlap(
            this.playerProjectiles,
            this.enemies,
            this.handlePlayerProjectileEnemyOverlap,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.enemyProjectiles,
            this.player,
            this.handleEnemyProjectilePlayerOverlap,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.enemies,
            this.player,
            this.handleEnemyPlayerOverlap,
            undefined,
            this
        );
    }

    private updateGroup(group: Phaser.Physics.Arcade.Group, time: number, delta: number): void
    {
        for (const child of group.getChildren())
        {
            if (!child.active)
            {
                continue;
            }

            const updatable = child as Phaser.GameObjects.GameObject & {
                update?: (time: number, delta: number) => void
            };

            updatable.update?.(time, delta);
        }
    }

    private handlePlayerProjectileEnemyOverlap(
        projectileObject: ArcadeOverlapObject,
        enemyObject: ArcadeOverlapObject
    ): void
    {
        const projectile = projectileObject as unknown as Projectile;
        const enemy = enemyObject as unknown as Enemy;

        if (!projectile.active || !enemy.active)
        {
            return;
        }

        enemy.takeDamage(projectile.damage);
        projectile.destroy();
    }

    private handleEnemyProjectilePlayerOverlap(
        projectileObject: ArcadeOverlapObject,
        _playerObject: ArcadeOverlapObject
    ): void
    {
        const projectile = projectileObject as unknown as EnemyProjectile;

        if (!projectile.active || !this.player.active)
        {
            return;
        }

        this.player.takeDamage(projectile.damage);
        projectile.destroy();
    }

    private handleEnemyPlayerOverlap(
        enemyObject: ArcadeOverlapObject,
        _playerObject: ArcadeOverlapObject
    ): void
    {
        const enemy = enemyObject as unknown as Enemy;

        if (!enemy.active || !this.player.active)
        {
            return;
        }

        enemy.tryContactDamage(this.player, this.time.now);
    }
}
