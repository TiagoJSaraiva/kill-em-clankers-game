import Phaser from "phaser";
import { Player } from "../player/Player";

// Classe base de inimigo, estendida por unidades especificas.
export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
    private static readonly contactDamageCooldown = 1000;

    health: number = 0;
    speed: number = 0;
    damage: number = 0;

    attackingTarget: Player | null = null;
    movingTarget: Player | Phaser.Math.Vector2 | null = null;

    private nextContactDamageAt: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Player | null = null) {
        super(scene, x, y, texture);
        this.attackingTarget = target;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
    }

    update(_time: number, _delta: number): void {
        return;
    }

    init(_health: number, _speed: number, _damage: number): void {
        this.health = _health;
        this.speed = _speed;
        this.damage = _damage;
    }

    attack(): void {
        return;
    }

    takeDamage(amount: number): void {
        if (!this.active) {
            return;
        }

        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    tryContactDamage(target: Player, time: number): void {
        if (time < this.nextContactDamageAt) {
            return;
        }

        target.takeDamage(this.damage);
        this.nextContactDamageAt = time + Enemy.contactDamageCooldown;
    }

    move(target: Player | Phaser.Math.Vector2): void {
        this.moveToward(target);
    }

    moveToward(target: Player | Phaser.Math.Vector2): void {
        const direction = new Phaser.Math.Vector2(
            target.x - this.x,
            target.y - this.y
        );

        if (direction.lengthSq() > 0) {
            direction.normalize().scale(this.speed);
            this.setVelocity(direction.x, direction.y);
            return;
        }

        this.stopMoving();
    }

    stopMoving(): void {
        this.setVelocity(0, 0);
    }

    faceTarget(target: Player | Phaser.Math.Vector2): void {
        const nextScaleX = target.x < this.x
            ? -Math.abs(this.scaleX || 1)
            : Math.abs(this.scaleX || 1);

        this.setScale(nextScaleX, this.scaleY);
    }

    destroy(fromScene?: boolean): void {
        this.stopMoving();
        super.destroy(fromScene);
    }
}
