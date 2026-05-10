import Projectile from "./Projectile";

export default class SlashProjectile extends Projectile
{
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'slash-projectile');
    }
}