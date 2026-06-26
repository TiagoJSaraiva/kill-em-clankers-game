import { EnemyProjectile } from "../EnemyProjectile";

export default class GranadeRobotProjectile extends EnemyProjectile
{
    private static readonly textureKey = 'granade-robot-projectile';
    private static readonly arcDuration = 900;
    private static readonly arcHeight = 220;

    private readonly startPosition: Phaser.Math.Vector2;
    private readonly targetPosition: Phaser.Math.Vector2;
    private startedAt: number | null = null;

    constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        damage: number,
        targetPosition: Phaser.Math.Vector2
    )
    {
        super(scene, x, y, GranadeRobotProjectile.textureKey, damage, new Phaser.Math.Vector2(0, 0));
        this.startPosition = new Phaser.Math.Vector2(x, y);
        this.targetPosition = targetPosition.clone();
    }

    update(time: number, _delta: number): void
    {
        if (this.startedAt === null)
        {
            this.startedAt = time;
        }

        const elapsed = time - this.startedAt;
        const progress = Phaser.Math.Clamp(elapsed / GranadeRobotProjectile.arcDuration, 0, 1);
        const nextX = Phaser.Math.Linear(this.startPosition.x, this.targetPosition.x, progress);
        const nextY = Phaser.Math.Linear(this.startPosition.y, this.targetPosition.y, progress)
            - (Math.sin(progress * Math.PI) * GranadeRobotProjectile.arcHeight);
        const body = this.body as Phaser.Physics.Arcade.Body | null;

        this.setPosition(nextX, nextY);
        body?.reset(nextX, nextY);

        if (progress >= 1)
        {
            this.destroy();
        }
    }
}
