
import Phaser from 'phaser';
import { Player } from '../Player';

export default class Weapon {
    name: string;
    attackCooldown: number;
    spriteName: string;
    shoot: (scene: Phaser.Scene, player: Player) => void;
    maxEnergy: number = 100;
    currentEnergy: number;
    energySpentPerShot: number = 20;

    constructor(name: string, attackCooldown: number, spriteName: string, energySpentPerShot: number, shoot: (scene: Phaser.Scene, player: Player) => void) {
        this.name = name;
        this.attackCooldown = attackCooldown;
        this.spriteName = spriteName;
        this.energySpentPerShot = energySpentPerShot;
        this.shoot = shoot;

        this.currentEnergy = this.maxEnergy;
    }

    spendEnergy() {
        this.currentEnergy = Math.max(0, this.currentEnergy - this.energySpentPerShot);
    }
}