import Phaser from 'phaser';
import { Weapons } from './weapons/WeaponsCatalog';
import Weapon from './weapons/Weapon';
import { ItemSlot } from '../UI/ItemSlot';
import { HealthBar } from '../UI/HealthBar';
import { EnergyBar } from '../UI/EnergyBar';

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    // Chave do sprite de ataque da espada, usada para mostrar uma animação de ataque quando a espada é usada para atacar
    private isShowingSwordAttackTexture: boolean = false;

    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentação nas 4 direções
    private readonly momentum = 0.9; // Fator de momentum, usado pra suavizar a movimentação do jogador
    
    readonly maxHealthPoints: number = 100; // Pontos de vida do jogador, quando chegam a 0 o jogador morre
    currentHealthPoints: number; // Pontos de vida atuais do jogador, começam no máximo e vão diminuindo conforme o jogador leva dano

    private weapons: { [key: string]: Weapon }; // Catálogo de armas do jogador, carregado a partir do módulo WeaponsCatalog
    private activeWeapon: Weapon; // Arma atualmente equipada pelo jogador
    private weaponSwitchCooldown: number = 0; // Tempo restante para a próxima troca de arma, usado para evitar trocas muito rápidas
    private maxWeaponSwitchCooldown: number = 60; // Tempo mínimo entre trocas de arma, em frames

    private weaponSlots: ItemSlot[] = []; // Mapeamento das armas do jogador para os slots de UI correspondentes, usado para atualizar a interface quando o jogador troca de arma ou seleciona um slot
    private healthBar: HealthBar; // Barra de vida do jogador, usada para mostrar a quantidade de vida restante
    private energyBar: EnergyBar; // Barra de energia do jogador, usada para mostrar a quantidade de energia restante para usar as armas

    // Mapeamento de keys do teclado, usado para processar a troca de armas
    private keyQ: Phaser.Input.Keyboard.Key;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyE: Phaser.Input.Keyboard.Key;
    private keyR: Phaser.Input.Keyboard.Key;

    /*                    */
    /* MÉTODOS PRINCIPAIS */
    /*                    */

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'player');
        scene.add.existing(this); // Adiciona o player à cena que chamar o construtor
        scene.physics.add.existing(this); // Habilita a física arcade no player
        this.setCollideWorldBounds(true); // Faz com que o player colida com as bordas da tela
        this.setScale(0.8); // Reduz o tamanho do player para melhor visualização

        this.initialize(scene); // Chama o método de criação para inicializar o player, carregar armas e configurar controles
    }

    private initialize(scene: Phaser.Scene) : void {
        this.keyQ = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyR = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.weapons = Weapons();
        this.activeWeapon = this.weapons.Pistol; // Começa com a pistola equipada
        this.activeWeapon.isEquipped = true;

        this.currentHealthPoints = this.maxHealthPoints;

        let slotPositionX = 700 * ItemSlot.scale; // Posição inicial do primeiro slot de arma na UI
        for (const weapon of Object.values(this.weapons)) {
            const slot = new ItemSlot(scene, slotPositionX, 150 * ItemSlot.scale, weapon); // Cria um slot de UI para cada arma do jogador
            this.weaponSlots.push(slot);
            slotPositionX += 200 * ItemSlot.scale; // Ajusta a posição do próximo slot
        }
        this.healthBar = new HealthBar(scene, 500 * HealthBar.scale, 150 * HealthBar.scale); // Cria a barra de vida
        this.energyBar = new EnergyBar(scene, 500 * EnergyBar.scale, 350 * EnergyBar.scale, this.activeWeapon); // Cria a barra de energia
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene : Phaser.Scene)
    {
        this.processMovement(cursors); // Chama o método que processa a movimentação do player mediante o input do usuário
        this.updateWeapon(); // Chama update de todas as this.weapons para garantir que cooldowns e regeneração de energia funcionem.
        this.processShooting(cursors, scene); // Chama o método que processa a lógica de tiro do jogador
        this.processWeaponSwitch(); // Chama o método que processa a troca de armas do player.
        this.updateUI(); // Chama o método que atualiza a UI do jogador, no caso, barra de energia e slots de weapon
    }

    /*                    */
    /* MÉTODOS AUXILIARES */
    /*                    */

    updateWeapon(): void
    {
         // Chama o método que processa a movimentação do player.
        for (const weapon of Object.values(this.weapons)) {
            weapon.update(); // Atualiza o estado de cada arma do jogador, mesmo as que não estão ativas, para garantir que cooldowns e regeneração de energia funcionem corretamente
        }
        
    }

    processShooting(cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene): void
    {
        if(cursors.space.isDown) {
            this.activeWeapon.tryShoot(scene, this);
        }
    }

    updateUI() : void 
    {
        this.energyBar.updateFill();
        this.weaponSlots.forEach((slot) => {
            slot.update();
        });
    }

    processWeaponSwitch() : void 
    {
        /** 
         *  @description Esse método é responsável por processar a lógica de troca de armas do jogador.
         *  Ele verifica se as teclas numéricas correspondentes às armas estão sendo pressionadas e
         *  atualiza a arma ativa do jogador de acordo.
         * 
         *  @param cursors : usado para verificar se as teclas de troca de arma (1, 2, 3) estão sendo pressionadas
         */
        if(this.weaponSwitchCooldown > 0)
        {
            this.weaponSwitchCooldown--;
            return; // Se ainda estiver no cooldown, não permite trocar de arma
        }

        if (this.keyQ.isDown)
        {
            this.activeWeapon.isEquipped = false; // Desequipa a arma atualmente ativa antes de trocar para a nova
            this.activeWeapon = this.weapons.Pistol;
            this.activeWeapon.isEquipped = true; // Equipa a nova arma
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }
        else if (this.keyW.isDown)
        {
            this.activeWeapon.isEquipped = false; // Desequipa a arma atualmente ativa antes de trocar para a nova
            this.activeWeapon = this.weapons.Sword;
            this.activeWeapon.isEquipped = true; // Equipa a nova arma
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }
        else if (this.keyE.isDown)
        {
            this.activeWeapon.isEquipped = false; // Desequipa a arma atualmente ativa antes de trocar para a nova
            this.activeWeapon = this.weapons.Crossbow;
            this.activeWeapon.isEquipped = true; // Equipa a nova arma
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }
        else if (this.keyR.isDown)
        {
            this.activeWeapon.isEquipped = false; // Desequipa a arma atualmente ativa antes de trocar para a nova
            this.activeWeapon = this.weapons.Cannon;
            this.activeWeapon.isEquipped = true; // Equipa a nova arma
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }

        this.energyBar.setWeapon(this.activeWeapon); // Atualiza a barra de energia para mostrar a energia da nova arma equipada
        //this.updatePlayerHoldingWeapon(); // Método que vai atualizar o container que "guarda" o braço do player ou seila. No caso esse método não vai ser de player, vai ser da referência ao objeto do braço, que vai ser um container filho do player, e vai ser o responsável por mostrar o sprite do braço segurando a arma, e vai ser atualizado toda vez que o player trocar de arma pra mostrar o sprite correto do braço segurando a arma equipada
    }

    processMovement (cursors: Phaser.Types.Input.Keyboard.CursorKeys) : void 
    {
        /** 
         *  @description Esse método é responsável por toda a lógica de movimentação do jogador mediante a entrada du usuário. 
         *  Ele verifica quais teclas estão sendo pressionadas e ajusta a velocidade do jogador de acordo.
         * 
         *  @param cursors : usado para verificar quais teclas de direção estão sendo pressionadas e ajustar a velocidade do jogador
         */

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
            hasHorizontalInput ? direction.x : this.applyMomentum(body.velocity.x), // Aplica o fator de momentum quando não há input horizontal
            hasVerticalInput ? direction.y : this.applyMomentum(body.velocity.y) // Aplica o fator de momentum quando não há input vertical
        );
    }

    private applyMomentum (velocity: number) : number
    {
        /** 
         *  @description Esse método aplica o fator de momentum à velocidade atual do jogador,
         *  suavizando a desaceleração quando as teclas são soltas.
         * 
         *  @param velocity : a velocidade atual do jogador em uma direção (x ou y)
         * 
         *  @returns a nova velocidade após aplicar o fator de momentum, ou 0 se a velocidade for muito baixa
         */

        const nextVelocity = velocity * this.momentum;

        return Math.abs(nextVelocity) < 5 ? 0 : nextVelocity;
    }

    takeDamage(amount: number) : void {
        /** 
         *  @description Esse método é chamado quando o jogador leva dano, reduzindo seus pontos de vida e verificando se ele morreu.
         * 
         *  @param amount : a quantidade de dano que o jogador deve receber, subtraída dos pontos de vida atuais
         */

        this.currentHealthPoints = Math.max(0, this.currentHealthPoints - amount); // Reduz os pontos de vida do jogador, garantindo que não fiquem abaixo de 0

        if (this.currentHealthPoints === 0) {
            this.die(); // Se os pontos de vida chegarem a 0, chama o método de morte do jogador
        }
    }

    private die() : void {
        /** 
         *  @description Esse método é chamado quando o jogador morre, podendo ser usado para tocar animações de morte, reiniciar a fase, etc.
         *  Por enquanto, ele apenas imprime uma mensagem no console.
         */

        console.log("Player has died!"); // ISSO AQUI VAI VIRAR A CHAMADA DE UMA FUNÇÃO DE GAME OVER QUANDO O JOGO TIVER UMA TELA DE GAME OVER IMPLEMENTADA
    }
}
