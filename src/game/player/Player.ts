import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite
{
    private readonly speed = 260; // Velocidade geral do jogador, usada pra movimentação nas 4 direções

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        this.processMovement(cursors);
    }

    processMovement (cursors: Phaser.Types.Input.Keyboard.CursorKeys) : void 
    {
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
