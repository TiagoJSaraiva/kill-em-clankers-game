/**
 * Camada visual auxiliar do GranadeRobot.
 *
 * Controla o braco separado do corpo e troca sua textura depois que a granada
 * foi arremessada.
 */
export default class GranadeRobotVisual
{
    private static readonly armHoldingGrenadeTextureKey = 'granade-robot-arm-holding-granade';
    private static readonly armTextureKey = 'granade-robot-arm';

    private static readonly armDepthOffset = 0.1;
    private static readonly armOriginX = 0.5;
    private static readonly armOriginY = 0.5;
    private static readonly throwOriginOffsetX = -65;
    private static readonly throwOriginOffsetY = -73;

    private readonly armImage: Phaser.GameObjects.Image;
    private bodyX: number = 0;
    private bodyY: number = 0;
    private bodyScaleX: number = 1;
    private bodyScaleY: number = 1;
    private robotDepth: number = 0;
    private grenadeThrown: boolean = false;

    /**
     * @param scene Cena onde o braco sera criado.
     * @param robot Corpo principal usado como referencia.
     */
    constructor (scene: Phaser.Scene, robot: Phaser.GameObjects.Sprite)
    {
        this.armImage = scene.add.image(0, 0, GranadeRobotVisual.armHoldingGrenadeTextureKey);
        this.armImage.setOrigin(GranadeRobotVisual.armOriginX, GranadeRobotVisual.armOriginY);

        this.syncWithRobot(robot);
    }

    /**
     * Copia posicao, escala, alpha e profundidade do corpo para o braco.
     */
    public syncWithRobot (robot: Phaser.GameObjects.Sprite): void
    {
        this.bodyX = robot.x;
        this.bodyY = robot.y;
        this.bodyScaleX = Math.abs(robot.scaleX || 1);
        this.bodyScaleY = robot.scaleY;
        this.robotDepth = robot.depth;

        this.armImage.setPosition(this.bodyX, this.bodyY);
        this.armImage.setScale(this.bodyScaleX, this.bodyScaleY);
        this.armImage.setDepth(this.robotDepth + GranadeRobotVisual.armDepthOffset);
        this.armImage.setVisible(robot.visible);
        this.armImage.setAlpha(robot.alpha);
    }

    /**
     * @returns Coordenada mundial de origem do arremesso.
     */
    public getThrowOriginWorldPosition (): Phaser.Math.Vector2
    {
        return new Phaser.Math.Vector2(
            this.bodyX + (GranadeRobotVisual.throwOriginOffsetX * this.bodyScaleX),
            this.bodyY + (GranadeRobotVisual.throwOriginOffsetY * this.bodyScaleY)
        );
    }

    /**
     * Atualiza o braco para a textura sem granada apos o arremesso.
     */
    public setGrenadeThrown (): void
    {
        if (this.grenadeThrown)
        {
            return;
        }

        this.grenadeThrown = true;
        this.armImage.setTexture(GranadeRobotVisual.armTextureKey);
    }

    /**
     * Destroi o sprite auxiliar do braco.
     */
    public destroy (): void
    {
        this.armImage.destroy();
    }
}
