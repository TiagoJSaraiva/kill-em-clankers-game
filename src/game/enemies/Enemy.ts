import Phaser from "phaser";
import { Player } from "../player/Player";

// Classe base de Inimigo, que pode ser estendida para criar diferentes tipos de inimigos

export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
    health: number;
    speed: number;
    damage: number;
    updateListener: Function;

    attackingTarget: Player | null = null;
    movingTarget: Player | Phaser.Math.Vector2 | null = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Player | null = null) {
        super(scene, x, y, texture);
        this.attackingTarget = target;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.updateListener = () => this.update();
        this.scene.events.on('update', this.updateListener);
    }

    update() {
        return;
    }

    init(_health: number, _speed: number, _damage: number) {
        this.health = _health;
        this.speed = _speed;
        this.damage = _damage;
    }

    attack(): void {
        return; // Método de ataque genérico, pode ser sobrescrito por inimigos específicos para implementar ataques únicos
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            // Animação de morte pode ser adicionada aqui, mas nos filhos, já que cada um vai ter animação diferente
            this.scene.events.off('update', this.updateListener);
            this.destroy();
        }
    }

    move(target: Player | Phaser.Math.Vector2): void {
        const direction = new Phaser.Math.Vector2(
            target instanceof Player ? target.x - this.x : target.x - this.x,
            target instanceof Player ? target.y - this.y : target.y - this.y
        );

        if (direction.lengthSq() > 0) {
            direction.normalize().scale(this.speed);
            this.setVelocity(direction.x, direction.y);
        }
    } 
}
