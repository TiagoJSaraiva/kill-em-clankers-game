import Phaser from 'phaser';

export type WeaponName = 'Pistol' | 'Sword' | 'Crossbow' | 'Cannon';

const weaponTextureKeys: Record<WeaponName, string> = {
    Pistol: 'player-pistol-model',
    Sword: 'player-sword-model',
    Crossbow: 'player-crossbow-model',
    Cannon: 'player-cannon-model'
};

export default class PlayerWeaponVisual extends Phaser.GameObjects.Container
{
    private static readonly offsetX = 0;
    private static readonly offsetY = 0;
    private static readonly depthOffset = 0.1;

    private readonly weaponImage: Phaser.GameObjects.Image;
    private currentWeaponName: WeaponName;

    constructor (scene: Phaser.Scene, x: number, y: number, weaponName: WeaponName)
    {
        super(scene, x, y);

        this.currentWeaponName = weaponName;
        this.weaponImage = scene.add.image(0, 0, weaponTextureKeys[weaponName]);

        this.add(this.weaponImage);
        this.setSize(this.weaponImage.width, this.weaponImage.height);

        scene.add.existing(this);
    }

    public equip (weaponName: WeaponName) : void
    {
        if (this.currentWeaponName === weaponName)
        {
            return;
        }

        this.currentWeaponName = weaponName;
        this.weaponImage.setTexture(weaponTextureKeys[weaponName]);
    }

    public syncWithPlayer (player: Phaser.GameObjects.Sprite) : void
    {
        this.setPosition(
            player.x + PlayerWeaponVisual.offsetX,
            player.y + PlayerWeaponVisual.offsetY
        );
        this.setScale(player.scaleX, player.scaleY);
        this.setDepth(player.depth + PlayerWeaponVisual.depthOffset);
        this.setVisible(player.visible);
        this.setAlpha(player.alpha);
    }
}
