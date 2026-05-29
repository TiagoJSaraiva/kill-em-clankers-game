import Phaser from "phaser";

// Classe base de Inimigo, que pode ser estendida para criar diferentes tipos de inimigos

export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
    health: number;
    speed: number;
    damage: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(_health: number, _speed: number, _damage: number) {
        this.health = _health;
        this.speed = _speed;
        this.damage = _damage;
    }

    move(target: Phaser.GameObjects.Sprite): void {
        const direction = new Phaser.Math.Vector2(
            target.x - this.x,
            target.y - this.y
        );

        if (direction.lengthSq() > 0) {
            direction.normalize().scale(this.speed);
            this.setVelocity(direction.x, direction.y);
        }
    } 
}
