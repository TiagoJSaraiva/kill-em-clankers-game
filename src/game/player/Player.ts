import Phaser from 'phaser';
import Weapon from './weapons/Weapon';
import PistolProjectile from './projectiles/PistolProjectile';
import WhipProjectile from './projectiles/WhipProjectile';

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentação nas 4 direções
    private readonly momentum = 0.9; // Fator de momentum, usado pra suavizar a movimentação do jogador
    private activeWeapon: Weapon = Weapon.PISTOL; // Arma atualmente equipada pelo jogador
    private shootCooldown: number = 0; // Tempo restante para o próximo disparo, usado para controlar a cadência de tiro
    private maxCooldown: number = 60; // Tempo mínimo entre disparos, em frames


    /*                    */
    /* MÉTODOS PRINCIPAIS */
    /*                    */

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        scene.add.existing(this); // Adiciona o player à cena que chamar o construtor
        scene.physics.add.existing(this); // Habilita a física arcade no player
        this.setCollideWorldBounds(true); // Faz com que o player colida com as bordas da tela
        this.setScale(0.5); // Reduz o tamanho do player para melhor visualização
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene : Phaser.Scene)
    {
        this.processMovement(cursors); // Chama o método que processa a movimentação do player.
        this.processShooting(cursors, scene); // Chama o método que processa o disparo de armas do player.
    }

    /*                    */
    /* MÉTODOS AUXILIARES */
    /*                    */

    processMovement (cursors: Phaser.Types.Input.Keyboard.CursorKeys) : void 
    {
        /*
            Esse método é responsável por toda a lógica de movimentação do jogador mediante a entrada du usuário. 
            Ele verifica quais teclas estão sendo pressionadas e ajusta a velocidade do jogador de acordo.
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
        /*
            Esse método aplica o fator de momentum à velocidade atual do jogador,
            suavizando a desaceleração quando as teclas são soltas.
        */

        const nextVelocity = velocity * this.momentum;

        return Math.abs(nextVelocity) < 5 ? 0 : nextVelocity;
    }

    private processShooting (cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) : void 
    {
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
        switch (this.activeWeapon)
        {
            case Weapon.PISTOL:
                new PistolProjectile(scene, this.x, this.y - 20); // Dispara um projétil de pistola saindo da posição do player
                break;
            case Weapon.WHIP:
                new WhipProjectile(scene, this.x, this.y - 20); // Dispara um projétil de chicote saindo da posição do player
                break;
        }
    }
}
