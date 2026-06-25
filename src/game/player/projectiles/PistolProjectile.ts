import Projectile from "./Projectile";
import Phaser from "phaser";

export default class PistolProjectile extends Projectile
{
    private static readonly speed = 400;

    override penetration = 1;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(PistolProjectile.speed, 0));
        this.setFlipX(false);
    }
}
