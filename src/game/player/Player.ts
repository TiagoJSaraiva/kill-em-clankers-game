import Phaser from 'phaser';
import { Weapons } from './weapons/WeaponsCatalog';
import Weapon from './weapons/Weapon';

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    // Chave do sprite de ataque da espada, usada para mostrar uma animação de ataque quando a espada é usada para atacar
    private static readonly swordAttackTextureKey = 'player-sword-model-attacking'; 
    private static readonly swordAttackTextureDuration = 160;
    private isShowingSwordAttackTexture: boolean = false;

    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentação nas 4 direções
    private readonly momentum = 0.9; // Fator de momentum, usado pra suavizar a movimentação do jogador
    private healthPoints: number = 100; // Pontos de vida do jogador, quando chegam a 0 o jogador morre

    private weapons: { [key: string]: Weapon }; // Catálogo de armas do jogador, carregado a partir do módulo WeaponsCatalog
    private activeWeapon: Weapon; // Arma atualmente equipada pelo jogador
    private weaponSwitchCooldown: number = 0; // Tempo restante para a próxima troca de arma, usado para evitar trocas muito rápidas
    private maxWeaponSwitchCooldown: number = 60; // Tempo mínimo entre trocas de arma, em frames
    private initialBodySize: { width: number; height: number; offsetX: number; offsetY: number };

    // Mapeamento de keys do teclado, usado para processar a troca de armas
    private keyQ: Phaser.Input.Keyboard.Key;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyE: Phaser.Input.Keyboard.Key;
    private keyR: Phaser.Input.Keyboard.Key;

    /*                    */
    /* MÉTODOS PRINCIPAIS */
    /*                    */

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
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

        this.initialBodySize = this.getCurrentBodySize();
        this.updatePlayerTexture();
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene : Phaser.Scene)
    {
        this.processMovement(cursors); // Chama o método que processa a movimentação do player.
        for (const weapon of Object.values(this.weapons)) {
            weapon.update(); // Atualiza o estado de cada arma do jogador, mesmo as que não estão ativas, para garantir que cooldowns e regeneração de energia funcionem corretamente
        }
        if(cursors.space.isDown) {
            this.activeWeapon.tryShoot(scene, this);
        }
        this.processWeaponSwitch(); // Chama o método que processa a troca de armas do player.
    }

    /*                    */
    /* MÉTODOS AUXILIARES */
    /*                    */

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

        this.updatePlayerTexture();
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

    private updatePlayerTexture () : void
    {
        /**
         *  @description Esse método atualiza a textura do player de acordo com a arma atualmente equipada.
         */

        const textureKey = this.activeWeapon.spriteName; // Obtém a chave da textura correspondente à arma ativa do player

        if (this.isShowingSwordAttackTexture && this.activeWeapon === this.weapons.Sword) // Se o player estiver mostrando a textura de ataque da espada e a arma ativa for a espada, não atualiza a textura para evitar sobrescrever a animação de ataque
        {
            return;
        }

        if (!textureKey || this.texture.key === textureKey) // Se não houver uma textura correspondente para a arma ativa ou se a textura atual já for a correta, não faz nada
        {
            return;
        }

        this.setTexture(textureKey);
        this.restoreInitialBodySize(); // Restaura o tamanho original do corpo do player, caso a textura nova tenha um tamanho diferente que possa ter alterado o corpo do player em alguma troca anterior
    }

    public showSwordAttackTexture (scene: Phaser.Scene) : void
    {
        /** 
         *  @description Esse método mostra a textura de ataque da espada por um período determinado.
         * 
         *  @param scene : passado para o construtor do projétil para que ele possa ser adicionado à cena correta
         */

        this.isShowingSwordAttackTexture = true;
        this.setTexture(Player.swordAttackTextureKey);
        this.restoreInitialBodySize();

        scene.time.delayedCall(Player.swordAttackTextureDuration, () => {
            this.isShowingSwordAttackTexture = false;

            if (this.activeWeapon === this.weapons.Sword)
            {
                this.updatePlayerTexture();
            }
        });
    }

    private getCurrentBodySize () : { width: number; height: number; offsetX: number; offsetY: number }
    {
        /**
         *  @description Esse método obtém o tamanho atual do corpo do player, incluindo largura, altura e offset.
         * 
         *  @returns um objeto contendo a largura, altura e offset do corpo do player, 
         *  usado para restaurar o tamanho original do corpo após mudanças de textura que possam alterá-lo.
         */

        const body = this.body as Phaser.Physics.Arcade.Body;

        return {
            width: body.width,
            height: body.height,
            offsetX: body.offset.x,
            offsetY: body.offset.y
        };
    }

    private restoreInitialBodySize () : void
    {
        /**
         *  @description Esse método restaura o tamanho original do corpo do player, 
         *  usando as informações armazenadas no momento da criação do player.
         */

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.setSize(this.initialBodySize.width, this.initialBodySize.height, false);
        body.setOffset(this.initialBodySize.offsetX, this.initialBodySize.offsetY);
    }
}
