import Phaser from 'phaser';

/**
 * Camada visual auxiliar do ShooterRobot.
 *
 * Controla capa, braco independente, origem do disparo e VFX de muzzle flash
 * sem misturar esses sprites com o corpo fisico do inimigo.
 */
export default class ShooterRobotVisual
{
    private static readonly cloakTextureKey = 'shooter-robot-cloak';
    private static readonly armTextureKey = 'shooter-robot-arm';
    private static readonly shootVfxTextureKey = 'shooter-robot-shoot-vfx';

    private static readonly armDepthOffset = 0.1;
    private static readonly cloakDepthOffset = 0.2;
    private static readonly shootVfxDepthOffset = 0.3;
    private static readonly shootVfxDuration = 200;

    private static readonly armOriginX = 0.35;
    private static readonly armOriginY = 0.27;
    private static readonly armOffsetX = -64;
    private static readonly armOffsetY = -45;
    private static readonly armBaseAimAngle = Math.PI;
    private static readonly muzzleOffsetX = -98;
    private static readonly muzzleOffsetY = -6;

    private readonly scene: Phaser.Scene;
    private readonly cloakImage: Phaser.GameObjects.Image;
    private readonly armImage: Phaser.GameObjects.Image;
    private readonly shootVfxImage: Phaser.GameObjects.Image;
    private robotDepth: number = 0;

    /**
     * @param scene Cena onde os sprites auxiliares serao criados.
     * @param robot Corpo principal usado como referencia de transformacao.
     */
    constructor (scene: Phaser.Scene, robot: Phaser.GameObjects.Sprite)
    {
        this.scene = scene;

        this.cloakImage = scene.add.image(0, 0, ShooterRobotVisual.cloakTextureKey);
        this.armImage = scene.add.image(
            0,
            0,
            ShooterRobotVisual.armTextureKey
        );
        this.armImage.setOrigin(ShooterRobotVisual.armOriginX, ShooterRobotVisual.armOriginY);

        this.shootVfxImage = scene.add.image(0, 0, ShooterRobotVisual.shootVfxTextureKey);
        this.shootVfxImage.setOrigin(1, 0.5);
        this.shootVfxImage.setVisible(false);

        this.syncWithRobot(robot);
    }

    /**
     * Copia posicao, escala, alpha e profundidade do corpo para os sprites.
     */
    public syncWithRobot (robot: Phaser.GameObjects.Sprite) : void
    {
        const visualScaleX = Math.abs(robot.scaleX || 1);
        this.robotDepth = robot.depth;

        this.cloakImage.setPosition(robot.x, robot.y);
        this.cloakImage.setScale(visualScaleX, robot.scaleY);
        this.cloakImage.setDepth(this.robotDepth + ShooterRobotVisual.cloakDepthOffset);
        this.cloakImage.setVisible(robot.visible);
        this.cloakImage.setAlpha(robot.alpha);

        this.armImage.setPosition(
            robot.x + (ShooterRobotVisual.armOffsetX * visualScaleX),
            robot.y + (ShooterRobotVisual.armOffsetY * robot.scaleY)
        );
        this.armImage.setScale(visualScaleX, robot.scaleY);
        this.armImage.setDepth(this.robotDepth + ShooterRobotVisual.armDepthOffset);
        this.armImage.setVisible(robot.visible);
        this.armImage.setAlpha(robot.alpha);

        this.syncShootVfxWithMuzzle(robot.alpha);
    }

    /**
     * Rotaciona o braco para mirar em uma coordenada de mundo.
     */
    public aimAt (x: number, y: number) : void
    {
        const armOrigin = this.getArmOriginWorldPosition();
        const targetAngle = Phaser.Math.Angle.Between(armOrigin.x, armOrigin.y, x, y);

        this.armImage.setRotation(targetAngle - ShooterRobotVisual.armBaseAimAngle);
        this.syncShootVfxWithMuzzle(this.armImage.alpha);
    }

    /**
     * @returns Coordenada mundial do cano da arma.
     */
    public getMuzzleWorldPosition () : Phaser.Math.Vector2
    {
        const rotation = this.armImage.rotation;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const scaledMuzzleOffsetX = ShooterRobotVisual.muzzleOffsetX * this.armImage.scaleX;
        const scaledMuzzleOffsetY = ShooterRobotVisual.muzzleOffsetY * this.armImage.scaleY;
        const muzzleX = this.armImage.x
            + (scaledMuzzleOffsetX * cos)
            - (scaledMuzzleOffsetY * sin);
        const muzzleY = this.armImage.y
            + (scaledMuzzleOffsetX * sin)
            + (scaledMuzzleOffsetY * cos);

        return new Phaser.Math.Vector2(muzzleX, muzzleY);
    }

    /**
     * Exibe e desvanece rapidamente o VFX de disparo.
     */
    public playShootVfx () : void
    {
        this.syncShootVfxWithMuzzle(this.armImage.alpha);
        this.scene.tweens.killTweensOf(this.shootVfxImage);
        this.shootVfxImage.setVisible(true);
        this.shootVfxImage.setAlpha(this.armImage.alpha);

        this.scene.tweens.add({
            targets: this.shootVfxImage,
            alpha: 0,
            duration: ShooterRobotVisual.shootVfxDuration,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.shootVfxImage.setVisible(false);
                this.shootVfxImage.setAlpha(this.armImage.alpha);
            }
        });
    }

    /**
     * Destroi todos os sprites auxiliares e tweens relacionados.
     */
    public destroy () : void
    {
        this.scene.tweens.killTweensOf(this.shootVfxImage);
        this.cloakImage.destroy();
        this.armImage.destroy();
        this.shootVfxImage.destroy();
    }

    /**
     * @returns Ponto de origem usado para calcular a rotacao do braco.
     */
    private getArmOriginWorldPosition () : Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(this.armImage.x, this.armImage.y);
    }

    /**
     * Mantem o VFX preso ao cano da arma.
     */
    private syncShootVfxWithMuzzle (alpha: number) : void
    {
        const muzzlePosition = this.getMuzzleWorldPosition();

        this.shootVfxImage.setPosition(muzzlePosition.x, muzzlePosition.y);
        this.shootVfxImage.setScale(this.armImage.scaleX, this.armImage.scaleY);
        this.shootVfxImage.setRotation(this.armImage.rotation);
        this.shootVfxImage.setDepth(this.robotDepth + ShooterRobotVisual.shootVfxDepthOffset);

        if (!this.shootVfxImage.visible)
        {
            this.shootVfxImage.setAlpha(alpha);
        }
    }
}
