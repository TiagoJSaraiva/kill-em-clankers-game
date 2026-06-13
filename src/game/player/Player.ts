import Phaser from 'phaser';
import { Weapons } from './weapons/WeaponsCatalog';
import type Weapon from './weapons/Weapon';
import { ItemSlot } from '../UI/ItemSlot';
import { HealthBar } from '../UI/HealthBar';
import { EnergyBar } from '../UI/EnergyBar';
import PlayerWeaponVisual, { type WeaponName } from './PlayerWeaponVisual';

export class Player extends Phaser.Physics.Arcade.Sprite
{
    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentacao nas 4 direcoes
    private readonly momentum = 0.9; // Fator de momentum, usado pra suavizar a movimentacao do jogador

    readonly maxHealthPoints: number = 100; // Pontos de vida do jogador, quando chegam a 0 o jogador morre
    currentHealthPoints: number; // Pontos de vida atuais do jogador, comecam no maximo e vao diminuindo conforme o jogador leva dano

    private weapons: Record<WeaponName, Weapon>; // Catalogo de armas do jogador, carregado a partir do modulo WeaponsCatalog
    private activeWeapon: Weapon; // Arma atualmente equipada pelo jogador
    private weaponSwitchCooldown: number = 0; // Tempo restante para a proxima troca de arma, usado para evitar trocas muito rapidas
    private maxWeaponSwitchCooldown: number = 60; // Tempo minimo entre trocas de arma, em frames
    private weaponVisual: PlayerWeaponVisual; // Visual de bracos e arma equipada, sincronizado com o corpo do player

    private weaponSlots: ItemSlot[] = []; // Mapeamento das armas do jogador para os slots de UI correspondentes
    private healthBar: HealthBar; // Barra de vida do jogador
    private energyBar: EnergyBar; // Barra de energia da arma equipada

    // Mapeamento de keys do teclado, usado para processar a troca de armas
    private keyQ: Phaser.Input.Keyboard.Key;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyE: Phaser.Input.Keyboard.Key;
    private keyR: Phaser.Input.Keyboard.Key;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setScale(0.8);

        this.initialize(scene);
    }

    private initialize (scene: Phaser.Scene) : void
    {
        this.keyQ = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyR = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.weapons = Weapons();
        this.activeWeapon = this.weapons.Pistol;
        this.activeWeapon.isEquipped = true;

        this.weaponVisual = new PlayerWeaponVisual(scene, this.x, this.y, this.activeWeapon.name);
        this.weaponVisual.syncWithPlayer(this);

        this.currentHealthPoints = this.maxHealthPoints;

        let slotPositionX = 700 * ItemSlot.scale;
        for (const weapon of Object.values(this.weapons))
        {
            const slot = new ItemSlot(scene, slotPositionX, 150 * ItemSlot.scale, weapon);
            this.weaponSlots.push(slot);
            slotPositionX += 200 * ItemSlot.scale;
        }

        this.healthBar = new HealthBar(scene, 500 * HealthBar.scale, 150 * HealthBar.scale);
        this.energyBar = new EnergyBar(scene, 500 * EnergyBar.scale, 350 * EnergyBar.scale, this.activeWeapon);
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) : void
    {
        this.processMovement(cursors);
        this.updateWeapon();
        this.processShooting(cursors, scene);
        this.processWeaponSwitch();
        this.weaponVisual.syncWithPlayer(this);
        this.updateUI();
    }

    updateWeapon () : void
    {
        for (const weapon of Object.values(this.weapons))
        {
            weapon.update();
        }
    }

    processShooting (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) : void
    {
        if (cursors.space.isDown)
        {
            this.activeWeapon.tryShoot(scene, this);
        }
    }

    updateUI () : void
    {
        this.healthBar.updateFill(this);
        this.energyBar.updateFill();
        this.weaponSlots.forEach((slot) => {
            slot.update();
        });
    }

    processWeaponSwitch () : void
    {
        if (this.weaponSwitchCooldown > 0)
        {
            this.weaponSwitchCooldown--;
            return;
        }

        let nextWeaponName: WeaponName | null = null;

        if (this.keyQ.isDown)
        {
            nextWeaponName = 'Pistol';
        }
        else if (this.keyW.isDown)
        {
            nextWeaponName = 'Sword';
        }
        else if (this.keyE.isDown)
        {
            nextWeaponName = 'Crossbow';
        }
        else if (this.keyR.isDown)
        {
            nextWeaponName = 'Cannon';
        }

        if (nextWeaponName === null)
        {
            return;
        }

        this.equipWeapon(nextWeaponName);
        this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown;
    }

    private equipWeapon (weaponName: WeaponName) : void
    {
        this.activeWeapon.isEquipped = false;
        this.activeWeapon = this.weapons[weaponName];
        this.activeWeapon.isEquipped = true;
        this.energyBar.setWeapon(this.activeWeapon);
        this.weaponVisual.equip(weaponName);
    }

    processMovement (cursors: Phaser.Types.Input.Keyboard.CursorKeys) : void
    {
        const direction = new Phaser.Math.Vector2(0, 0);
        const body = this.body as Phaser.Physics.Arcade.Body;

        if (cursors.left.isDown)
        {
            direction.x = -1;
        }
        else if (cursors.right.isDown)
        {
            direction.x = 1;
        }

        if (cursors.up.isDown)
        {
            direction.y = -1;
        }
        else if (cursors.down.isDown)
        {
            direction.y = 1;
        }

        const hasHorizontalInput = direction.x !== 0;
        const hasVerticalInput = direction.y !== 0;

        if (direction.lengthSq() > 0)
        {
            direction.normalize().scale(this.speed);
        }

        this.setVelocity(
            hasHorizontalInput ? direction.x : this.applyMomentum(body.velocity.x),
            hasVerticalInput ? direction.y : this.applyMomentum(body.velocity.y)
        );
    }

    private applyMomentum (velocity: number) : number
    {
        const nextVelocity = velocity * this.momentum;

        return Math.abs(nextVelocity) < 5 ? 0 : nextVelocity;
    }

    takeDamage (amount: number) : void
    {
        this.currentHealthPoints = Math.max(0, this.currentHealthPoints - amount);

        if (this.currentHealthPoints === 0)
        {
            this.die();
        }
    }

    private die () : void
    {
        console.log('Player has died!');
    }
}
