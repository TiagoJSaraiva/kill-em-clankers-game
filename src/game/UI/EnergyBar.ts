import Phaser from 'phaser';
import Weapon from '../player/weapons/Weapon';

/**
 * Barra de energia da arma equipada.
 *
 * Mantem uma referencia para a arma ativa e atualiza a largura do
 * preenchimento conforme a energia disponivel para disparos.
 */
export class EnergyBar extends Phaser.GameObjects.Container
{
    private static readonly barTextureKey = 'energy-bar';
    private static readonly fillTextureKey = 'energy-bar-fill';
    private static readonly depth = 1000;
    private static readonly fillTextureWidth = 909;
    private static readonly fillStartX = 189;
    private static readonly fillOriginX = EnergyBar.fillStartX / EnergyBar.fillTextureWidth;
    private static readonly fillX = EnergyBar.fillStartX - (EnergyBar.fillTextureWidth / 2);

    static readonly scale = 0.3;

    private readonly energyBarImage: Phaser.GameObjects.Image;
    private readonly energyBarFill: Phaser.GameObjects.Image;
    private weapon: Weapon;

    /**
     * @param scene Cena onde a barra sera criada.
     * @param x Posicao horizontal do container.
     * @param y Posicao vertical do container.
     * @param weapon Arma inicialmente acompanhada pela barra.
     */
    constructor (scene: Phaser.Scene, x: number, y: number, weapon: Weapon)
    {
        super(scene, x, y);
        this.weapon = weapon;

        this.energyBarFill = scene.add.image(EnergyBar.fillX, 0, EnergyBar.fillTextureKey);
        this.energyBarFill.setOrigin(EnergyBar.fillOriginX, 0.5);

        this.energyBarImage = scene.add.image(0, 0, EnergyBar.barTextureKey);

        this.add([this.energyBarFill, this.energyBarImage]);
        this.setSize(this.energyBarImage.displayWidth, this.energyBarImage.displayHeight);
        this.setScale(EnergyBar.scale);
        this.setScrollFactor(0);
        this.setDepth(EnergyBar.depth);

        scene.add.existing(this);
        this.updateFill();
    }

    /**
     * Sincroniza o preenchimento visual com a energia da arma atual.
     */
    public updateFill () : void
    {
        const energyRatio = this.getSafeRatio(this.weapon.currentEnergy, this.weapon.maxEnergy);

        this.energyBarFill.setScale(energyRatio, 1);
        this.energyBarFill.setVisible(energyRatio > 0);
    }

    /**
     * Troca a arma observada pela barra de energia.
     *
     * @param weapon Nova arma ativa do jogador.
     */
    public setWeapon (weapon: Weapon) : void
    {
        this.weapon = weapon;
        this.updateFill();
    }

    /**
     * @returns Valor normalizado entre 0 e 1, protegido contra maximo invalido.
     */
    private getSafeRatio (current: number, max: number) : number
    {
        if (max <= 0)
        {
            return 0;
        }

        return Phaser.Math.Clamp(current / max, 0, 1);
    }
}
