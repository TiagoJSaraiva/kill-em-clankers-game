import { EnemyProjectile } from "../EnemyProjectile";

export default class VanRobotProjectile extends EnemyProjectile
{
    constructor (scene: Phaser.Scene, x: number, y: number, damage: number, velocity: Phaser.Math.Vector2)
    {
        super(scene, x, y, 'player-pistol-projectile', damage, velocity);
    }
}
