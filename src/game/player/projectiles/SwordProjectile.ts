import Projectile from "./Projectile";
import Phaser from "phaser";

export default class SwordProjectile extends Projectile
{
    private static readonly animationKey = 'slash-projectile-animation';
    private static readonly speed = 1500;
    private readonly lifespan: number = 12;
    private age: number = 0;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(SwordProjectile.speed, 0));
        this.setFlipX(false);

        this.createAnimation(texture);
        this.play(SwordProjectile.animationKey);
    }

    update(time: number, delta: number): void
    {
        super.update(time, delta);

        if (!this.active)
        {
            return;
        }

        this.processLifespan();
    }

    private processLifespan(): void
    {
        this.age++;
        if (this.age >= this.lifespan)
        {
            this.destroy();
        }
    }

    private createAnimation(texture: string): void
    {
        if (this.scene.anims.exists(SwordProjectile.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: SwordProjectile.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
    }
}
