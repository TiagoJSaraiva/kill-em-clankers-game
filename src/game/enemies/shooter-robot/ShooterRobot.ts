import { Player } from "../../player/Player";
import Enemy from "../Enemy";
import { EnemyProjectile } from "../EnemyProjectile";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import ShooterRobotProjectile from "./ShooterRobotProjectile";
import ShooterRobotVisual from "./ShooterRobotVisual";

type EnemyProjectileScene = Phaser.Scene & {
    registerEnemyProjectile?: (projectile: EnemyProjectile) => void;
};

const enemyVariations = [
    enemyVariation("normal", "shooter-robot-body", 40, 30, 120),
    enemyVariation("strong", "shooter-robot-body", 40, 30, 120),
    enemyVariation("impossible", "shooter-robot-body", 40, 30, 120),
] as EnemyVariation[];

export default class ShooterRobot extends Enemy
{
    static readonly scale = 0.8;

    private static readonly attackRange = 700;
    private static readonly attackCooldown = 1500;
    private static readonly projectileSpeed = 500;

    private visual: ShooterRobotVisual;
    private nextAttackAt: number = 0;

    constructor (scene: Phaser.Scene, x: number, y: number, variation: VariationName, target: Player | null = null)
    {
        const texture: string = getTexture(variation, enemyVariations);
        const attributes: Attributes = getAttributes(variation, enemyVariations);

        super(scene, x, y, texture, target);

        this.setScale(ShooterRobot.scale);
        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.damage);
        this.visual = new ShooterRobotVisual(scene, this);
    }

    update(time: number, _delta: number): void {
        this.resolveAi(time);
    }

    preUpdate (time: number, delta: number) : void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    resolveAi(time: number): void {
        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.stopMoving();
            return;
        }

        this.faceTarget(target);

        const distanceToTarget = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );

        if (distanceToTarget > ShooterRobot.attackRange)
        {
            this.moveToward(target);
            return;
        }

        this.stopMoving();

        if (time >= this.nextAttackAt)
        {
            this.attack();
            this.nextAttackAt = time + ShooterRobot.attackCooldown;
        }
    }

    attack () : void
    {
        this.visual.playShootVfx();
        this.shoot();
    }

    shoot() : void
    {
        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            return;
        }

        const velocity = new Phaser.Math.Vector2(
            target.x - this.x,
            target.y - this.y
        );

        if (velocity.lengthSq() === 0)
        {
            return;
        }

        velocity.normalize().scale(ShooterRobot.projectileSpeed);

        const projectile = new ShooterRobotProjectile(this.scene, this.x, this.y, this.damage, velocity);
        (this.scene as EnemyProjectileScene).registerEnemyProjectile?.(projectile);
    }

    playShootVfx () : void
    {
        this.visual.playShootVfx();
    }

    destroy (fromScene?: boolean) : void
    {
        this.visual.destroy();
        super.destroy(fromScene);
    }
}
