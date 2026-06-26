import Projectile from "./Projectile";
import Phaser from "phaser";

/**
 * Projetil simples da pistola, rapido e com baixa penetracao.
 */
export default class PistolProjectile extends Projectile
{
    private static readonly speed = 800;
    private static readonly penetration = 1;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture, damage, new Phaser.Math.Vector2(PistolProjectile.speed, 0), PistolProjectile.penetration);
        this.setFlipX(false);
    }
}
