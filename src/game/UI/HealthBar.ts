import Phaser from 'phaser';

import { Player } from '../player/Player';

export class HealthBar extends Phaser.GameObjects.Container
{
    private static readonly barTextureKey = 'health-bar';
    private static readonly fillTextureKey = 'health-bar-fill';
    private static readonly depth = 1000;
    private static readonly fillTextureWidth = 909;
    private static readonly fillStartX = 189;
    private static readonly fillOriginX = HealthBar.fillStartX / HealthBar.fillTextureWidth;
    private static readonly fillX = HealthBar.fillStartX - (HealthBar.fillTextureWidth / 2);

    static readonly scale = 0.3;

    private readonly healthBarImage: Phaser.GameObjects.Image;
    private readonly healthBarFill: Phaser.GameObjects.Image;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);

        this.healthBarFill = scene.add.image(HealthBar.fillX, 0, HealthBar.fillTextureKey);
        this.healthBarFill.setOrigin(HealthBar.fillOriginX, 0.5);

        this.healthBarImage = scene.add.image(0, 0, HealthBar.barTextureKey);

        this.add([this.healthBarFill, this.healthBarImage]);
        this.setSize(this.healthBarImage.displayWidth, this.healthBarImage.displayHeight);
        this.setScale(HealthBar.scale);
        this.setScrollFactor(0);
        this.setDepth(HealthBar.depth);

        scene.add.existing(this);
    }

    public updateFill (player: Player) : void
    {
        const currentHealth = player.currentHealthPoints;
        const maxHealth = player.maxHealthPoints;
        const healthRatio = this.getSafeRatio(currentHealth, maxHealth);

        this.healthBarFill.setScale(healthRatio, 1);
        this.healthBarFill.setVisible(healthRatio > 0);
    }

    private getSafeRatio (current: number, max: number) : number
    {
        if (max <= 0)
        {
            return 0;
        }

        return Phaser.Math.Clamp(current / max, 0, 1);
    }
}
