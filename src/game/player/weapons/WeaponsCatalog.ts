import CannonProjectile from "../projectiles/CannonProjectile";
import PistolProjectile from "../projectiles/PistolProjectile";
import CrossbowProjectile from "../projectiles/CrossbowProjectile";
import SwordProjectile from "../projectiles/SwordProjectile";
import Phaser from "phaser";
import type { Player } from "../Player";
import type { WeaponName } from "./types";
import Weapon from "./Weapon";

/**
 * Cria o catalogo completo de armas do jogador.
 *
 * Cada entrada define cooldown (em ms), custo de energia, dano e a factory do projetil
 * correspondente.
 *
 * @returns Mapa de armas indexado por nome logico.
 */
export function Weapons() : Record<WeaponName, Weapon> {
    return {
        Pistol: new Weapon(
            "Pistol",
            583,
            5,
            10,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new PistolProjectile(scene, player.x + 50, player.y - 20, 'player-pistol-projectile', damage);
            }
        ),
        Sword: new Weapon(
            "Sword",
            667,
            10,
            20,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new SwordProjectile(scene, player.x + 100, player.y - 20, 'slash-projectile', damage);
            }
        ),
        Crossbow: new Weapon(
            "Crossbow",
            1167,
            20,
            20,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new CrossbowProjectile(scene, player.x + 70, player.y - 30, 'player-crossbow-projectile', damage);
            }
        ),
        Cannon: new Weapon(
            "Cannon",
            1667,
            20,
            30,
            (scene: Phaser.Scene, player: Player, damage: number) => {
                return new CannonProjectile(scene, player.x + 50, player.y - 12, 'player-cannon-projectile', damage);
            }
        )
    };
}
