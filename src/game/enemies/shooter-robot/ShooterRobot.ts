import Enemy from "../Enemy";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";

const enemyVariations = [
    enemyVariation("normal",     "shooter-robot-normal",     40, 30, 20),
    enemyVariation("strong",     "shooter-robot-strong",     40, 30, 20),
    enemyVariation("impossible", "shooter-robot-impossible", 40, 30, 20),
                                    //  HP, MS, CD
                                    //  HP = Health Points, MS = Move Speed, CD = Collision Damage
] as EnemyVariation[]

export default class ShooterRobot extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, variation: VariationName) {
        // Pega a textura correta de acordo com a variação do inimigo. Por exemplo, nesse caso, se a variação for "normal", a textura será "shooter-robot-normal", e assim por diante, com base no array enemyVariations.
        let texture: string = getTexture(variation, enemyVariations); 
        let attributes: Attributes = getAttributes(variation, enemyVariations);

        super(scene, x, y, texture);

        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.damage);
    }

    enemyAI(target: Phaser.GameObjects.Sprite): void {
        this.move(target);
    }
}