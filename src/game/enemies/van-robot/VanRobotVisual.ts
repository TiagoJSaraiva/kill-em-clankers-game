import Phaser from 'phaser';

export default class VanRobotVisual
{
    private static readonly armTextureKey = 'van-robot-arm';
    private static readonly shootVfxTextureKey = 'shooter-robot-shoot-vfx';

    private static readonly armDepthOffset = 0.1;
    private static readonly shootVfxDepthOffset = 0.3;
    private static readonly shootVfxDuration = 200;
    private static readonly armRecoilDistance = 12;
    private static readonly armRecoilReturnDuration = 90;

    private static readonly armOriginX = 0.5;
    private static readonly armOriginY = 0.5;
    private static readonly shotOriginOffsetX = -98;
    private static readonly shotOriginOffsetY = -6;

    private readonly scene: Phaser.Scene;
    private readonly armImage: Phaser.GameObjects.Image;
    private readonly shootVfxImage: Phaser.GameObjects.Image;
    private robotDepth: number = 0;
    private bodyX: number = 0;
    private bodyY: number = 0;
    private bodyScaleX: number = 1;
    private bodyScaleY: number = 1;
    private armRecoilOffsetX: number = 0;

    constructor (scene: Phaser.Scene, robot: Phaser.GameObjects.Sprite)
    {
        this.scene = scene;

        this.armImage = scene.add.image(
            0,
            0,
            VanRobotVisual.armTextureKey
        );
        this.armImage.setOrigin(VanRobotVisual.armOriginX, VanRobotVisual.armOriginY);

        this.shootVfxImage = scene.add.image(0, 0, VanRobotVisual.shootVfxTextureKey);
        this.shootVfxImage.setOrigin(1, 0.5);
        this.shootVfxImage.setVisible(false);

        this.syncWithRobot(robot);
    }

    public syncWithRobot (robot: Phaser.GameObjects.Sprite) : void
    {
        const visualScaleX = Math.abs(robot.scaleX || 1);
        this.robotDepth = robot.depth;

        this.bodyX = robot.x;
        this.bodyY = robot.y;
        this.bodyScaleX = visualScaleX;
        this.bodyScaleY = robot.scaleY;

        this.syncArmPosition();
        this.armImage.setScale(this.bodyScaleX, this.bodyScaleY);
        this.armImage.setDepth(this.robotDepth + VanRobotVisual.armDepthOffset);
        this.armImage.setVisible(robot.visible);
        this.armImage.setAlpha(robot.alpha);

        this.syncShootVfxWithShotOrigin(robot.alpha);
    }

    public getShotOriginWorldPosition () : Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(
            this.bodyX + (VanRobotVisual.shotOriginOffsetX * this.bodyScaleX),
            this.bodyY + (VanRobotVisual.shotOriginOffsetY * this.bodyScaleY)
        );
    }

    public playShootVfx () : void
    {
        this.syncShootVfxWithShotOrigin(this.armImage.alpha);
        this.playArmRecoil();
        this.scene.tweens.killTweensOf(this.shootVfxImage);
        this.shootVfxImage.setVisible(true);
        this.shootVfxImage.setAlpha(this.armImage.alpha);

        this.scene.tweens.add({
            targets: this.shootVfxImage,
            alpha: 0,
            duration: VanRobotVisual.shootVfxDuration,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.shootVfxImage.setVisible(false);
                this.shootVfxImage.setAlpha(this.armImage.alpha);
            }
        });
    }

    public destroy () : void
    {
        this.scene.tweens.killTweensOf(this);
        this.scene.tweens.killTweensOf(this.shootVfxImage);
        this.armImage.destroy();
        this.shootVfxImage.destroy();
    }

    private playArmRecoil () : void
    {
        this.scene.tweens.killTweensOf(this);
        this.armRecoilOffsetX = VanRobotVisual.armRecoilDistance;
        this.syncArmPosition();
        this.syncShootVfxWithShotOrigin(this.armImage.alpha);

        this.scene.tweens.add({
            targets: this,
            armRecoilOffsetX: 0,
            duration: VanRobotVisual.armRecoilReturnDuration,
            ease: 'Quad.easeOut',
            onUpdate: () => {
                this.syncArmPosition();
                this.syncShootVfxWithShotOrigin(this.armImage.alpha);
            }
        });
    }

    private syncArmPosition () : void
    {
        this.armImage.setPosition(
            this.bodyX + this.armRecoilOffsetX,
            this.bodyY
        );
    }

    private syncShootVfxWithShotOrigin (alpha: number) : void
    {
        const shotOrigin = this.getShotOriginWorldPosition();

        this.shootVfxImage.setPosition(shotOrigin.x, shotOrigin.y);
        this.shootVfxImage.setScale(this.bodyScaleX, this.bodyScaleY);
        this.shootVfxImage.setDepth(this.robotDepth + VanRobotVisual.shootVfxDepthOffset);

        if (!this.shootVfxImage.visible)
        {
            this.shootVfxImage.setAlpha(alpha);
        }
    }
}
