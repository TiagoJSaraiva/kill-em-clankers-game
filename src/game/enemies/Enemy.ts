import Phaser from "phaser";
import { Player } from "../player/Player";
import { Attributes } from "./types";

/**
 * Classe base de inimigo, estendida por unidades especificas.
 *
 * Fornece vida, dano, movimentacao em direcao a alvos, dano por contato e
 * imunidade temporaria apos receber dano.
 */
export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
    private static readonly contactDamageCooldown = 1000;
    private static readonly DefaultStopMovingMomentum = 0; // Por enquanto 0 pois pode haver unidades que não querem momentum
    private readonly immunityTimeAfterDamage = 400;
    private immune: boolean = false;
    private immunityTimer: Phaser.Time.TimerEvent | null = null;

    healthPoints: number = 0;
    moveSpeed: number = 0;
    damage: number = 0;
    scoreValue: number = 0;

    attackingTarget: Player | null = null;
    movingTarget: Player | Phaser.Math.Vector2 | null = null;
    
    private nextContactDamageAt: number = 0;

    /**
     * @param scene Cena onde o inimigo sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param texture Chave da textura ou spritesheet do corpo.
     * @param target Jogador usado como alvo inicial de ataque e movimento.
     */
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Player | null = null) {
        super(scene, x, y, texture);
        this.attackingTarget = target;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
    }

    /**
     * Ponto de extensao para a IA das subclasses.
     */
    update(_time: number, _delta: number): void {
        return;
    }

    /**
     * Aplica os atributos derivados da variacao do inimigo.
     *
     * @param attributes Vida, dano, velocidade e pontuacao do inimigo.
     */
    init(attributes: Attributes): void {
        this.healthPoints = attributes.healthPoints;
        this.moveSpeed = attributes.moveSpeed;
        this.damage = attributes.damage;
        this.scoreValue = attributes.scoreValue
    }

    /**
     * Ponto de extensao para o ataque especifico de cada inimigo.
     */
    attack(): void {
        return;
    }

    /**
     * Aplica dano respeitando a janela de imunidade.
     *
     * @param amount Quantidade de vida removida.
     * @returns Pontuacao ao morrer, `0` se sobreviver ou `false` se imune.
     */
    takeDamage(amount: number): number | boolean {
        if (this.immune) {
            return false;
        }

        if (!this.active) {
            return 0;
        }

        this.immune = true;

        this.immunityTimer = this.scene.time.delayedCall(
            this.immunityTimeAfterDamage,
            () => {
                this.immune = false;
                this.immunityTimer = null;
            }
        );

        this.healthPoints -= amount;

        if (this.healthPoints <= 0) {
            this.destroy();
            return this.scoreValue;
        }

        return 0;
    }

    /**
     * Aplica dano de contato no jogador respeitando cooldown.
     */
    tryContactDamage(target: Player, time: number): void {
        if (time < this.nextContactDamageAt) {
            return;
        }

        target.takeDamage(this.damage);
        this.nextContactDamageAt = time + Enemy.contactDamageCooldown;
    }

    /**
     * Move o inimigo em linha reta na direcao do alvo informado.
     */
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

    /**
     * Reduz a velocidade atual usando momentum opcional.
     */
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

    /**
     * Ponto de extensao para inimigos que precisarem de movimento aleatorio.
     */
    moveRandomly(): void {
        return 
    }

    /**
     * Aplica fator de momentum a uma componente de velocidade.
     */
    protected applyMomentum (velocity: number, momentum: number) : number
    {
        const nextVelocity = velocity * momentum;

        return Math.abs(nextVelocity) < 5 ? 0 : nextVelocity;
    }

    /**
     * Espelha visualmente o inimigo para encarar o alvo.
     */
    faceTarget(target: Player | Phaser.Math.Vector2): void {
        const nextScaleX = target.x < this.x
            ? -Math.abs(this.scaleX || 1)
            : Math.abs(this.scaleX || 1);

        this.setScale(nextScaleX, this.scaleY);
    }

    /**
     * Remove timers internos antes de destruir o sprite.
     */
    destroy(fromScene?: boolean): void {
        this.immunityTimer?.remove(false);
        this.immunityTimer = null;

        this.stopMoving();
        super.destroy(fromScene);
    }
}
