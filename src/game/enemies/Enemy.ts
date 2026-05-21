import Phaser from "phaser";

// Classe base de Inimigo, que pode ser estendida para criar diferentes tipos de inimigos

export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
    health: number;
    speed: number;
    collisionDamage: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    init(_health: number, _speed: number, _collisionDamage: number) {
        this.health = _health;
        this.speed = _speed;
        this.collisionDamage = _collisionDamage;
    }
}

