import { Player } from "../../player/Player";
import Enemy from "../Enemy";
import { EnemyProjectile } from "../EnemyProjectile";
import { enemyVariation, getAttributes, getTexture } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import GranadeRobotProjectile from "./GranadeRobotProjectile";
import GranadeRobotVisual from "./GranadeRobotVisual";

/**
 * Cena que pode receber projeteis disparados por inimigos.
 */
type EnemyProjectileScene = Phaser.Scene & {
    registerEnemyProjectile?: (projectile: EnemyProjectile) => void;
};

/**
 * Estados de IA do grenadeiro.
 */
type GranadeRobotState = 'approaching' | 'exiting';

/**
 * Catalogo de variacoes do GranadeRobot.
 */
const enemyVariations = [
    enemyVariation("normal", "granade-robot-body", 40, 35, 230, 150),
    enemyVariation("strong", "granade-robot-body", 60, 45, 390, 250),
    enemyVariation("impossible", "granade-robot-body", 100, 60, 430, 350),
] as EnemyVariation[];

/**
 * Inimigo que entra em cena, escolhe uma posicao de arremesso, joga uma
 * granada contra o jogador e sai pela direita.
 */
export class GranadeRobot extends Enemy
{
    static readonly scale = 0.8;

    private static readonly animationKey = 'granade-robot-body-animation';
    private static readonly attackPositionOffsetX = 650;
    private static readonly attackPositionOffsetY = -120;
    private static readonly minAttackX = 900;
    private static readonly maxAttackX = 1650;
    private static readonly minAttackY = 140;
    private static readonly maxAttackY = 940;
    private static readonly arrivalDistance = 32;
    private static readonly exitOffsetX = 280;

    private readonly visual: GranadeRobotVisual;
    state: GranadeRobotState = 'approaching';
    private grenadeThrown: boolean = false;

    /**
     * @param scene Cena onde o inimigo sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param variation Variante de atributos e textura.
     * @param target Jogador usado para calcular a posicao de arremesso.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, variation: VariationName, target: Player | null = null)
    {
        const texture: string = getTexture(variation, enemyVariations);
        super(scene, x, y, texture, target);
        this.createAnimation(texture);
        this.play(GranadeRobot.animationKey);

        this.keepFacingLeft();
        const attributes: Attributes = getAttributes(variation, enemyVariations);
        this.init(attributes);
        this.visual = new GranadeRobotVisual(scene, this);
    }

    /**
     * Atualiza orientacao e comportamento de aproximacao/saida.
     */
    update(_time: number, delta: number): void
    {
        this.keepFacingLeft();
        this.resolveAi(delta);
    }

    /**
     * Mantem o braco sincronizado com o corpo animado.
     */
    preUpdate (time: number, delta: number): void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    /**
     * Arremessa uma granada uma unica vez e inicia a saida de cena.
     */
    attack (): void
    {
        if (this.grenadeThrown)
        {
            return;
        }

        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.startExit();
            return;
        }

        const throwOrigin = this.visual.getThrowOriginWorldPosition();
        const targetPosition = new Phaser.Math.Vector2(target.x, target.y);
        const projectile = new GranadeRobotProjectile(
            this.scene,
            throwOrigin.x,
            throwOrigin.y,
            this.damage,
            targetPosition
        );

        (this.scene as EnemyProjectileScene).registerEnemyProjectile?.(projectile);
        this.grenadeThrown = true;
        this.visual.setGrenadeThrown();
        this.startExit();
    }

    /**
     * Remove o visual auxiliar antes de destruir o corpo principal.
     */
    destroy (fromScene?: boolean): void
    {
        this.visual.destroy();
        super.destroy(fromScene);
    }

    /**
     * Move ate a posicao de arremesso ou continua o fluxo de saida.
     */
    private resolveAi(delta: number): void
    {
        if (this.state === 'exiting')
        {
            this.exitScene();
            return;
        }

        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.startExit();
            return;
        }

        const attackPosition = this.getAttackPosition(target);
        const distanceToAttackPosition = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            attackPosition.x,
            attackPosition.y
        );
        const maxFrameTravel = this.moveSpeed * (delta / 1000);

        if (distanceToAttackPosition <= GranadeRobot.arrivalDistance + maxFrameTravel)
        {
            this.setPosition(attackPosition.x, attackPosition.y);
            this.stopMoving();
            this.visual.syncWithRobot(this);
            this.attack();
            return;
        }

        this.moveToward(attackPosition);
    }

    /**
     * Calcula uma posicao de arremesso proxima ao jogador e limitada a tela.
     */
    private getAttackPosition(target: Player): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(
            Phaser.Math.Clamp(
                target.x + GranadeRobot.attackPositionOffsetX,
                GranadeRobot.minAttackX,
                GranadeRobot.maxAttackX
            ),
            Phaser.Math.Clamp(
                target.y + GranadeRobot.attackPositionOffsetY,
                GranadeRobot.minAttackY,
                GranadeRobot.maxAttackY
            )
        );
    }

    /**
     * Troca o estado para saida e fixa a orientacao visual.
     */
    private startExit(): void
    {
        this.state = 'exiting';
        this.keepFacingLeft();
    }

    /**
     * Move o inimigo para fora da tela e o destroi ao final.
     */
    private exitScene(): void
    {
        const exitX = this.scene.scale.width + GranadeRobot.exitOffsetX;

        if (this.x >= exitX)
        {
            this.destroy();
            return;
        }

        this.setVelocity(this.moveSpeed, 0);
    }

    /**
     * Mantem a escala e orientacao visual padrao do grenadeiro.
     */
    private keepFacingLeft(): void
    {
        this.setScale(GranadeRobot.scale, GranadeRobot.scale);
        this.setFlipX(false);
    }

    /**
     * Registra a animacao do corpo se ela ainda nao existir.
     */
    private createAnimation(texture: string): void
    {
        if (this.scene.anims.exists(GranadeRobot.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: GranadeRobot.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }
}
