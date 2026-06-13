import { Player } from "../../player/Player";
import Enemy from "../Enemy";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import ShooterRobotProjectile from "./ShooterRobotProjectile";
import ShooterRobotVisual from "./ShooterRobotVisual";

const enemyVariations = [
    enemyVariation("normal", "shooter-robot-body", 40, 30, 20),
    enemyVariation("strong", "shooter-robot-body", 40, 30, 20),
    enemyVariation("impossible", "shooter-robot-body", 40, 30, 20),
] as EnemyVariation[];

export default class ShooterRobot extends Enemy
{
    static readonly scale = 0.8;

    private visual: ShooterRobotVisual;

    constructor (scene: Phaser.Scene, x: number, y: number, variation: VariationName, target: Player | null = null)
    {
        const texture: string = getTexture(variation, enemyVariations);
        const attributes: Attributes = getAttributes(variation, enemyVariations);

        super(scene, x, y, texture, target);

        this.setScale(ShooterRobot.scale);
        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.damage);
        this.visual = new ShooterRobotVisual(scene, this);
    }

    update() {

    }

    preUpdate (time: number, delta: number) : void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    resolveAi() {

    }

    attack () : void
    {
        console.log('Shooter Robot shoots at the player!');
        this.visual.playShootVfx();
    }

    shoot() : void
    {
        const projectile = new ShooterRobotProjectile(this.scene, this.x, this.y);
        projectile.setVelocityX(400 * this.scaleX); // Define a velocidade do projétil para a direita ou esquerda, dependendo da direção do robô
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
