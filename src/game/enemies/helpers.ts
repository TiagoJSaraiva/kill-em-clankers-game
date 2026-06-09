// Funções auxiliares pra serem usados pelas classes de inimigos.

import { EnemyVariation, Attributes, VariationName } from "./types";

export function enemyVariation(variationName: VariationName, texture: string, healthPoints: number, damage: number, moveSpeed: number): EnemyVariation {
    /**
     * @description Factory function de EnemyVariations, que é um array que vai existir para cada classe de inimigo
     * e que contém objetos definindo cada variação desse inimigo, cada uma possuindo atributos e sprite diferentes.
     */

    return {
        variationName,
        texture,
        healthPoints,
        damage,
        moveSpeed,
    }
}

export function getTexture(variation: VariationName, enemyVariations: EnemyVariation[]): string {
    for(let variationType of enemyVariations) {
        if(variationType.variationName === variation) {
            return variationType.texture;
        }
    }
    return "Default-Texture";
}

export function getAttributes(variation: VariationName, enemyVariations: EnemyVariation[]): Attributes {
    for(let variationType of enemyVariations) {
        if(variationType.variationName == variation) {
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