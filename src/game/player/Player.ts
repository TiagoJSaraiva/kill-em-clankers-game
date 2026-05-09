import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite 
{
    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentação nas 4 direções

    /* MÉTODOS PRINCIPAIS */

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        scene.add.existing(this); // Adiciona o player à cena que chamar o construtor
        scene.physics.add.existing(this); // Habilita a física arcade no player
        this.setCollideWorldBounds(true); // Faz com que o player colida com as bordas da tela
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        this.processMovement(cursors); // Chama o método que processa a movimentação do player.
    }

    /* MÉTODOS AUXILIARES */

    processMovement (cursors: Phaser.Types.Input.Keyboard.CursorKeys) : void 
    {
        /*
            Esse método é responsável por toda a lógica de movimentação do jogador. 
            Ele verifica quais teclas estão sendo pressionadas e ajusta a velocidade do jogador de acordo.
        */

        const direction = new Phaser.Math.Vector2(0, 0);

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

        if (direction.lengthSq() > 0)
        {
            direction.normalize().scale(this.speed);
        }

        this.setVelocity(direction.x, direction.y);
    }
}
