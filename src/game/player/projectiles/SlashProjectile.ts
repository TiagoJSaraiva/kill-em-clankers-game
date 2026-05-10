import Projectile from "./Projectile";

export default class SlashProjectile extends Projectile
{
    private static readonly animationKey = 'slash-projectile-animation';
    private updateListener: Function;
    private lifespam: number = 20; // Tempo de vida do projétil em frames, usado para destruir o projétil após um certo tempo
    private age: number = 0; // Idade atual do projétil em frames, incrementada a cada update

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        this.setVelocityX(1000); // Define a velocidade do projétil para cima
        this.updateListener = () => this.update();
        this.scene.events.on('update', this.updateListener);

        this.createAnimation(texture);
        this.play(SlashProjectile.animationKey);
    }

    update(): void
    {
        // Destruir se sair dos limites da tela
        if (this.y < -50 || this.y > 770 || this.x < -50 || this.x > 1350)
        {
            console.log("destroyed!");
            this.scene.events.off('update', this.updateListener);
            this.destroy();
        } else {
            this.processLifespam()
        }
    }

    processLifespam(): void
    {
        /** 
         *  Esse método é chamado em toda chamada de update() do projétil e
         *  é responsável por controlar o tempo de vida do projétil, destruindo-o após um certo tempo.
         */
        this.age++;
        if (this.age >= this.lifespam)
        {
            this.scene.events.off('update', this.updateListener);
            this.destroy();
        }
    }

    private createAnimation(texture: string): void
    {
        if (this.scene.anims.exists(SlashProjectile.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: SlashProjectile.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
    }
}