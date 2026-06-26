import { EnemyProjectile } from "../EnemyProjectile";

/**
 * Projetil disparado pelo ShooterRobot.
 */
export default class ShooterRobotProjectile extends EnemyProjectile
{
    constructor (scene: Phaser.Scene, x: number, y: number, damage: number, velocity: Phaser.Math.Vector2)
    {
        super(scene, x, y, 'player-pistol-projectile', damage, velocity);
    }
}
