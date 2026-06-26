
import Phaser from 'phaser';
import type { Player } from '../Player';
import Projectile from '../projectiles/Projectile';
import type { WeaponName } from './types';

/**
 * Cena que pode receber projeteis disparados pelo jogador.
 */
type PlayerProjectileScene = Phaser.Scene & {
    registerPlayerProjectile?: (projectile: Projectile) => void;
};

/**
 * Modelo de regra de uma arma do jogador.
 *
 * Controla energia, cooldown, dano e a factory responsavel por criar o
 * projetil especifico da arma.
 */
export default class Weapon {
    private static readonly pistolShotAudioKey = 'pistol-shot-audio';
    private static readonly swordAudioKey = 'sword-audio';

    private energyRegenRate: number = 0.05; // Quantidade de energia regenerada por frame quando a arma nao esta equipada
    isEquipped: boolean = false;
    maxEnergy: number = 100;
    currentEnergy: number;
    private energySpentPerShot: number = 20;
    damage: number;
    name: WeaponName;
    attackCooldown: number;
    private attackCooldownTimer: number = 0;
    emitProjectile: (scene: Phaser.Scene, player: Player, damage: number) => Projectile;
    
    /**
     * @param name Nome logico da arma.
     * @param attackCooldown Tempo em frames ate o proximo disparo.
     * @param energySpentPerShot Energia consumida por disparo.
     * @param damage Dano base aplicado pelo projetil.
     * @param emitProjectile Factory que instancia o projetil da arma.
     */
    constructor(
        name: WeaponName,
        attackCooldown: number,
        energySpentPerShot: number,
        damage: number,
        emitProjectile: (scene: Phaser.Scene, player: Player, damage: number) => Projectile
    ) {
        this.name = name;
        this.attackCooldown = attackCooldown;
        this.energySpentPerShot = energySpentPerShot;
        this.damage = damage;
        this.emitProjectile = emitProjectile;

        this.currentEnergy = this.maxEnergy;
    }

    /**
     * Atualiza cooldown e regeneracao de energia a cada frame.
     */
    update() {
        if (this.attackCooldownTimer > 0) {
            this.attackCooldownTimer--;
        }

        this.regenerateEnergy();
    }

    /**
     * Consome energia da arma respeitando o limite minimo de zero.
     */
    private spendEnergy() {
        this.currentEnergy = Math.max(0, this.currentEnergy - this.energySpentPerShot);
    }

    /**
     * Regenera energia apenas quando a arma nao esta equipada.
     */
    private regenerateEnergy() {
        if (this.isEquipped) {
            return; // Nao regenera energia enquanto a arma esta equipada
        }
        this.currentEnergy = Math.min(this.maxEnergy, this.currentEnergy + this.energyRegenRate);
    }

    /**
     * Tenta disparar a arma, criando e registrando o projetil quando possivel.
     *
     * @param scene Cena atual do jogo.
     * @param player Jogador usado como origem do disparo.
     * @returns `true` se o disparo foi executado; caso contrario, `false`.
     */
    tryShoot(scene: Phaser.Scene, player: Player): boolean {
        if (this.attackCooldownTimer > 0) {
            return false; // Ainda esta no cooldown, nao pode atirar
        }
        if(this.currentEnergy < this.energySpentPerShot) {
            console.log("Not enough energy to shoot!");
            return false;
        }
        this.spendEnergy();

        const projectile = this.emitProjectile(scene, player, this.damage);
        (scene as PlayerProjectileScene).registerPlayerProjectile?.(projectile);
        this.playShotAudio(scene);

        this.attackCooldownTimer = this.attackCooldown;
        return true;
    }

    /**
     * Reproduz o som associado ao tipo de arma quando o asset esta carregado.
     */
    private playShotAudio(scene: Phaser.Scene): void
    {
        const audioKey = this.name === 'Sword'
            ? Weapon.swordAudioKey
            : Weapon.pistolShotAudioKey;

        if (!scene.cache.audio.exists(audioKey))
        {
            return;
        }

        scene.sound.play(audioKey);
    }
}
