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
            35,
            5,
            10,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new PistolProjectile(scene, player.x + 50, player.y - 40, 'player-pistol-projectile', damage);
            }
        ),
        Sword: new Weapon(
            "Sword",
            40,
            10,
            20,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new SwordProjectile(scene, player.x + 100, player.y - 20, 'slash-projectile', damage);
            }
        ),
        Crossbow: new Weapon(
            "Crossbow",
            70,
            20,
            35,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new CrossbowProjectile(scene, player.x + 70, player.y - 30, 'player-crossbow-projectile', damage);
            }
        ),
        Cannon: new Weapon(
            "Cannon",
            100,
            20,
            50,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new CannonProjectile(scene, player.x + 50, player.y - 40, 'player-cannon-projectile', damage);
            }
        )
    };
}
