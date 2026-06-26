import Enemy from "../Enemy";
import { EnemyProjectile } from "../EnemyProjectile";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import VanRobotVisual from "./VanRobotVisual";
import { Player } from "../../player/Player";
import VanRobotProjectile from "./VanRobotProjectile";

type EnemyProjectileScene = Phaser.Scene & {
    registerEnemyProjectile?: (projectile: EnemyProjectile) => void;
};

const enemyVariations = [
    enemyVariation("normal", "van-robot-body", 100, 30, 100, 100),
    enemyVariation("strong", "van-robot-body", 100, 30, 100, 200),
    enemyVariation("impossible", "van-robot-body", 100, 30, 100, 300),
] as EnemyVariation[];

export class VanRobot extends Enemy {
    static readonly scale = 0.8;
    
    private static readonly animationKey = 'van-robot-body-animation';
    private static readonly momentum = 0.9;
    private static readonly attackRange = 2000;
    private static readonly projectileSpeed = 500;
    private static readonly sprayPauseDuration = 5000;
    private static readonly sprayDuration = 1500;
    private static readonly sprayShotCooldown = 80;
    private static readonly projectileSpreadAngle = Math.PI / 50;
    private static readonly baseProjectileAngle = Math.PI;

    private visual: VanRobotVisual;
    private nextSprayAt: number = 0;
    private sprayEndAt: number = 0;
    private nextShotAt: number = 0;

    constructor (scene: Phaser.Scene, x: number, y: number, variation: VariationName, target: Player | null = null)
    {
        const texture: string = getTexture(variation, enemyVariations);
        super(scene, x, y, texture, target);
        this.createAnimation(texture);
        this.play(VanRobot.animationKey);

        this.keepBodyFacingOriginalDirection();
        const attributes: Attributes = getAttributes(variation, enemyVariations);
        this.init(attributes);
        this.visual = new VanRobotVisual(scene, this);
        this.nextSprayAt = this.scene.time.now + VanRobot.sprayPauseDuration;
    }

    update(time: number, _delta: number): void
    {
        this.keepBodyFacingOriginalDirection();
        this.resolveAi(time);
    }

    preUpdate (time: number, delta: number) : void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    resolveAi(time: number): void
    {
        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.stopMoving();
            this.cancelActiveSpray(time);
            return;
        }

        this.visual.syncWithRobot(this);

        const distanceToTarget = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );

        if (distanceToTarget > VanRobot.attackRange || this.x > 1900)
        {
            this.moveToward(target);
            this.cancelActiveSpray(time);
            return;
        }

        this.stopMoving(VanRobot.momentum);
        this.updateSprayAttack(time);
    }

    attack () : void
    {
        this.shoot();
        this.visual.playShootVfx();
    }

    shoot() : void
    {
        const projectileAngle = VanRobot.baseProjectileAngle + Phaser.Math.FloatBetween(
            -VanRobot.projectileSpreadAngle,
            VanRobot.projectileSpreadAngle
        );
        const velocity = new Phaser.Math.Vector2(
            Math.cos(projectileAngle),
            Math.sin(projectileAngle)
        ).scale(VanRobot.projectileSpeed);
        const shotOrigin = this.visual.getShotOriginWorldPosition();
        const projectile = new VanRobotProjectile(
            this.scene,
            shotOrigin.x,
            shotOrigin.y,
            this.damage,
            velocity
        );

        (this.scene as EnemyProjectileScene).registerEnemyProjectile?.(projectile);
    }

    destroy (fromScene?: boolean) : void
    {
        this.visual.destroy();
        super.destroy(fromScene);
    }

    private updateSprayAttack (time: number) : void
    {
        if (this.sprayEndAt > 0 && time >= this.sprayEndAt)
        {
            this.sprayEndAt = 0;
            this.nextSprayAt = time + VanRobot.sprayPauseDuration;
        }

        if (this.sprayEndAt === 0)
        {
            if (time < this.nextSprayAt)
            {
                return;
            }

            this.sprayEndAt = time + VanRobot.sprayDuration;
            this.nextShotAt = time;
        }

        if (time >= this.nextShotAt)
        {
            this.attack();
            this.nextShotAt = time + VanRobot.sprayShotCooldown;
        }
    }

    private cancelActiveSpray (time: number) : void
    {
        if (this.sprayEndAt === 0)
        {
            return;
        }

        this.sprayEndAt = 0;
        this.nextSprayAt = time + VanRobot.sprayPauseDuration;
    }

    private keepBodyFacingOriginalDirection () : void
    {
        this.setScale(VanRobot.scale, VanRobot.scale);
        this.setFlipX(false);
    }

    private createAnimation(texture: string): void {
        if (this.scene.anims.exists(VanRobot.animationKey)) {
            return;
        }

        this.scene.anims.create({
            key: VanRobot.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }
}
