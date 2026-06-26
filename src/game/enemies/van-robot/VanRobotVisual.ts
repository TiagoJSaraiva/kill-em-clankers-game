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
    private static readonly muzzleOffsetX = -98;
    private static readonly muzzleOffsetY = -6;

    private readonly scene: Phaser.Scene;
    private readonly armImage: Phaser.GameObjects.Image;
    private readonly shootVfxImage: Phaser.GameObjects.Image;
    private robotDepth: number = 0;
    private armBaseX: number = 0;
    private armBaseY: number = 0;
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
        this.armImage.setRotation(0);

        this.shootVfxImage = scene.add.image(0, 0, VanRobotVisual.shootVfxTextureKey);
        this.shootVfxImage.setOrigin(1, 0.5);
        this.shootVfxImage.setVisible(false);

        this.syncWithRobot(robot);
    }

    public syncWithRobot (robot: Phaser.GameObjects.Sprite) : void
    {
        const visualScaleX = Math.abs(robot.scaleX || 1);
        this.robotDepth = robot.depth;

        this.armBaseX = robot.x;
        this.armBaseY = robot.y;

        this.syncArmPosition();
        this.armImage.setScale(visualScaleX, robot.scaleY);
        this.armImage.setDepth(this.robotDepth + VanRobotVisual.armDepthOffset);
        this.armImage.setVisible(robot.visible);
        this.armImage.setAlpha(robot.alpha);

        this.syncShootVfxWithMuzzle(robot.alpha);
    }

    public getMuzzleWorldPosition () : Phaser.Math.Vector2
    {
        const rotation = this.armImage.rotation;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const scaledMuzzleOffsetX = VanRobotVisual.muzzleOffsetX * this.armImage.scaleX;
        const scaledMuzzleOffsetY = VanRobotVisual.muzzleOffsetY * this.armImage.scaleY;
        const muzzleX = this.armImage.x
            + (scaledMuzzleOffsetX * cos)
            - (scaledMuzzleOffsetY * sin);
        const muzzleY = this.armImage.y
            + (scaledMuzzleOffsetX * sin)
            + (scaledMuzzleOffsetY * cos);

        return new Phaser.Math.Vector2(muzzleX, muzzleY);
    }

    public playShootVfx () : void
    {
        this.syncShootVfxWithMuzzle(this.armImage.alpha);
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
        this.syncShootVfxWithMuzzle(this.armImage.alpha);

        this.scene.tweens.add({
            targets: this,
            armRecoilOffsetX: 0,
            duration: VanRobotVisual.armRecoilReturnDuration,
            ease: 'Quad.easeOut',
            onUpdate: () => {
                this.syncArmPosition();
                this.syncShootVfxWithMuzzle(this.armImage.alpha);
            }
        });
    }

    private syncArmPosition () : void
    {
        this.armImage.setPosition(
            this.armBaseX + this.armRecoilOffsetX,
            this.armBaseY
        );
    }

    private syncShootVfxWithMuzzle (alpha: number) : void
    {
        const muzzlePosition = this.getMuzzleWorldPosition();

        this.shootVfxImage.setPosition(muzzlePosition.x, muzzlePosition.y);
        this.shootVfxImage.setScale(this.armImage.scaleX, this.armImage.scaleY);
        this.shootVfxImage.setRotation(this.armImage.rotation);
        this.shootVfxImage.setDepth(this.robotDepth + VanRobotVisual.shootVfxDepthOffset);

        if (!this.shootVfxImage.visible)
        {
            this.shootVfxImage.setAlpha(alpha);
        }
    }
}
