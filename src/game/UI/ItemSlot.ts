import Phaser from 'phaser';

export class ItemSlot extends Phaser.GameObjects.Container
{
    private static readonly slotTextureKey = 'item-slot';
    private static readonly iconSize = 64;
    private static readonly depth = 1000;

    private readonly slotImage: Phaser.GameObjects.Image;
    private readonly equipmentIcon: Phaser.GameObjects.Image;

    constructor (scene: Phaser.Scene, x: number, y: number, equipmentName: string)
    {
        super(scene, x, y);

        this.slotImage = scene.add.image(0, 0, ItemSlot.slotTextureKey);
        this.equipmentIcon = scene.add.image(0, 0, this.getIconTextureKey(equipmentName));
        this.equipmentIcon.setDisplaySize(ItemSlot.iconSize, ItemSlot.iconSize);

        this.add([this.slotImage, this.equipmentIcon]);
        this.setSize(this.slotImage.displayWidth, this.slotImage.displayHeight);
        this.setScrollFactor(0);
        this.setDepth(ItemSlot.depth);

        scene.add.existing(this);
    }

    public setEquipment (equipmentName: string) : void
    {
        this.equipmentIcon.setTexture(this.getIconTextureKey(equipmentName));
        this.equipmentIcon.setDisplaySize(ItemSlot.iconSize, ItemSlot.iconSize);
    }

    private getIconTextureKey (equipmentName: string) : string
    {
        return `player-${equipmentName.toLowerCase()}-icon`;
    }
}
