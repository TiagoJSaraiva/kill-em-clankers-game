import Phaser from 'phaser';
import { Weapons } from './weapons/WeaponsCatalog';
import type Weapon from './weapons/Weapon';
import { ItemSlot } from '../UI/ItemSlot';
import { HealthBar } from '../UI/HealthBar';
import { EnergyBar } from '../UI/EnergyBar';
import PlayerWeaponVisual from './PlayerWeaponVisual';
import type { WeaponName } from './weapons/types';

/**
 * Entidade jogavel principal.
 *
 * Centraliza movimento, troca de armas, disparos, vida e os elementos de HUD
 * associados ao jogador.
 */
export class Player extends Phaser.Physics.Arcade.Sprite
{
    private static readonly animationKey = 'player-body-animation';

    private readonly speed = 200; // Velocidade geral do jogador, usada pra movimentacao nas 4 direcoes
    private readonly momentum = 0.9; // Fator de momentum, usado pra suavizar a movimentacao do jogador
    private readonly hitboxWidth = 189; // Largura manual da hitbox, em pixels antes do setScale
    private readonly hitboxHeight = 236; // Altura manual da hitbox, em pixels antes do setScale

    readonly maxHealthPoints: number = 100; // Pontos de vida do jogador, quando chegam a 0 o jogador morre
    currentHealthPoints: number = this.maxHealthPoints; // Pontos de vida atuais do jogador, comecam no maximo e vao diminuindo conforme o jogador leva dano

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

    /**
     * @param scene Cena onde o jogador sera criado.
     * @param x Posicao horizontal inicial.
     * @param y Posicao vertical inicial.
     */
    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setScale(0.8);
        this.configureHitbox();
        this.createAnimation();
        this.play(Player.animationKey);

        this.initialize(scene);
    }

    /**
     * Garante que a animacao base do corpo exista antes de ser reproduzida.
     */
    private createAnimation () : void
    {
        if (this.scene.anims.exists(Player.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: Player.animationKey,
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    /**
     * Ajusta hitbox manualmente para aproximar a colisao do corpo visivel.
     */
    private configureHitbox () : void
    {
        this.setBodySize(this.hitboxWidth, this.hitboxHeight, true);
        this.setOffset(70, 124);
    }

    /**
     * Configura input, armas, visual da arma e HUD do jogador.
     */
    private initialize (scene: Phaser.Scene) : void
    {
        // Configura as teclas de troca de arma, mapeando QWER para as armas do jogador
        this.keyQ = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyR = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Carrega as armas do jogador a partir do catalogo de armas, e equipa a arma inicial (Pistol)
        this.weapons = Weapons();
        this.activeWeapon = this.weapons.Pistol;
        this.activeWeapon.isEquipped = true;

        // Cria o visual da arma do jogador, que vai ser sincronizado com o corpo do player e atualizado conforme o jogador troca de arma
        this.weaponVisual = new PlayerWeaponVisual(scene, this.x, this.y, this.activeWeapon.name);
        this.weaponVisual.syncWithPlayer(this);

        // Cria os elementos de UI relacionados ao jogador, como os slots de arma, barra de vida e barra de energia
        this.instantiateUI(scene);
    }

    /**
     * Atualiza todos os subsistemas do jogador em um frame da cena.
     *
     * @param cursors Teclas direcionais e espaco criadas pela cena.
     * @param scene Cena atual usada para disparos e UI.
     */
    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) : void
    {
        this.processMovement(cursors);
        this.updateWeapon();
        this.processShooting(cursors, scene);
        this.processWeaponSwitch();
        this.weaponVisual.syncWithPlayer(this);
        this.updateUI();
    }

    /**
     * Avanca cooldown e regeneracao de energia de todas as armas.
     */
    updateWeapon () : void
    {
        for (const weapon of Object.values(this.weapons))
        {
            weapon.update();
        }
    }

    /**
     * Processa o comando de ataque e aciona o recuo visual quando disparar.
     */
    processShooting (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) : void
    {
        if (cursors.space.isDown)
        {
            let shotFired = this.activeWeapon.tryShoot(scene, this);
            if (shotFired) {
                this.weaponVisual.applyRecoil();
            }
        }
    }

    /**
     * Cria slots de armas e barras de status fixas na tela.
     */
    instantiateUI (scene: Phaser.Scene) : void
    {
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

    /**
     * Sincroniza todos os componentes de HUD com o estado atual do jogador.
     */
    updateUI () : void
    {
        this.healthBar.updateFill(this);
        this.energyBar.updateFill();
        this.weaponSlots.forEach((slot) => {
            slot.update();
        });
    }

    /**
     * Lida com a troca de arma via QWER respeitando o cooldown entre trocas.
     */
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

    /**
     * Equipa uma arma e sincroniza a HUD e o visual externo.
     *
     * @param weaponName Nome da arma que passara a ser ativa.
     */
    private equipWeapon (weaponName: WeaponName) : void
    {
        this.activeWeapon.isEquipped = false;
        this.activeWeapon = this.weapons[weaponName];
        this.activeWeapon.isEquipped = true;
        this.energyBar.setWeapon(this.activeWeapon);
        this.weaponVisual.equip(weaponName);
    }

    /**
     * Converte input direcional em velocidade Arcade com suavizacao.
     */
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

    /**
     * Reduz gradualmente uma velocidade residual ate parar.
     */
    private applyMomentum (velocity: number) : number
    {
        const nextVelocity = velocity * this.momentum;

        return Math.abs(nextVelocity) < 5 ? 0 : nextVelocity;
    }

    /**
     * Aplica dano ao jogador.
     *
     * @param amount Quantidade de vida removida.
     * @returns `true` quando a vida chega a zero.
     */
    takeDamage (amount: number) : boolean
    {
        let dead: boolean = false;
        this.currentHealthPoints = Math.max(0, this.currentHealthPoints - amount);

        if (this.currentHealthPoints === 0)
        {
            dead = true;
        }
        
        return dead;
    }
}
