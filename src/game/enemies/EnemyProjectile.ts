import Phaser from "phaser";

export class EnemyProjectile extends Phaser.Physics.Arcade.Sprite
{
    private static readonly offscreenMargin = 400;

    readonly damage: number;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, damage: number)
    {
        super(scene, x, y, texture);
        this.damage = damage;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update(_time: number, _delta: number): void
    {
        this.destroyIfOutOfBounds();
    }

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
