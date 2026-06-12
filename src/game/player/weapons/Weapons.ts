import CannonProjectile from "../projectiles/CannonProjectile";
import PistolProjectile from "../projectiles/PistolProjectile";
import CrossbowProjectile from "../projectiles/CrossbowProjectile";
import SwordProjectile from "../projectiles/SwordProjectile";
import Phaser from "phaser";
import { Weapons } from "./types";
import { Player } from "../Player";
    
const weapons = {
    Pistol: {
        name: "Pistol",
        attackCooldown: 20,
        spriteName: 'player-pistol-model',
        shoot: (scene: Phaser.Scene, player: Player) => {
        new PistolProjectile(scene, player.x + 50, player.y - 40, 'player-pistol-projectile') }
    },
    Sword: {
        name: "Sword",
        attackCooldown: 40,
        spriteName: 'player-sword-model',
        shoot: (scene: Phaser.Scene, player: Player) => {
            player.showSwordAttackTexture(scene);
            new SwordProjectile(scene, player.x + 100, player.y - 20, 'slash-projectile');
        }
    },
    Crossbow: {
        name: "Crossbow",
        attackCooldown: 70,
        spriteName: 'player-crossbow-model',
        shoot: (scene: Phaser.Scene, player: Player) => {
            new CrossbowProjectile(scene, player.x + 70, player.y - 30, 'player-crossbow-projectile');
        }
    },
    Cannon: {
        name: "Cannon",
        attackCooldown: 100,
        spriteName: 'player-cannon-model',
        shoot: (scene: Phaser.Scene, player: Player) => {
            new CannonProjectile(scene, player.x + 50, player.y - 40, 'player-cannon-projectile');
        }
    }
} as Weapons;

export default weapons;