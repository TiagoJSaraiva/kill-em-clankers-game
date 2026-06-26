import { EnemyProjectile } from "../EnemyProjectile";

/**
 * Projetil disparado durante a rajada do VanRobot.
 */
export default class VanRobotProjectile extends EnemyProjectile
{
    constructor (scene: Phaser.Scene, x: number, y: number, damage: number, velocity: Phaser.Math.Vector2)
    {
        super(scene, x, y, 'player-pistol-projectile', damage, velocity);
    }
}
