import Phaser from 'phaser';
import { WeaponName } from '../player/weapons/types';

const weaponTextureKeys: Record<WeaponName, string> = {
    Pistol: 'player-pistol-model',
    Sword: 'player-sword-model',
    Crossbow: 'player-crossbow-model',
    Cannon: 'player-cannon-model'
}; // Catálogo de nome de texturas para cada arma, usado para atualizar a textura do PlayerWeaponVisual quando o jogador troca de arma

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

    public applyRecoil() {
        let recoilDistance = -12;
        let recoilDuration = 45;
        let recoverDuration = 90;

        switch (this.currentWeaponName) {
            case 'Pistol':
                recoilDistance = -5;
                recoilDuration = 30;
                recoverDuration = 20;
                break;
            case 'Sword':
                recoilDistance = -3;
                recoilDuration = 50;
                recoverDuration = 50;
                break;
            case 'Crossbow':
                recoilDistance = -5;
                recoilDuration = 70;
                recoverDuration = 50;
                break;
            case 'Cannon':
                recoilDistance = -7;
                recoilDuration = 70;
                recoverDuration = 120;
                break;
        }

        this.scene.tweens.killTweensOf(this.weaponImage);
        this.weaponImage.setX(0);

        this.scene.tweens.add({
            targets: this.weaponImage,
            x: recoilDistance,
            duration: recoilDuration,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.weaponImage,
                    x: 0,
                    duration: recoverDuration,
                    ease: 'Back.easeOut'
                });
            }
        });
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
