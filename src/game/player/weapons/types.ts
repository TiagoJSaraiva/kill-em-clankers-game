import Phaser from "phaser";
import { Player } from "../Player";

type Name = "Pistol" | "Sword" | "Crossbow" | "Cannon";

export type Weapon = {
    name: Name,
    attackCooldown: number,
    spriteName: string,
    shoot: (scene: Phaser.Scene, player: Player) => void
}

export type Weapons = {
    Pistol: Weapon,
    Sword: Weapon,
    Crossbow: Weapon,
    Cannon: Weapon
}