import Projectile from "./Projectile";
import Phaser from "phaser";
import Enemy from "../../enemies/Enemy";

/**
 * Projetil do canhao.
 *
 * Ao colidir, pode explodir uma unica vez e aplicar dano reduzido em inimigos
 * proximos ao ponto de impacto.
 */
export default class CannonProjectile extends Projectile
{
    private static readonly animationKey = 'player-cannon-projectile-animation';
    private static readonly explosionTextureKey = 'cannon-explosion';
    private static readonly explosionAnimationKey = 'cannon-explosion-animation';
    private static readonly explosionAudioKey = 'granade-explosion-audio';
    private static readonly speed = 600;
    private static readonly penetration = 1;
    private static readonly explosionRadius = 180;
    private static readonly explosionDamageMultiplier = 0.5;
    private static readonly explosionFrameRate = 18;
    private static readonly fallbackExplosionDuration = 150;

    private hasExploded: boolean = false;

    /**
     * @param scene Cena onde o projetil sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param texture Chave do spritesheet do projetil.
     * @param damage Dano direto do impacto.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(CannonProjectile.speed, 0), CannonProjectile.penetration);
        this.setFlipX(false);

        this.createAnimation(texture);
        this.play(CannonProjectile.animationKey);
    }

    /**
     * Executa a explosao em area e soma pontos gerados por inimigos abatidos.
     *
     * @param enemies Grupo de inimigos ativos na cena.
     * @param excludedEnemy Inimigo ja atingido pelo impacto direto.
     * @returns Pontuacao obtida apenas pelo dano em area.
     */
    public explode(enemies: Phaser.Physics.Arcade.Group, excludedEnemy: Enemy): number
    {
        if (this.hasExploded)
        {
            return 0;
        }

        this.hasExploded = true;
        this.playExplosionEffects();

        let scoreFromExplosion = 0;
        const explosionDamage = this.damage * CannonProjectile.explosionDamageMultiplier;

        for (const child of enemies.getChildren())
        {
            const enemy = child as Enemy;

            if (enemy === excludedEnemy || !enemy.active)
            {
                continue;
            }

            const distanceToEnemy = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                enemy.x,
                enemy.y
            );

            if (distanceToEnemy > CannonProjectile.explosionRadius)
            {
                continue;
            }

            const takeDamageResult = enemy.takeDamage(explosionDamage);

            if (typeof takeDamageResult === 'number')
            {
                scoreFromExplosion += takeDamageResult;
            }
        }

        return scoreFromExplosion;
    }

    /**
     * Registra a animacao do projetil se ela ainda nao existir.
     */
    private createAnimation(texture: string): void
    {
        if (this.scene.anims.exists(CannonProjectile.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: CannonProjectile.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
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
     * Reproduz o som da explosao quando o asset esta carregado.
     */
    private playExplosionAudio(): void
    {
        if (!this.scene.cache.audio.exists(CannonProjectile.explosionAudioKey))
        {
            return;
        }

        this.scene.sound.play(CannonProjectile.explosionAudioKey);
    }

    /**
     * Instancia e remove automaticamente o sprite da explosao.
     */
    private playExplosionVfx(): void
    {
        if (!this.scene.textures.exists(CannonProjectile.explosionTextureKey))
        {
            return;
        }

        const explosion = this.scene.add.sprite(
            this.x,
            this.y,
            CannonProjectile.explosionTextureKey
        );
        const frameNames = this.scene.textures
            .get(CannonProjectile.explosionTextureKey)
            .getFrameNames(false);

        explosion.setDepth(this.depth + 1);

        if (frameNames.length === 0)
        {
            this.scene.time.delayedCall(
                CannonProjectile.fallbackExplosionDuration,
                () => explosion.destroy()
            );
            return;
        }

        this.createExplosionAnimation(frameNames);
        explosion.play(CannonProjectile.explosionAnimationKey);
        explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            explosion.destroy();
        });
    }

    /**
     * Cria a animacao da explosao a partir dos frames do spritesheet.
     */
    private createExplosionAnimation(frameNames: string[]): void
    {
        if (this.scene.anims.exists(CannonProjectile.explosionAnimationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: CannonProjectile.explosionAnimationKey,
            frames: frameNames.map((frame) => ({
                key: CannonProjectile.explosionTextureKey,
                frame
            })),
            frameRate: CannonProjectile.explosionFrameRate,
            repeat: 0
        });
    }
}
