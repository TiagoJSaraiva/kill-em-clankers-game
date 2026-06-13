import Projectile from "./Projectile";

export default class CannonProjectile extends Projectile
{
    private static readonly animationKey = 'player-cannon-projectile-animation';

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage);
        this.setVelocityX(200);

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
