import Projectile from "./Projectile";
import Phaser from "phaser";
import Enemy from "../../enemies/Enemy";

export default class CannonProjectile extends Projectile
{
    private static readonly animationKey = 'player-cannon-projectile-animation';
    private static readonly explosionTextureKey = 'cannon-explosion';
    private static readonly explosionAnimationKey = 'cannon-explosion-animation';
    private static readonly explosionAudioKey = 'granade-explosion-audio';
    private static readonly speed = 600;
    private static readonly penetration = 1;
    private static readonly explosionRadius = 180;
    private static readonly explosionDamageMultiplier = 0.5;
    private static readonly explosionFrameRate = 18;
    private static readonly fallbackExplosionDuration = 150;

    private hasExploded: boolean = false;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(CannonProjectile.speed, 0), CannonProjectile.penetration);
        this.setFlipX(false);

        this.createAnimation(texture);
        this.play(CannonProjectile.animationKey);
    }

    public explode(enemies: Phaser.Physics.Arcade.Group, excludedEnemy: Enemy): number
    {
        if (this.hasExploded)
        {
            return 0;
        }

        this.hasExploded = true;
        this.playExplosionEffects();

        let scoreFromExplosion = 0;
        const explosionDamage = this.damage * CannonProjectile.explosionDamageMultiplier;

        for (const child of enemies.getChildren())
        {
            const enemy = child as Enemy;

            if (enemy === excludedEnemy || !enemy.active)
            {
                continue;
            }

            const distanceToEnemy = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                enemy.x,
                enemy.y
            );

            if (distanceToEnemy > CannonProjectile.explosionRadius)
            {
                continue;
            }

            const takeDamageResult = enemy.takeDamage(explosionDamage);

            if (typeof takeDamageResult === 'number')
            {
                scoreFromExplosion += takeDamageResult;
            }
        }

        return scoreFromExplosion;
    }

    private createAnimation(texture: string): void
    {
        if (this.scene.anims.exists(CannonProjectile.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: CannonProjectile.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
    }

    private playExplosionEffects(): void
    {
        this.playExplosionAudio();
        this.playExplosionVfx();
    }

    private playExplosionAudio(): void
    {
        if (!this.scene.cache.audio.exists(CannonProjectile.explosionAudioKey))
        {
            return;
        }

        this.scene.sound.play(CannonProjectile.explosionAudioKey);
    }

    private playExplosionVfx(): void
    {
        if (!this.scene.textures.exists(CannonProjectile.explosionTextureKey))
        {
            return;
        }

        const explosion = this.scene.add.sprite(
            this.x,
            this.y,
            CannonProjectile.explosionTextureKey
        );
        const frameNames = this.scene.textures
            .get(CannonProjectile.explosionTextureKey)
            .getFrameNames(false);

        explosion.setDepth(this.depth + 1);

        if (frameNames.length === 0)
        {
            this.scene.time.delayedCall(
                CannonProjectile.fallbackExplosionDuration,
                () => explosion.destroy()
            );
            return;
        }

        this.createExplosionAnimation(frameNames);
        explosion.play(CannonProjectile.explosionAnimationKey);
        explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion.destroy();
        });
    }

    private createExplosionAnimation(frameNames: string[]): void
    {
        if (this.scene.anims.exists(CannonProjectile.explosionAnimationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: CannonProjectile.explosionAnimationKey,
            frames: frameNames.map((frame) => ({
                key: CannonProjectile.explosionTextureKey,
                frame
            })),
            frameRate: CannonProjectile.explosionFrameRate,
            repeat: 0
        });
    }
}
