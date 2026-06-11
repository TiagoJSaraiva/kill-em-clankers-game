import ArrowProjectile from "../projectiles/ArrowProjectile";
import MissileProjectile from "../projectiles/MissileProjectile";
import PistolProjectile from "../projectiles/PistolProjectile";
import Phaser from "phaser";
import SlashProjectile from "../projectiles/SlashProjectile";
import { Player } from "../Player";

type Name = "Pistol" | "Sword" | "Rifle" | "Cannon";

type Weapon = {
    name: Name,
    attackCooldown: number,
    spriteName: string,
    shoot: (scene: Phaser.Scene, player: Player) => void
}

type Weapons = Weapon[]

function createWeapon(name: Name, attackCooldown: number, spriteName: string, shoot: (scene: Phaser.Scene, player: Player) => void): Weapon {
    return { 
        name,
        attackCooldown,
        spriteName,
        shoot
    };
}

const weapons = [
    createWeapon('Pistol', 25, 'player-pistol-model', (scene: Phaser.Scene, player: Player) => {
        new PistolProjectile(scene, player.x + 50, player.y - 40, 'player-pistol-projectile'); // Dispara um projétil de pistola saindo da posição do player
        new PistolProjectile(scene, player.x + 50, player.y - 50, 'player-pistol-projectile'); // Dispara um projétil de pistola saindo da posição do player
    }),
    createWeapon('Sword', 40, 'player-sword-model', (scene: Phaser.Scene, player: Player) => {
        player.showSwordAttackTexture(scene);
        new SlashProjectile(scene, player.x + 100, player.y - 20, 'slash-projectile'); // Dispara um projétil de slash saindo da posição do player
    }),
    createWeapon('Rifle', 70, 'player-crossbow-model', (scene: Phaser.Scene, player: Player) => {
        new ArrowProjectile(scene, player.x + 70, player.y - 30, 'player-crossbow-projectile'); // Dispara um projétil de flecha saindo da posição do player
    }),
    createWeapon('Cannon', 100, 'player-cannon-model', (scene: Phaser.Scene, player: Player) => {
        new MissileProjectile(scene, player.x + 50, player.y - 40, 'player-cannon-projectile'); // Dispara um projétil de míssil saindo da posição do player
    })
] as Weapons

export default weapons;