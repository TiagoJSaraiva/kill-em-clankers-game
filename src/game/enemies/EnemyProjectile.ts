import Phaser from "phaser";

/**
 * Classe base para projeteis inimigos.
 *
 * Aplica velocidade fixa, rotaciona o sprite na direcao do disparo e destroi
 * o projetil quando ele sai da tela.
 */
export class EnemyProjectile extends Phaser.Physics.Arcade.Sprite
{
    private static readonly offscreenMargin = 400;

    readonly damage: number;
    private readonly initialVelocity: Phaser.Math.Vector2;

    /**
     * @param scene Cena onde o projetil sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param texture Chave da textura do projetil.
     * @param damage Dano aplicado ao jogador.
     * @param velocity Vetor de velocidade inicial.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number, velocity: Phaser.Math.Vector2)
    {
        super(scene, x, y, texture);
        this.damage = damage;
        this.initialVelocity = velocity.clone();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setFlipX(false);
        this.setRotation(this.initialVelocity.angle());
        this.applyInitialVelocity();
    }

    /**
     * Mantem a velocidade e verifica se o projetil saiu da area util.
     */
    update(_time: number, _delta: number): void
    {
        this.applyInitialVelocity();
        this.destroyIfOutOfBounds();
    }

    /**
     * Reaplica a velocidade original apos interacoes fisicas.
     */
    protected applyInitialVelocity(): void
    {
        this.setVelocity(this.initialVelocity.x, this.initialVelocity.y);
    }

    /**
     * @returns `true` quando o projetil foi destruido por sair da tela.
     */
    protected destroyIfOutOfBounds(): boolean
    {
        const margin = EnemyProjectile.offscreenMargin;
        const { width, height } = this.scene.scale;

        if (this.y < -margin || this.y > height + margin || this.x < -margin || this.x > width + margin)
        {
            this.destroy();
            return true;
        }

        return false;
    }
}
