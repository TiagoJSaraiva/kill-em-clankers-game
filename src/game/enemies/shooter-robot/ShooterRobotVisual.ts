import Phaser from 'phaser';

export default class ShooterRobotVisual
{
    private static readonly cloakTextureKey = 'shooter-robot-cloak';
    private static readonly armTextureKey = 'shooter-robot-arm';
    private static readonly shootVfxTextureKey = 'shooter-robot-shoot-vfx';
    private static readonly rearDepthOffset = -0.1;
    private static readonly shootVfxDepthOffset = 0.1;
    private static readonly shootVfxOffsetX = -160;
    private static readonly shootVfxOffsetY = -50;
    private static readonly shootVfxDuration = 90;

    private readonly scene: Phaser.Scene;
    private readonly rearParts: Phaser.GameObjects.Container;
    private readonly cloakImage: Phaser.GameObjects.Image;
    private readonly armImage: Phaser.GameObjects.Image;
    private readonly shootVfxImage: Phaser.GameObjects.Image;

    constructor (scene: Phaser.Scene, robot: Phaser.GameObjects.Sprite)
    {
        this.scene = scene;
        this.rearParts = scene.add.container(robot.x, robot.y);

        this.cloakImage = scene.add.image(0, 0, ShooterRobotVisual.cloakTextureKey);
        this.armImage = scene.add.image(0, 0, ShooterRobotVisual.armTextureKey);
        this.rearParts.add([this.cloakImage, this.armImage]);
        this.rearParts.setSize(this.cloakImage.width, this.cloakImage.height);

        this.shootVfxImage = scene.add.image(0, 0, ShooterRobotVisual.shootVfxTextureKey);
        this.shootVfxImage.setOrigin(1, 0.5);
        this.shootVfxImage.setVisible(false);

        this.syncWithRobot(robot);
    }

    public syncWithRobot (robot: Phaser.GameObjects.Sprite) : void
    {
        this.rearParts.setPosition(robot.x, robot.y);
        this.rearParts.setScale(robot.scaleX, robot.scaleY);
        this.rearParts.setDepth(robot.depth + ShooterRobotVisual.rearDepthOffset);
        this.rearParts.setVisible(robot.visible);
        this.rearParts.setAlpha(robot.alpha);

        this.shootVfxImage.setPosition(
            robot.x + (ShooterRobotVisual.shootVfxOffsetX * robot.scaleX),
            robot.y + (ShooterRobotVisual.shootVfxOffsetY * robot.scaleY)
        );
        this.shootVfxImage.setScale(robot.scaleX, robot.scaleY);
        this.shootVfxImage.setDepth(robot.depth + ShooterRobotVisual.shootVfxDepthOffset);

        if (!this.shootVfxImage.visible)
        {
            this.shootVfxImage.setAlpha(robot.alpha);
        }
    }

    public playShootVfx () : void
    {
        this.scene.tweens.killTweensOf(this.shootVfxImage);
        this.shootVfxImage.setVisible(true);
        this.shootVfxImage.setAlpha(this.rearParts.alpha);

        this.scene.tweens.add({
            targets: this.shootVfxImage,
            alpha: 0,
            duration: ShooterRobotVisual.shootVfxDuration,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.shootVfxImage.setVisible(false);
                this.shootVfxImage.setAlpha(this.rearParts.alpha);
            }
        });
    }

    public destroy () : void
    {
        this.scene.tweens.killTweensOf(this.shootVfxImage);
        this.rearParts.destroy();
        this.shootVfxImage.destroy();
    }
}
