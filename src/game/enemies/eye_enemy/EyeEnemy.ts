import Enemy from "../Enemy";

export default class EyeEnemy extends Enemy {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "eye_enemy");
        this.init(100, 50, 20);
    }
}