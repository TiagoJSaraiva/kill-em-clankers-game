import Enemy from "../Enemy";
import { createEnemyVariations, getTexture, getAttributes } from "../helpers";

const EnemyVariations = [
    createEnemyVariations("normal",     40, 30, 20, "the-eye-normal"),
    createEnemyVariations("strong",     40, 30, 20, "the-eye-strong"),
    createEnemyVariations("impossible", 40, 30, 20, "the-eye-impossible"),
                                    //  HP, MS, CD
                                    //  HP = Health Points, MS = Move Speed, CD = Collision Damage
]

export default class EyeEnemy extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, variation: string) {
        let texture: string = getTexture(variation, EnemyVariations);
        let attributes = getAttributes(variation, EnemyVariations);

        super(scene, x, y, texture);

        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.damage);
    }

    enemyAI(player: Phaser.GameObjects.Sprite): void {
        this.move(player);
    }
}