import { Player } from "../../player/Player";
import Enemy from "../Enemy";
import { EnemyProjectile } from "../EnemyProjectile";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import ShooterRobotProjectile from "./ShooterRobotProjectile";
import ShooterRobotVisual from "./ShooterRobotVisual";

/**
 * Cena que pode receber projeteis disparados por inimigos.
 */
type EnemyProjectileScene = Phaser.Scene & {
    registerEnemyProjectile?: (projectile: EnemyProjectile) => void;
};

/**
 * Catalogo de variacoes do ShooterRobot.
 */
const enemyVariations = [
    enemyVariation("normal", "shooter-robot-body", 150, 30, 350, 100),
    enemyVariation("strong", "shooter-robot-body", 250, 30, 400, 200),
    enemyVariation("impossible", "shooter-robot-body", 300, 30, 520, 300),
] as EnemyVariation[];

/**
 * Inimigo atirador que se aproxima ate entrar em alcance e entao dispara
 * projeteis mirando no jogador.
 */
export default class ShooterRobot extends Enemy
{
    static readonly scale = 0.8;

    private static readonly animationKey = 'shooter-robot-body-animation';
    private static readonly momentum = 0.99;
    private static readonly attackRange = 2000;
    private static readonly attackCooldown = 1500;
    private static readonly projectileSpeed = 500;
    private static readonly shotAudioKey = 'pistol-shot-audio';

    private visual: ShooterRobotVisual;
    private nextAttackAt: number = 0;

    /**
     * @param scene Cena onde o inimigo sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param variation Variante de atributos e textura.
     * @param target Jogador perseguido e atacado.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, variation: VariationName, target: Player | null = null)
    {
        const texture: string = getTexture(variation, enemyVariations);
        super(scene, x, y, texture, target);
        this.createAnimation(texture);
        this.play(ShooterRobot.animationKey);

        this.keepBodyFacingOriginalDirection();
        const attributes: Attributes = getAttributes(variation, enemyVariations);
        this.init(attributes);
        this.visual = new ShooterRobotVisual(scene, this);
    }

    /**
     * Atualiza orientacao do corpo e estado de IA.
     */
    update(time: number, _delta: number): void {
        this.keepBodyFacingOriginalDirection();
        this.resolveAi(time);
    }

    /**
     * Mantem sprites auxiliares sincronizados com o corpo animado.
     */
    preUpdate (time: number, delta: number) : void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    /**
     * Decide entre aproximar, parar ou atacar de acordo com alcance e cooldown.
     */
    resolveAi(time: number): void {
        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.stopMoving();
            return;
        }

        this.visual.syncWithRobot(this);
        this.visual.aimAt(target.x, target.y);

        const distanceToTarget = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );

        if (distanceToTarget > ShooterRobot.attackRange || this.x > 1900)
        {
            this.moveToward(target);
            return;
        }

        this.stopMoving(ShooterRobot.momentum);

        if (time >= this.nextAttackAt)
        {
            this.attack();
            this.nextAttackAt = time + ShooterRobot.attackCooldown;
        }
    }

    /**
     * Executa VFX de tiro e cria o projetil.
     */
    attack () : void
    {
        this.visual.playShootVfx();
        this.shoot();
    }

    /**
     * Calcula direcao de disparo a partir do cano da arma e registra o projetil.
     */
    shoot() : void
    {
        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            return;
        }

        this.visual.aimAt(target.x, target.y);

        const muzzlePosition = this.visual.getMuzzleWorldPosition();
        const velocity = new Phaser.Math.Vector2(
            target.x - muzzlePosition.x,
            target.y - muzzlePosition.y
        );

        if (velocity.lengthSq() === 0)
        {
            return;
        }

        velocity.normalize().scale(ShooterRobot.projectileSpeed);

        const projectile = new ShooterRobotProjectile(
            this.scene,
            muzzlePosition.x,
            muzzlePosition.y,
            this.damage,
            velocity
        );
        (this.scene as EnemyProjectileScene).registerEnemyProjectile?.(projectile);
        this.playShotAudio();
    }

    /**
     * Expõe o VFX de tiro para chamadas externas quando necessario.
     */
    playShootVfx () : void
    {
        this.visual.playShootVfx();
    }

    /**
     * Remove os sprites auxiliares antes de destruir o corpo principal.
     */
    destroy (fromScene?: boolean) : void
    {
        this.visual.destroy();
        super.destroy(fromScene);
    }

    /**
     * Mantem o corpo na orientacao original enquanto o braco mira separadamente.
     */
    private keepBodyFacingOriginalDirection () : void
    {
        this.setScale(ShooterRobot.scale, ShooterRobot.scale);
        this.setFlipX(false);
    }

    /**
     * Reproduz o som de disparo quando o asset esta disponivel.
     */
    private playShotAudio(): void
    {
        if (!this.scene.cache.audio.exists(ShooterRobot.shotAudioKey))
        {
            return;
        }

        this.scene.sound.play(ShooterRobot.shotAudioKey);
    }

    /**
     * Registra a animacao do corpo do atirador se ela ainda nao existir.
     */
    private createAnimation(texture: string): void {
        if (this.scene.anims.exists(ShooterRobot.animationKey)) {
            return;
        }

        this.scene.anims.create({
            key: ShooterRobot.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }
}
