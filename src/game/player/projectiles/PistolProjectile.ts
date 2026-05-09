import Projectile from "./Projectile";

export default class PistolProjectile extends Projectile
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'pistol-projectile');
    }
}