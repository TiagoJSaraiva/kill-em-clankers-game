import Enemy from "../Enemy";
import { createEnemyVariations, getTexture, getAttributes } from "../helpers";

const EnemyVariations = [
    createEnemyVariations("normal",     40, 30, 20, "EyeEnemy"),
    createEnemyVariations("strong",     40, 30, 20, "EyeEnemy_Strong"),
    createEnemyVariations("impossible", 40, 30, 20, "EyeEnemy_Impossible"),
]

export default class EyeEnemy extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, variation: string) {
        let texture: string = getTexture(variation, EnemyVariations);
        let attributes = getAttributes(variation, EnemyVariations);

        super(scene, x, y, texture);

        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.collisionDamage);
    }

    enemyAI(player: Phaser.GameObjects.Sprite): void {
        this.move(player);
    }
}