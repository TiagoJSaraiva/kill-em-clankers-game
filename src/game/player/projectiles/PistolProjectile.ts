import Projectile from "./Projectile";

export default class PistolProjectile extends Projectile
{
    private updateListener: Function;

    constructor (scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'pistol-projectile');
        this.setVelocityX(300); // Define a velocidade do projétil para cima
        this.updateListener = () => this.update();
        this.scene.events.on('update', this.updateListener);
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
}