import Projectile from "./Projectile";

export default class PistolProjectile extends Projectile
{
    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage);
        this.setVelocityX(400);
    }
}
