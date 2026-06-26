import Phaser from "phaser";

/**
 * Classe base para projeteis disparados pelo jogador.
 *
 * Armazena dano, velocidade inicial e quantidade de inimigos que ainda pode
 * atravessar antes de ser destruido.
 */
export default class Projectile extends Phaser.Physics.Arcade.Sprite
{
    private static readonly offscreenMargin = 400;

    readonly damage: number;
    private readonly initialVelocity: Phaser.Math.Vector2;

    penetrationLeft: number = 0;

    /**
     * @param scene Cena onde o projetil sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param texture Chave da textura do projetil.
     * @param damage Dano causado ao atingir um inimigo.
     * @param velocity Velocidade inicial aplicada a cada update.
     * @param penetration Quantidade inicial de acertos permitidos.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number, velocity: Phaser.Math.Vector2, penetration: number)
    {
        super(scene, x, y, texture);
        this.damage = damage;
        this.initialVelocity = velocity.clone();
        this.penetrationLeft = penetration;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.applyInitialVelocity();
    }

    /**
     * Mantem a velocidade e remove o projetil se ele sair da area util.
     */
    update(_time: number, _delta: number): void
    {
        this.applyInitialVelocity();
        this.destroyIfOutOfBounds();
    }

    /**
     * Reaplica a velocidade inicial para evitar perda por interacoes fisicas.
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
        const margin = Projectile.offscreenMargin;
        const { width, height } = this.scene.scale;

        if (this.y < -margin || this.y > height + margin || this.x < -margin || this.x > width + margin)
        {
            this.destroy();
            return true;
        }

        return false;
    }
}
