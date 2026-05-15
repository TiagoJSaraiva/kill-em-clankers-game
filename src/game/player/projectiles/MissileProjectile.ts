import Projectile from "./Projectile";

export default class MissileProjectile extends Projectile
{
    private static readonly animationKey = 'missile-projectile-animation'; // Chave da animação do projétil
    private updateListener: Function;

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        this.setVelocityX(200); // Define a velocidade do projetil para cima
        this.updateListener = () => this.update();
        this.scene.events.on('update', this.updateListener);

        this.createAnimation(texture);
        this.play(MissileProjectile.animationKey);
    }

    update(): void
    {
        // Destruir se sair dos limites da tela
        if (this.y < -50 || this.y > 770 || this.x < -50 || this.x > 1350)
        {
            console.log("destroyed!");
            this.scene.events.off('update', this.updateListener);
            this.destroy();
        }
    }

    private createAnimation(texture: string): void
    {
        /** 
         * @description Cria a animação do projétil 
         * 
         * @param texture A textura do projétil, usada para gerar os frames da animação
         */
        
        if (this.scene.anims.exists(MissileProjectile.animationKey))
        {
            return;
        }

        this.scene.anims.create({
            key: MissileProjectile.animationKey,
            frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
    }
}
