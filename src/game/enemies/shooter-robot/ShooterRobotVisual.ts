import Phaser from 'phaser';

export default class ShooterRobotVisual
{
    private static readonly cloakTextureKey = 'shooter-robot-cloak';
    private static readonly armTextureKey = 'shooter-robot-arm';
    private static readonly shootVfxTextureKey = 'shooter-robot-shoot-vfx';

    private static readonly rearDepthOffset = -0.1;
    private static readonly shootVfxDepthOffset = 0.1;
    private static readonly shootVfxDuration = 90;

    private static readonly armOriginX = 0.35;
    private static readonly armOriginY = 0.27;
    private static readonly armOffsetX = -64;
    private static readonly armOffsetY = -45;
    private static readonly armBaseAimAngle = Math.PI;
    private static readonly muzzleOffsetX = -96;
    private static readonly muzzleOffsetY = 0;

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
        this.armImage = scene.add.image(
            ShooterRobotVisual.armOffsetX,
            ShooterRobotVisual.armOffsetY,
            ShooterRobotVisual.armTextureKey
        );
        this.armImage.setOrigin(ShooterRobotVisual.armOriginX, ShooterRobotVisual.armOriginY);
        this.rearParts.add([this.cloakImage, this.armImage]);
        this.rearParts.setSize(this.cloakImage.width, this.cloakImage.height);

        this.shootVfxImage = scene.add.image(0, 0, ShooterRobotVisual.shootVfxTextureKey);
        this.shootVfxImage.setOrigin(1, 0.5);
        this.shootVfxImage.setVisible(false);

        this.syncWithRobot(robot);
    }

    public syncWithRobot (robot: Phaser.GameObjects.Sprite) : void
    {
        const visualScaleX = Math.abs(robot.scaleX || 1);

        this.rearParts.setPosition(robot.x, robot.y);
        this.rearParts.setScale(visualScaleX, robot.scaleY);
        this.rearParts.setDepth(robot.depth + ShooterRobotVisual.rearDepthOffset);
        this.rearParts.setVisible(robot.visible);
        this.rearParts.setAlpha(robot.alpha);

        this.syncShootVfxWithMuzzle(robot.alpha, robot.depth);
    }

    public aimAt (x: number, y: number) : void
    {
        const armOrigin = this.getArmOriginWorldPosition();
        const targetAngle = Phaser.Math.Angle.Between(armOrigin.x, armOrigin.y, x, y);

        this.armImage.setRotation(targetAngle - ShooterRobotVisual.armBaseAimAngle);
        this.syncShootVfxWithMuzzle(this.rearParts.alpha, this.rearParts.depth);
    }

    public getMuzzleWorldPosition () : Phaser.Math.Vector2
    {
        const rotation = this.armImage.rotation;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const localMuzzleX = this.armImage.x
            + (ShooterRobotVisual.muzzleOffsetX * cos)
            - (ShooterRobotVisual.muzzleOffsetY * sin);
        const localMuzzleY = this.armImage.y
            + (ShooterRobotVisual.muzzleOffsetX * sin)
            + (ShooterRobotVisual.muzzleOffsetY * cos);

        return this.localToWorld(localMuzzleX, localMuzzleY);
    }

    public playShootVfx () : void
    {
        this.syncShootVfxWithMuzzle(this.rearParts.alpha, this.rearParts.depth);
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

    private getArmOriginWorldPosition () : Phaser.Math.Vector2
    {
        return this.localToWorld(this.armImage.x, this.armImage.y);
    }

    private localToWorld (x: number, y: number) : Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(
            this.rearParts.x + (x * this.rearParts.scaleX),
            this.rearParts.y + (y * this.rearParts.scaleY)
        );
    }

    private syncShootVfxWithMuzzle (alpha: number, depth: number) : void
    {
        const muzzlePosition = this.getMuzzleWorldPosition();

        this.shootVfxImage.setPosition(muzzlePosition.x, muzzlePosition.y);
        this.shootVfxImage.setScale(this.rearParts.scaleX, this.rearParts.scaleY);
        this.shootVfxImage.setRotation(this.armImage.rotation);
        this.shootVfxImage.setDepth(depth + ShooterRobotVisual.shootVfxDepthOffset);

        if (!this.shootVfxImage.visible)
        {
            this.shootVfxImage.setAlpha(alpha);
        }
    }
}
