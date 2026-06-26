import { EnemyProjectile } from "../EnemyProjectile";

type GranadeRobotProjectileState = 'arc' | 'falling' | 'exploding';

export default class GranadeRobotProjectile extends EnemyProjectile
{
    private static readonly textureKey = 'granade-robot-projectile';
    private static readonly explosionTextureKey = 'granade-explosion';
    private static readonly explosionAnimationKey = 'granade-explosion';
    private static readonly explosionAudioKey = 'granade-explosion-audio';
    private static readonly arcDuration = 900;
    private static readonly arcHeight = 220;
    private static readonly fallSpeed = 700;
    private static readonly offscreenMargin = 400;
    private static readonly explosionFrameRate = 18;
    private static readonly fallbackExplosionDuration = 150;

    private readonly startPosition: Phaser.Math.Vector2;
    private readonly targetPosition: Phaser.Math.Vector2;
    private startedAt: number | null = null;
    private state: GranadeRobotProjectileState = 'arc';
    private shouldExplodeOnDestroy: boolean = true;

    constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        damage: number,
        targetPosition: Phaser.Math.Vector2
    )
    {
        super(scene, x, y, GranadeRobotProjectile.textureKey, damage, new Phaser.Math.Vector2(0, 0));
        this.startPosition = new Phaser.Math.Vector2(x, y);
        this.targetPosition = targetPosition.clone();
    }

    update(time: number, delta: number): void
    {
        if (this.state === 'exploding')
        {
            return;
        }

        if (this.state === 'falling')
        {
            this.updateFalling(delta);
            return;
        }

        this.updateArc(time);
    }

    destroy(fromScene?: boolean): void
    {
        const shouldPlayExplosion = this.shouldExplodeOnDestroy
            && !fromScene
            && this.state !== 'exploding'
            && this.active;

        this.shouldExplodeOnDestroy = false;

        if (shouldPlayExplosion)
        {
            this.state = 'exploding';
            this.playExplosionEffects();
        }

        super.destroy(fromScene);
    }

    private updateArc(time: number): void
    {
        if (this.startedAt === null)
        {
            this.startedAt = time;
        }

        const elapsed = time - this.startedAt;
        const progress = Phaser.Math.Clamp(elapsed / GranadeRobotProjectile.arcDuration, 0, 1);
        const nextX = Phaser.Math.Linear(this.startPosition.x, this.targetPosition.x, progress);
        const nextY = Phaser.Math.Linear(this.startPosition.y, this.targetPosition.y, progress)
            - (Math.sin(progress * Math.PI) * GranadeRobotProjectile.arcHeight);
        const body = this.body as Phaser.Physics.Arcade.Body | null;

        this.setPosition(nextX, nextY);
        body?.reset(nextX, nextY);

        if (progress >= 1)
        {
            this.state = 'falling';
        }
    }

    private updateFalling(delta: number): void
    {
        const nextX = this.targetPosition.x;
        const nextY = this.y + (GranadeRobotProjectile.fallSpeed * (delta / 1000));

        this.syncPosition(nextX, nextY);

        if (nextY > this.scene.scale.height + GranadeRobotProjectile.offscreenMargin)
        {
            this.destroyWithoutExplosion();
        }
    }

    private syncPosition(x: number, y: number): void
    {
        const body = this.body as Phaser.Physics.Arcade.Body | null;

        this.setPosition(x, y);
        body?.reset(x, y);
    }

    private destroyWithoutExplosion(): void
    {
        this.shouldExplodeOnDestroy = false;
        this.destroy();
    }

    private playExplosionEffects(): void
    {
        this.playExplosionAudio();
        this.playExplosionVfx();
    }

    private playExplosionAudio(): void
    {
        if (!this.scene.cache.audio.exists(GranadeRobotProjectile.explosionAudioKey))
        {
            return;
        }

        this.scene.sound.play(GranadeRobotProjectile.explosionAudioKey);
    }

    private playExplosionVfx(): void
    {
        if (!this.scene.textures.exists(GranadeRobotProjectile.explosionTextureKey))
        {
            return;
        }

        const explosion = this.scene.add.sprite(
            this.x,
            this.y,
            GranadeRobotProjectile.explosionTextureKey
        );
        const frameNames = this.scene.textures
            .get(GranadeRobotProjectile.explosionTextureKey)
            .getFrameNames(false);

        explosion.setDepth(this.depth + 1);

        if (frameNames.length === 0)
        {
            this.scene.time.delayedCall(
                GranadeRobotProjectile.fallbackExplosionDuration,
                () => explosion.destroy()
            );
            return;
        }

        this.createExplosionAnimation(frameNames);
        explosion.play(GranadeRobotProjectile.explosionAnimationKey);
        explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion.destroy();
        });
    }

    private createExplosionAnimation(frameNames: string[]): void
    {
        if (this.scene.anims.exists(GranadeRobotProjectile.explosionAnimationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: GranadeRobotProjectile.explosionAnimationKey,
            frames: frameNames.map((frame) => ({
                key: GranadeRobotProjectile.explosionTextureKey,
                frame
            })),
            frameRate: GranadeRobotProjectile.explosionFrameRate,
            repeat: 0
        });
    }
}
