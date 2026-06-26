import Enemy from "../Enemy";
import { EnemyProjectile } from "../EnemyProjectile";
import { enemyVariation, getTexture, getAttributes } from "../helpers";
import { Attributes, EnemyVariation, VariationName } from "../types";
import VanRobotVisual from "./VanRobotVisual";
import { Player } from "../../player/Player";
import VanRobotProjectile from "./VanRobotProjectile";

/**
 * Cena que pode receber projeteis disparados por inimigos.
 */
type EnemyProjectileScene = Phaser.Scene & {
    registerEnemyProjectile?: (projectile: EnemyProjectile) => void;
};

/**
 * Catalogo de variacoes do VanRobot.
 */
const enemyVariations = [
    enemyVariation("normal", "van-robot-body", 100, 30, 100, 100),
    enemyVariation("strong", "van-robot-body", 100, 30, 100, 200),
    enemyVariation("impossible", "van-robot-body", 100, 30, 100, 300),
] as EnemyVariation[];

/**
 * Inimigo pesado que se aproxima e dispara rajadas horizontais com dispersao.
 */
export class VanRobot extends Enemy {
    static readonly scale = 0.8;
    
    private static readonly animationKey = 'van-robot-body-animation';
    private static readonly momentum = 0.9;
    private static readonly attackRange = 2000;
    private static readonly projectileSpeed = 500;
    private static readonly sprayPauseDuration = 5000;
    private static readonly sprayDuration = 1500;
    private static readonly sprayShotCooldown = 80;
    private static readonly projectileSpreadAngle = Math.PI / 50;
    private static readonly baseProjectileAngle = Math.PI;
    private static readonly shotAudioKey = 'pistol-shot-audio';

    private visual: VanRobotVisual;
    private nextSprayAt: number = 0;
    private sprayEndAt: number = 0;
    private nextShotAt: number = 0;

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
        this.play(VanRobot.animationKey);

        this.keepBodyFacingOriginalDirection();
        const attributes: Attributes = getAttributes(variation, enemyVariations);
        this.init(attributes);
        this.visual = new VanRobotVisual(scene, this);
        this.nextSprayAt = this.scene.time.now + VanRobot.sprayPauseDuration;
    }

    /**
     * Atualiza orientacao e estado de IA da rajada.
     */
    update(time: number, _delta: number): void
    {
        this.keepBodyFacingOriginalDirection();
        this.resolveAi(time);
    }

    /**
     * Mantem o braco e VFX sincronizados com o corpo animado.
     */
    preUpdate (time: number, delta: number) : void
    {
        super.preUpdate(time, delta);
        this.visual.syncWithRobot(this);
    }

    /**
     * Decide quando aproximar, parar ou continuar a rajada.
     */
    resolveAi(time: number): void
    {
        const target = this.attackingTarget;

        if (!target || !target.active)
        {
            this.stopMoving();
            this.cancelActiveSpray(time);
            return;
        }

        this.visual.syncWithRobot(this);

        const distanceToTarget = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );

        if (distanceToTarget > VanRobot.attackRange || this.x > 1900)
        {
            this.moveToward(target);
            this.cancelActiveSpray(time);
            return;
        }

        this.stopMoving(VanRobot.momentum);
        this.updateSprayAttack(time);
    }

    /**
     * Dispara um projetil da rajada e toca o VFX correspondente.
     */
    attack () : void
    {
        this.shoot();
        this.visual.playShootVfx();
    }

    /**
     * Cria um projetil com leve variacao angular para simular spray.
     */
    shoot() : void
    {
        const projectileAngle = VanRobot.baseProjectileAngle + Phaser.Math.FloatBetween(
            -VanRobot.projectileSpreadAngle,
            VanRobot.projectileSpreadAngle
        );
        const velocity = new Phaser.Math.Vector2(
            Math.cos(projectileAngle),
            Math.sin(projectileAngle)
        ).scale(VanRobot.projectileSpeed);
        const shotOrigin = this.visual.getShotOriginWorldPosition();
        const projectile = new VanRobotProjectile(
            this.scene,
            shotOrigin.x,
            shotOrigin.y,
            this.damage,
            velocity
        );

        (this.scene as EnemyProjectileScene).registerEnemyProjectile?.(projectile);
        this.playShotAudio();
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
     * Controla janelas de pausa, duracao da rajada e intervalo entre tiros.
     */
    private updateSprayAttack (time: number) : void
    {
        if (this.sprayEndAt > 0 && time >= this.sprayEndAt)
        {
            this.sprayEndAt = 0;
            this.nextSprayAt = time + VanRobot.sprayPauseDuration;
        }

        if (this.sprayEndAt === 0)
        {
            if (time < this.nextSprayAt)
            {
                return;
            }

            this.sprayEndAt = time + VanRobot.sprayDuration;
            this.nextShotAt = time;
        }

        if (time >= this.nextShotAt)
        {
            this.attack();
            this.nextShotAt = time + VanRobot.sprayShotCooldown;
        }
    }

    /**
     * Cancela uma rajada em andamento quando o alvo sai de condicao valida.
     */
    private cancelActiveSpray (time: number) : void
    {
        if (this.sprayEndAt === 0)
        {
            return;
        }

        this.sprayEndAt = 0;
        this.nextSprayAt = time + VanRobot.sprayPauseDuration;
    }

    /**
     * Mantem o corpo na orientacao original durante a movimentacao.
     */
    private keepBodyFacingOriginalDirection () : void
    {
        this.setScale(VanRobot.scale, VanRobot.scale);
        this.setFlipX(false);
    }

    /**
     * Reproduz o audio de disparo quando carregado.
     */
    private playShotAudio(): void
    {
        if (!this.scene.cache.audio.exists(VanRobot.shotAudioKey))
        {
            return;
        }

        this.scene.sound.play(VanRobot.shotAudioKey);
    }

    /**
     * Registra a animacao do corpo se ela ainda nao existir.
     */
    private createAnimation(texture: string): void {
        if (this.scene.anims.exists(VanRobot.animationKey)) {
            return;
        }

        this.scene.anims.create({
            key: VanRobot.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }
}
