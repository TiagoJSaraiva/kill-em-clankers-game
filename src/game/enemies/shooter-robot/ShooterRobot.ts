import { Player } from "../../player/Player";
import Enemy from "../Enemy";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import ShooterRobotVisual from "./ShooterRobotVisual";

const enemyVariations = [
    enemyVariation("normal", "shooter-robot-body", 40, 30, 20),
    enemyVariation("strong", "shooter-robot-body", 40, 30, 20),
    enemyVariation("impossible", "shooter-robot-body", 40, 30, 20),
] as EnemyVariation[];

export default class ShooterRobot extends Enemy
{
    private visual: ShooterRobotVisual;

    constructor (scene: Phaser.Scene, x: number, y: number, variation: VariationName)
    {
        const texture: string = getTexture(variation, enemyVariations);
        const attributes: Attributes = getAttributes(variation, enemyVariations);

        super(scene, x, y, texture);

        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.damage);
        this.visual = new ShooterRobotVisual(scene, this);
    }

    preUpdate (time: number, delta: number) : void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    resolveAi() {
        
    }

    attack (target: Player) : void
    {
        console.log('Shooter Robot shoots at the player!');
        this.visual.playShootVfx();
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
