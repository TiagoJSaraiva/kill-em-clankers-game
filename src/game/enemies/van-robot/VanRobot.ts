import Enemy from "../Enemy";
import { EnemyProjectile } from "../EnemyProjectile";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import VanRobotVisual from "./VanRobotVisual";
import { Player } from "../../player/Player";

type EnemyProjectileScene = Phaser.Scene & {
    registerEnemyProjectile?: (projectile: EnemyProjectile) => void;
};

const enemyVariations = [
    enemyVariation("normal", "van-robot-body", 40, 30, 350, 100),
    enemyVariation("strong", "van-robot-body", 40, 30, 120, 200),
    enemyVariation("impossible", "van-robot-body", 40, 30, 120, 300),
] as EnemyVariation[];

export class VanRobot extends Enemy {

    static readonly scale = 0.8;
    
    private static readonly animationKey = 'shooter-robot-body-animation';
    private static readonly momentum = 0.99;
    private static readonly attackRange = 2000;
    private static readonly attackCooldown = 1500;
    private static readonly projectileSpeed = 500;

    private visual: VanRobotVisual;
    private nextAttackAt: number = 0;

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