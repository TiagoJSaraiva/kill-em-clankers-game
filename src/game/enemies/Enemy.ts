import Phaser from "phaser";
import { Player } from "../player/Player";
import { Attributes } from "./types";

// Classe base de inimigo, estendida por unidades especificas.
export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
    private static readonly contactDamageCooldown = 1000;
    private static readonly DefaultStopMovingMomentum = 0; // Por enquanto 0 pois pode haver unidades que não querem momentum

    healthPoints: number = 0;
    moveSpeed: number = 0;
    damage: number = 0;
    scoreValue: number = 0;

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

    init(attributes: Attributes): void {
        this.healthPoints = attributes.healthPoints;
        this.moveSpeed = attributes.moveSpeed;
        this.damage = attributes.damage;
        this.scoreValue = attributes.scoreValue
    }

    attack(): void {
        return;
    }

    takeDamage(amount: number): number {
        if (!this.active) {
            return 0;
        }

        this.healthPoints -= amount;
        if (this.healthPoints <= 0) {
            this.destroy();
            return this.scoreValue;
        }

        return 0;
    }

    tryContactDamage(target: Player, time: number): void {
        if (time < this.nextContactDamageAt) {
            return;
        }

        target.takeDamage(this.damage);
        this.nextContactDamageAt = time + Enemy.contactDamageCooldown;
    }

    moveToward(target: Player | Phaser.Math.Vector2): void {
        const direction = new Phaser.Math.Vector2(
            target.x - this.x,
            target.y - this.y
        );

        if (direction.lengthSq() > 0) {
            direction.normalize().scale(this.moveSpeed);
            this.setVelocity(direction.x, direction.y);
            return;
        }

        this.stopMoving();
    }

    stopMoving(momentum: number = Enemy.DefaultStopMovingMomentum): void {
        const body = this.body as Phaser.Physics.Arcade.Body | null;

        if (!body) {
            return;
        }

        const clampedMomentum = Phaser.Math.Clamp(momentum, 0, 1);

        this.setVelocity(
            this.applyMomentum(body.velocity.x, clampedMomentum),
            this.applyMomentum(body.velocity.y, clampedMomentum)
        );
    }

    moveRandomly(): void {
        return 
    }

    protected applyMomentum (velocity: number, momentum: number) : number
    {
        const nextVelocity = velocity * momentum;

        return Math.abs(nextVelocity) < 5 ? 0 : nextVelocity;
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
