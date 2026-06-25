import Phaser from "phaser";

export default abstract class Projectile extends Phaser.Physics.Arcade.Sprite
{
    private static readonly offscreenMargin = 400;

    readonly damage: number;
    readonly penetration: number;

    penetrationLeft: number;

    private readonly initialVelocity: Phaser.Math.Vector2;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number, velocity: Phaser.Math.Vector2)
    {
        super(scene, x, y, texture);
        this.damage = damage;
        this.initialVelocity = velocity.clone();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.applyInitialVelocity();
        this.penetrationLeft = this.penetration;
    }

    update(_time: number, _delta: number): void
    {
        this.applyInitialVelocity();
        this.destroyIfOutOfBounds();
    }

    protected applyInitialVelocity(): void
    {
        this.setVelocity(this.initialVelocity.x, this.initialVelocity.y);
    }

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
