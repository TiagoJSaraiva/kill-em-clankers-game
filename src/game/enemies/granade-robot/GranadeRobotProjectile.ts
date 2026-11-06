import { EnemyProjectile } from "../EnemyProjectile";

/**
 * Estados do projetil de granada.
 */
type GranadeRobotProjectileState = 'arc' | 'exploding';

/**
 * Granada arremessada pelo GranadeRobot.
 *
 * Voa em uma unica parabola que passa pela posicao alvo e continua ate sair da
 * tela, e reproduz explosao quando e destruida por colisao.
 */
export default class GranadeRobotProjectile extends EnemyProjectile
{
    private static readonly textureKey = 'granade-robot-projectile';
    private static readonly explosionTextureKey = 'granade-explosion';
    private static readonly explosionAnimationKey = 'granade-explosion';
    private static readonly explosionAudioKey = 'granade-explosion-audio';
    private static readonly arcDuration = 900;
    private static readonly arcHeight = 220;
    private static readonly fallOffscreenMargin = 400;
    private static readonly explosionFrameRate = 18;
    private static readonly fallbackExplosionDuration = 150;

    private readonly startPosition: Phaser.Math.Vector2;
    private readonly targetPosition: Phaser.Math.Vector2;
    private startedAt: number | null = null;
    private flightState: GranadeRobotProjectileState = 'arc';
    private shouldExplodeOnDestroy: boolean = true;

    /**
     * @param scene Cena onde a granada sera criada.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param damage Dano aplicado ao jogador.
     * @param targetPosition Ponto alvo usado no trecho em arco.
     */
    constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        damage: number,
        targetPosition: Phaser.Math.Vector2
    )
    {
        super(scene, x, y, GranadeRobotProjectile.textureKey, damage, new Phaser.Math.Vector2(0, 0));
        this.startPosition = new Phaser.Math.Vector2(x, y);
        this.targetPosition = targetPosition.clone();
    }

    /**
     * Atualiza a etapa atual do movimento da granada.
     */
    update(time: number, _delta: number): void
    {
        if (this.flightState === 'exploding')
        {
            return;
        }

        this.updateArc(time);
    }

    /**
     * Reproduz explosao ao ser destruida por colisao, mas evita explosao na
     * limpeza de cena ou quando sai da tela.
     */
    destroy(fromScene?: boolean): void
    {
        const shouldPlayExplosion = this.shouldExplodeOnDestroy
            && !fromScene
            && this.flightState !== 'exploding'
            && this.active;

        this.shouldExplodeOnDestroy = false;

        if (shouldPlayExplosion)
        {
            this.flightState = 'exploding';
            this.playExplosionEffects();
        }

        super.destroy(fromScene);
    }

    /**
     * Move a granada pela parabola que passa pelo alvo.
     *
     * O progresso nao para em 1: depois do alvo, a mesma curva continua e a
     * queda segue acelerando ate a granada sair da tela.
     */
    private updateArc(time: number): void
    {
        if (this.startedAt === null)
        {
            this.startedAt = time;
        }

        const progress = (time - this.startedAt) / GranadeRobotProjectile.arcDuration;
        const nextX = Phaser.Math.Linear(this.startPosition.x, this.targetPosition.x, progress);
        const nextY = Phaser.Math.Linear(this.startPosition.y, this.targetPosition.y, progress)
            - (4 * progress * (1 - progress) * GranadeRobotProjectile.arcHeight);
        const body = this.body as Phaser.Physics.Arcade.Body | null;

        this.setPosition(nextX, nextY);
        body?.reset(nextX, nextY);

        if (nextY > this.scene.scale.height + GranadeRobotProjectile.fallOffscreenMargin)
        {
            this.destroyWithoutExplosion();
        }
    }

    /**
     * Destroi a granada sem VFX quando ela apenas sai da area util.
     */
    private destroyWithoutExplosion(): void
    {
        this.shouldExplodeOnDestroy = false;
        this.destroy();
    }

    /**
     * Dispara audio e VFX da explosao.
     */
    private playExplosionEffects(): void
    {
        this.playExplosionAudio();
        this.playExplosionVfx();
    }

    /**
     * Reproduz o audio de explosao quando carregado.
     */
    private playExplosionAudio(): void
    {
        if (!this.scene.cache.audio.exists(GranadeRobotProjectile.explosionAudioKey))
        {
            return;
        }

        this.scene.sound.play(GranadeRobotProjectile.explosionAudioKey);
    }

    /**
     * Instancia a animacao visual da explosao e agenda sua limpeza.
     */
    private playExplosionVfx(): void
    {
        if (!this.scene.textures.exists(GranadeRobotProjectile.explosionTextureKey))
        {
            return;
        }

        const explosion = this.scene.add.sprite(
            this.x,
            this.y,
            GranadeRobotProjectile.explosionTextureKey
        );
        const frameNames = this.scene.textures
            .get(GranadeRobotProjectile.explosionTextureKey)
            .getFrameNames(false);

        explosion.setDepth(this.depth + 1);

        if (frameNames.length === 0)
        {
            this.scene.time.delayedCall(
                GranadeRobotProjectile.fallbackExplosionDuration,
                () => explosion.destroy()
            );
            return;
        }

        this.createExplosionAnimation(frameNames);
        explosion.play(GranadeRobotProjectile.explosionAnimationKey);
        explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion.destroy();
        });
    }

    /**
     * Cria a animacao compartilhada da explosao a partir dos frames do asset.
     */
    private createExplosionAnimation(frameNames: string[]): void
    {
        if (this.scene.anims.exists(GranadeRobotProjectile.explosionAnimationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: GranadeRobotProjectile.explosionAnimationKey,
            frames: frameNames.map((frame) => ({
                key: GranadeRobotProjectile.explosionTextureKey,
                frame
            })),
            frameRate: GranadeRobotProjectile.explosionFrameRate,
            repeat: 0
        });
    }
}
