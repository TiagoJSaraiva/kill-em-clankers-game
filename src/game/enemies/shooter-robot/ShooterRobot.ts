import Enemy from "../Enemy";
import { createEnemyVariations, getTexture, getAttributes } from "../helpers";

const EnemyVariations = [
    createEnemyVariations("normal",     40, 30, 20, "shooter-robot-normal"),
    createEnemyVariations("strong",     40, 30, 20, "shooter-robot-strong"),
    createEnemyVariations("impossible", 40, 30, 20, "shooter-robot-impossible"),
                                    //  HP, MS, CD
                                    //  HP = Health Points, MS = Move Speed, CD = Collision Damage
]

export default class ShooterRobot extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, variation: string) {
        // Pega a textura correta de acordo com a variação do inimigo. Por exemplo, nesse caso, se a variação for "normal", a textura será "shooter-robot-normal", e assim por diante, com base no array EnemyVariations.
        let texture: string = getTexture(variation, EnemyVariations); 
        let attributes = getAttributes(variation, EnemyVariations);

        super(scene, x, y, texture);

        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.damage);
    }

    enemyAI(player: Phaser.GameObjects.Sprite): void {
        this.move(player);
    }
}