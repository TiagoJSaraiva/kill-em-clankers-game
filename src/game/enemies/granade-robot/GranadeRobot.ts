import { Player } from "../../player/Player";
import Enemy from "../Enemy";
import { EnemyProjectile } from "../EnemyProjectile";
import { enemyVariation, getAttributes, getTexture } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import GranadeRobotProjectile from "./GranadeRobotProjectile";
import GranadeRobotVisual from "./GranadeRobotVisual";

type EnemyProjectileScene = Phaser.Scene & {
    registerEnemyProjectile?: (projectile: EnemyProjectile) => void;
};

type GranadeRobotState = 'approaching' | 'exiting';

const enemyVariations = [
    enemyVariation("normal", "granade-robot-body", 60, 35, 360, 150),
    enemyVariation("strong", "granade-robot-body", 90, 45, 390, 250),
    enemyVariation("impossible", "granade-robot-body", 130, 60, 430, 350),
] as EnemyVariation[];

export class GranadeRobot extends Enemy
{
    static readonly scale = 0.8;

    private static readonly animationKey = 'granade-robot-body-animation';
    private static readonly attackPositionOffsetX = 650;
    private static readonly attackPositionOffsetY = -120;
    private static readonly minAttackX = 900;
    private static readonly maxAttackX = 1650;
    private static readonly minAttackY = 140;
    private static readonly maxAttackY = 940;
    private static readonly arrivalDistance = 32;
    private static readonly exitOffsetX = 280;

    private readonly visual: GranadeRobotVisual;
    private state: GranadeRobotState = 'approaching';
    private grenadeThrown: boolean = false;

    constructor (scene: Phaser.Scene, x: number, y: number, variation: VariationName, target: Player | null = null)
    {
        const texture: string = getTexture(variation, enemyVariations);
        super(scene, x, y, texture, target);
        this.createAnimation(texture);
        this.play(GranadeRobot.animationKey);

        this.keepFacingLeft();
        const attributes: Attributes = getAttributes(variation, enemyVariations);
        this.init(attributes);
        this.visual = new GranadeRobotVisual(scene, this);
    }

    update(_time: number, delta: number): void
    {
        this.keepFacingLeft();
        this.resolveAi(delta);
    }

    preUpdate (time: number, delta: number): void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    attack (): void
    {
        if (this.grenadeThrown)
        {
            return;
        }

        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.startExit();
            return;
        }

        const throwOrigin = this.visual.getThrowOriginWorldPosition();
        const targetPosition = new Phaser.Math.Vector2(target.x, target.y);
        const projectile = new GranadeRobotProjectile(
            this.scene,
            throwOrigin.x,
            throwOrigin.y,
            this.damage,
            targetPosition
        );

        (this.scene as EnemyProjectileScene).registerEnemyProjectile?.(projectile);
        this.grenadeThrown = true;
        this.visual.setGrenadeThrown();
        this.startExit();
    }

    destroy (fromScene?: boolean): void
    {
        this.visual.destroy();
        super.destroy(fromScene);
    }

    private resolveAi(delta: number): void
    {
        if (this.state === 'exiting')
        {
            this.exitScene();
            return;
        }

        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.startExit();
            return;
        }

        const attackPosition = this.getAttackPosition(target);
        const distanceToAttackPosition = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            attackPosition.x,
            attackPosition.y
        );
        const maxFrameTravel = this.moveSpeed * (delta / 1000);

        if (distanceToAttackPosition <= GranadeRobot.arrivalDistance + maxFrameTravel)
        {
            this.setPosition(attackPosition.x, attackPosition.y);
            this.stopMoving();
            this.visual.syncWithRobot(this);
            this.attack();
            return;
        }

        this.moveToward(attackPosition);
    }

    private getAttackPosition(target: Player): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(
            Phaser.Math.Clamp(
                target.x + GranadeRobot.attackPositionOffsetX,
                GranadeRobot.minAttackX,
                GranadeRobot.maxAttackX
            ),
            Phaser.Math.Clamp(
                target.y + GranadeRobot.attackPositionOffsetY,
                GranadeRobot.minAttackY,
                GranadeRobot.maxAttackY
            )
        );
    }

    private startExit(): void
    {
        this.state = 'exiting';
        this.keepFacingLeft();
    }

    private exitScene(): void
    {
        const exitX = this.scene.scale.width + GranadeRobot.exitOffsetX;

        if (this.x >= exitX)
        {
            this.destroy();
            return;
        }

        this.setVelocity(this.moveSpeed, 0);
    }

    private keepFacingLeft(): void
    {
        this.setScale(GranadeRobot.scale, GranadeRobot.scale);
        this.setFlipX(false);
    }

    private createAnimation(texture: string): void
    {
        if (this.scene.anims.exists(GranadeRobot.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: GranadeRobot.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }
}
