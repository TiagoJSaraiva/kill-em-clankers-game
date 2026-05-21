import Enemy from "../Enemy";
import { createEnemyLevels, getTexture, getAttributes } from "../helpers";

const EnemyLevels = [
    createEnemyLevels("normal", 40, 30, 20, "EyeEnemy"),
    createEnemyLevels("strong", 40, 30, 20, "EyeEnemy_Strong"),
    createEnemyLevels("impossible", 40, 30, 20, "EyeEnemy_Impossible"),
]

export default class EyeEnemy extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, level: string) {
        let texture: string = getTexture(level, EnemyLevels);
        let attributes = getAttributes(level, EnemyLevels);

        super(scene, x, y, texture);

        this.init(attributes.healthPoints, attributes.moveSpeed, attributes.collisionDamage);
    }
}