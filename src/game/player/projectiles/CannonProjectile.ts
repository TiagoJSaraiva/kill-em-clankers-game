import Projectile from "./Projectile";
import Phaser from "phaser";

export default class CannonProjectile extends Projectile
{
    private static readonly animationKey = 'player-cannon-projectile-animation';
    private static readonly speed = 200;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(CannonProjectile.speed, 0));
        this.setFlipX(false);

        this.createAnimation(texture);
        this.play(CannonProjectile.animationKey);
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
}
