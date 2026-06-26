import Phaser from 'phaser';
import Weapon from '../player/weapons/Weapon';

/**
 * Representa um slot fixo da HUD para uma arma do jogador.
 *
 * O slot exibe moldura, icone e preenchimento de energia, alternando a
 * textura do preenchimento quando a arma esta equipada.
 */
export class ItemSlot extends Phaser.GameObjects.Container
{
    static readonly scale = 0.5;
    private static readonly slotTextureKey = 'item-slot';
    private static readonly defaultFillTextureKey = 'item-slot-fill';
    private static readonly selectedFillTextureKey = 'selected-item-slot-fill';
    private static readonly depth = 1000;
    private static readonly fillCropX = 6;
    private static readonly fillCropY = 5;
    private static readonly fillCropWidth = 139;
    private static readonly fillCropHeight = 141;

    private readonly slotImage: Phaser.GameObjects.Image;
    private readonly weaponIcon: Phaser.GameObjects.Image;
    private readonly slotFillImage: Phaser.GameObjects.Image;
    private readonly weapon: Weapon;
    private currentFillTextureKey: string;

    /**
     * @param scene Cena onde o slot sera renderizado.
     * @param x Posicao horizontal do container na tela.
     * @param y Posicao vertical do container na tela.
     * @param weapon Arma usada como fonte de icone, energia e estado equipado.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, weapon: Weapon)
    {
        super(scene, x, y);
        this.weapon = weapon;

        this.currentFillTextureKey = ItemSlot.defaultFillTextureKey;
        this.slotFillImage = scene.add.image(0, 0, this.currentFillTextureKey);
        this.slotImage = scene.add.image(0, 0, ItemSlot.slotTextureKey);
        this.weaponIcon = scene.add.image(0, 0, this.getIconTextureKey(weapon.name));

        this.add([this.slotFillImage, this.slotImage, this.weaponIcon]);
        this.setSize(this.slotImage.displayWidth, this.slotImage.displayHeight);
        this.setScale(ItemSlot.scale);
        this.setScrollFactor(0);
        this.setDepth(ItemSlot.depth);

        scene.add.existing(this);
        this.update();
    }

    /**
     * Atualiza o estado visual do slot de acordo com a arma vinculada.
     */
    public update () : void 
    {
        this.updateFill();
    }

    /**
     * Recalcula o recorte vertical do preenchimento usando a energia atual.
     */
    private updateFill () : void
    {
        const nextFillTextureKey = this.weapon.isEquipped
            ? ItemSlot.selectedFillTextureKey
            : ItemSlot.defaultFillTextureKey;

        if (this.currentFillTextureKey !== nextFillTextureKey)
        {
            this.currentFillTextureKey = nextFillTextureKey;
            this.slotFillImage.setTexture(this.currentFillTextureKey);
        }

        const energyRatio = Phaser.Math.Clamp(this.weapon.currentEnergy / this.weapon.maxEnergy, 0, 1);
        const visibleHeight = Math.round(ItemSlot.fillCropHeight * energyRatio);

        this.slotFillImage.setVisible(visibleHeight > 0);

        if (visibleHeight === 0)
        {
            return;
        }

        this.slotFillImage.setCrop(
            ItemSlot.fillCropX,
            ItemSlot.fillCropY + ItemSlot.fillCropHeight - visibleHeight,
            ItemSlot.fillCropWidth,
            visibleHeight
        );
    }

    /**
     * @param weaponName Nome logico da arma.
     * @returns Chave da textura do icone cadastrada no loader.
     */
    private getIconTextureKey (weaponName: string) : string
    {
        return `player-${weaponName.toLowerCase()}-icon`;
    }
}
