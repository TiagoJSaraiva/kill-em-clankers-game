import Phaser from 'phaser';
import Weapons from './weapons/Weapons';
import PistolProjectile from './projectiles/PistolProjectile';
import SlashProjectile from './projectiles/SlashProjectile';
import ArrowProjectile from './projectiles/ArrowProjectile';
import MissileProjectile from './projectiles/MissileProjectile';

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    // Mapeamento de armas para as texturas correspondentes do player, usado para atualizar a aparência do player conforme a arma equipada
    private static readonly weaponTextureKeys = new Map<typeof Weapons[number], string>([
        [Weapons[0], 'player-pistol'],
        [Weapons[1], 'player-sword'],
        [Weapons[2], 'player-rifle'],
        [Weapons[3], 'player-cannon']
    ]);

    // Chave do sprite de ataque da espada, usada para mostrar uma animação de ataque quando a espada é usada para atacar
    private static readonly swordAttackTextureKey = 'player-sword-attacking'; 
    private static readonly swordAttackTextureDuration = 160;
    private isShowingSwordAttackTexture: boolean = false;

    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentação nas 4 direções
    private readonly momentum = 0.9; // Fator de momentum, usado pra suavizar a movimentação do jogador
    private activeWeapon: typeof Weapons[number] = Weapons[0]; // Arma atualmente equipada pelo jogador
    private shootCooldown: number = 0; // Tempo restante para o próximo disparo, usado para controlar a cadência de tiro
    private maxCooldown: number = 60; // Tempo mínimo entre disparos, em frames
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

        this.initialBodySize = this.getCurrentBodySize();
        this.updatePlayerTexture();

        this.keyQ = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyR = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene : Phaser.Scene)
    {
        this.processMovement(cursors); // Chama o método que processa a movimentação do player.
        this.processShooting(cursors, scene); // Chama o método que processa o disparo de armas do player.
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
            this.activeWeapon = Weapons[0];
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }
        else if (this.keyW.isDown)
        {
            this.activeWeapon = Weapons[1];
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }
        else if (this.keyE.isDown)
        {
            this.activeWeapon = Weapons[2];
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }
        else if (this.keyR.isDown)
        {
            this.activeWeapon = Weapons[3];
            this.weaponSwitchCooldown = this.maxWeaponSwitchCooldown; // Reseta o cooldown para a próxima troca de arma
        }

        this.maxCooldown = this.activeWeapon.attackCooldown;
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
         *  @returns a nova velocidade após aplicar o fator de momentum, ou 0 se a velocidade for muito baixa
         */

        const nextVelocity = velocity * this.momentum;

        return Math.abs(nextVelocity) < 5 ? 0 : nextVelocity;
    }

    private processShooting (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) : void 
    {

        /** 
         *  @description Esse método é chamado em toda chamada de update() do player e
         *  é responsável por processar a lógica de disparo de armas.
         * 
         *  @param cursors : usado para verificar se a tecla de disparo (espaço) está sendo pressionada
         * 
         *  @param scene : passado para o método de disparo para que os projéteis possam ser adicionados à cena correta
         */

        if(this.shootCooldown > 0)
        {
            this.shootCooldown--;
            return; // Se ainda estiver no cooldown, não permite atirar
        }

        if (cursors.space.isDown)
        {
            this.shoot(scene);
            this.shootCooldown = this.maxCooldown; // Reseta o cooldown para o próximo disparo
        }
    }

    private shoot (scene: Phaser.Scene) : void
    {
        /** 
         *  @description Esse método verifica qual arma está equipada pelo player e 
         *  instancia o projétil correspondente, saindo da posição do player.
         *  
         *  @param scene : passado para o construtor do projétil para que ele possa ser adicionado 
         *  à cena correta
         */

        switch (this.activeWeapon)
        {
            case Weapons[0]:
                new PistolProjectile(scene, this.x, this.y - 20, 'pistol-projectile'); // Dispara um projétil de pistola saindo da posição do player
                new PistolProjectile(scene, this.x, this.y + 30, 'pistol-projectile'); // Dispara um projétil de pistola saindo da posição do player
                break;
            case Weapons[1]:
                this.showSwordAttackTexture(scene);
                new SlashProjectile(scene, this.x, this.y - 20, 'slash-projectile'); // Dispara um projétil de slash saindo da posição do player
                break;
            case Weapons[2]:
                new ArrowProjectile(scene, this.x, this.y - 20, 'arrow-projectile'); // Dispara um projétil de chakram saindo da posição do player
                break;
            case Weapons[3]:
                new MissileProjectile(scene, this.x, this.y - 20, 'missile-projectile'); // Dispara um projétil de míssil saindo da posição do player
                break;
        }
    } 

    private updatePlayerTexture () : void
    {
        /**
         *  @description Esse método atualiza a textura do player de acordo com a arma atualmente equipada.
         */

        const textureKey = Player.weaponTextureKeys.get(this.activeWeapon); // Obtém a chave da textura correspondente à arma ativa do player

        if (this.isShowingSwordAttackTexture && this.activeWeapon === Weapons[1]) // Se o player estiver mostrando a textura de ataque da espada e a arma ativa for a espada, não atualiza a textura para evitar sobrescrever a animação de ataque
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

    private showSwordAttackTexture (scene: Phaser.Scene) : void
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

            if (this.activeWeapon === Weapons[1])
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
