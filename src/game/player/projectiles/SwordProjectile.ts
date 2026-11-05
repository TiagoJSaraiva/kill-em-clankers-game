import Projectile from "./Projectile";
import Phaser from "phaser";

/**
 * Corte projetado pela espada.
 *
 * Usa animacao propria, vida curta e alta penetracao para atingir
 * varios inimigos proximos em sequencia.
 */
export default class SwordProjectile extends Projectile
{
    private static readonly animationKey = 'slash-projectile-animation';
    private static readonly speed = 1500;
    private static readonly penetration = 5;

    private readonly lifespan: number = 400; // Duracao do corte, em ms
    private age: number = 0;

    /**
     * @param scene Cena onde o corte sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     * @param texture Chave do spritesheet do corte.
     * @param damage Dano aplicado por acerto.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(SwordProjectile.speed, 0), SwordProjectile.penetration);
        this.setFlipX(false);

        this.createAnimation(texture);
        this.play(SwordProjectile.animationKey);
    }

    /**
     * Atualiza movimento base e encerra o corte apos sua vida util.
     */
    update(time: number, delta: number): void
    {
        super.update(time, delta);

        if (!this.active)
        {
            return;
        }

        this.processLifespan(delta);
    }

    /**
     * Conta o tempo ativo e destroi o corte ao atingir o limite.
     */
    private processLifespan(delta: number): void
    {
        this.age += delta;
        if (this.age >= this.lifespan)
        {
            this.destroy();
        }
    }

    /**
     * Cria a animacao compartilhada do corte se ela ainda nao existir.
     */
    private createAnimation(texture: string): void
    {
        if (this.scene.anims.exists(SwordProjectile.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: SwordProjectile.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
    }
}
