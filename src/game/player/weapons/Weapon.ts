
import Phaser from 'phaser';
import { Player } from '../Player';

export default class Weapon {
    private energyRegenRate: number = 1; // Quantidade de energia regenerada por frame quando a arma não está equipada

    isEquipped: boolean = false;
    maxEnergy: number = 100;
    private currentEnergy: number;
    private energySpentPerShot: number = 20;
    name: string;
    attackCooldown: number;
    private attackCooldownTimer: number = 0;
    spriteName: string;
    emitProjectile: (scene: Phaser.Scene, player: Player) => void;
    
    constructor(name: string, attackCooldown: number, spriteName: string, energySpentPerShot: number, emitProjectile: (scene: Phaser.Scene, player: Player) => void) {
        this.name = name;
        this.attackCooldown = attackCooldown;
        this.spriteName = spriteName;
        this.energySpentPerShot = energySpentPerShot;
        this.emitProjectile = emitProjectile;

        this.currentEnergy = this.maxEnergy;
    }

    update() {
        if (this.attackCooldownTimer > 0) {
            this.attackCooldownTimer--;
        }

        this.regenerateEnergy();
    }

    private spendEnergy() {
        this.currentEnergy = Math.max(0, this.currentEnergy - this.energySpentPerShot);
    }

    private regenerateEnergy() {
        if (this.isEquipped) {
            return; // Não regenera energia enquanto a arma está equipada
        }
        this.currentEnergy = Math.min(this.maxEnergy, this.currentEnergy + this.energyRegenRate);
    }

    tryShoot(scene: Phaser.Scene, player: Player) {
        if (this.attackCooldownTimer > 0) {
            return; // Ainda está no cooldown, não pode atirar
        }
        if(this.currentEnergy < this.energySpentPerShot) {
            console.log("Not enough energy to shoot!"); // ISSO AQUI VAI VIRAR A CHAMADA DE UMA FUNÇÃO DE FEEDBACK DE QUANDO O PLAYER NÃO PODE ATIRAR COM A ARMA EQUIPADA
            return; // Se não houver energia suficiente para atirar, não permite atirar
        }
        this.spendEnergy();
        this.emitProjectile(scene, player);
        this.attackCooldownTimer = this.attackCooldown; // Reseta o cooldown para a próxima tentativa de disparo
    }
}