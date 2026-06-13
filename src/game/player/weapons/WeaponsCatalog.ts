import CannonProjectile from "../projectiles/CannonProjectile";
import PistolProjectile from "../projectiles/PistolProjectile";
import CrossbowProjectile from "../projectiles/CrossbowProjectile";
import SwordProjectile from "../projectiles/SwordProjectile";
import Phaser from "phaser";
import type { Player } from "../Player";
import type { WeaponName } from "./types";
import Weapon from "./Weapon";

export function Weapons() : Record<WeaponName, Weapon> {
    return {
        Pistol: new Weapon(
            "Pistol",
            20,
            5,
            (scene: Phaser.Scene, player: Player) => {
                new PistolProjectile(scene, player.x + 50, player.y - 40, 'player-pistol-projectile');
            }
        ),
        Sword: new Weapon(
            "Sword",
            40,
            10,
            (scene: Phaser.Scene, player: Player) => {
                new SwordProjectile(scene, player.x + 100, player.y - 20, 'slash-projectile');
            }
        ),
        Crossbow: new Weapon(
            "Crossbow",
            70,
            20,
            (scene: Phaser.Scene, player: Player) => {
                new CrossbowProjectile(scene, player.x + 70, player.y - 30, 'player-crossbow-projectile');
            }
        ),
        Cannon: new Weapon(
            "Cannon",
            100,
            20,
            (scene: Phaser.Scene, player: Player) => {
                new CannonProjectile(scene, player.x + 50, player.y - 40, 'player-cannon-projectile');
            }
        )
    };
}
