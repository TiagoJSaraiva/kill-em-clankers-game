import Projectile from "./Projectile";

export default class WhipProjectile extends Projectile
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'whip-projectile');
    }
}