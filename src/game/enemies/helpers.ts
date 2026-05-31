// Funções auxiliares pra serem usados pelas classes de inimigos.

import { EnemyVariation, Attributes } from "./types";

export function enemyVariation(name: string, healthPoints: number, damage: number, moveSpeed: number): EnemyVariation {
    /**
     * @description Factory function de EnemyVariations, que é um array que vai existir para cada classe de inimigo
     * e que contém objetos definindo cada variação desse inimigo, cada uma possuindo atributos e sprite diferentes.
     */

    return {
        name,
        healthPoints,
        damage,
        moveSpeed,
    }
}

export function getTexture(variation: string, enemyVariations: EnemyVariation[]): string {
    for(let variationType of enemyVariations) {
        if(variationType.name == variation) {
            return variationType.name;
        }
    }
    return "Default-Texture";
}

export function getAttributes(variation: string, enemyVariations: EnemyVariation[]): Attributes {
    for(let variationType of enemyVariations) {
        if(variationType.name == variation) {
            return {
                healthPoints: variationType.healthPoints,
                damage: variationType.damage,
                moveSpeed: variationType.moveSpeed
            }
        }
    }
    return {
        healthPoints: 0,
        damage: 0,
        moveSpeed: 0
    }
}