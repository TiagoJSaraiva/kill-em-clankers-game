import ArrowProjectile from "../projectiles/ArrowProjectile";
import MissileProjectile from "../projectiles/MissileProjectile";
import PistolProjectile from "../projectiles/PistolProjectile";
import Phaser from "phaser";
import SlashProjectile from "../projectiles/SlashProjectile";
import { Player } from "../Player";

function createWeapon(name: string, attackCooldown: number, spriteName: string, shoot: (scene: Phaser.Scene, player: any) => void) {
    return { 
        name,
        attackCooldown,
        spriteName,
        shoot
    };
}

const Weapons = [
    createWeapon('Pistol', 25, 'player-pistol', (scene: Phaser.Scene, player: Player) => {
        new PistolProjectile(scene, player.x + 50, player.y - 40, 'pistol-projectile'); // Dispara um projétil de pistola saindo da posição do player
        new PistolProjectile(scene, player.x + 50, player.y - 50, 'pistol-projectile'); // Dispara um projétil de pistola saindo da posição do player
    }),
    createWeapon('Sword', 40, 'player-sword', (scene: Phaser.Scene, player: Player) => {
        player.showSwordAttackTexture(scene);
        new SlashProjectile(scene, player.x + 100, player.y - 20, 'slash-projectile'); // Dispara um projétil de slash saindo da posição do player
    }),
    createWeapon('Rifle', 70, 'player-rifle', (scene: Phaser.Scene, player: Player) => {
        new ArrowProjectile(scene, player.x + 70, player.y - 30, 'arrow-projectile'); // Dispara um projétil de flecha saindo da posição do player
    }),
    createWeapon('Cannon', 100, 'player-cannon', (scene: Phaser.Scene, player: Player) => {
        new MissileProjectile(scene, player.x + 50, player.y - 40, 'missile-projectile'); // Dispara um projétil de míssil saindo da posição do player
    })
]

export default Weapons;