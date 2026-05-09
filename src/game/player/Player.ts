import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setGravity(0, 200);
    }

    update (cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        if (cursors.left.isDown)
        {
            this.setVelocityX(-160);
            console.log('tentando anda')
        }
        else if (cursors.right.isDown)
        {
            this.setVelocityX(160);
        }
        else
        {
            this.setVelocityX(0);
        }

        if (cursors.up.isDown && this.body?.touching.down)
        {
            this.setVelocityY(-330);
        }
    }
}