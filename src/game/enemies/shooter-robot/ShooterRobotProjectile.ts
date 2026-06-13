import { EnemyProjectile } from "../EnemyProjectile";

export default class ShooterRobotProjectile extends EnemyProjectile
{
    constructor (scene: Phaser.Scene, x: number, y: number, damage: number, velocity: Phaser.Math.Vector2)
    {
        super(scene, x, y, 'player-pistol-projectile', damage);
        this.setVelocity(velocity.x, velocity.y);
    }
}
