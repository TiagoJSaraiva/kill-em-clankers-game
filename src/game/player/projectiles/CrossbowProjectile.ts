import Projectile from "./Projectile";
import Phaser from "phaser";

export default class CrossbowProjectile extends Projectile
{
    private static readonly speed = 1200;
    private static readonly penetration = 4;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(CrossbowProjectile.speed, 0), CrossbowProjectile.penetration);
        this.setFlipX(false);
    }
}
