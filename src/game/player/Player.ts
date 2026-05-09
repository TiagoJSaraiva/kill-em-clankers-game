import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentação nas 4 direções
    private readonly momentum = 0.9; // Fator de momentum, usado pra suavizar a movimentação do jogador

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

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        this.processMovement(cursors); // Chama o método que processa a movimentação do player.
    }

    /*                    */
    /* MÉTODOS AUXILIARES */
    /*                    */

    processMovement (cursors: Phaser.Types.Input.Keyboard.CursorKeys) : void 
    {
        /*
            Esse método é responsável por toda a lógica de movimentação do jogador. 
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
            hasHorizontalInput ? direction.x : this.applyMomentum(body.velocity.x),
            hasVerticalInput ? direction.y : this.applyMomentum(body.velocity.y)
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
}
