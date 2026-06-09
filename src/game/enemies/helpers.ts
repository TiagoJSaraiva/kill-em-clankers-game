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
    /**
     * @description Função que recebe uma variação de inimigo e o array de variações do inimigo, 
     *              e retorna a textura correta para essa variação, procurando no array de variações do inimigo. 
     *              Por exemplo, se a variação for "normal", a função vai procurar no array de variações do inimigo qual é a textura associada à variação "normal"
     *              e retornar essa textura. Se a variação não for encontrada no array de variações do inimigo, a função retorna uma string "Default-Texture", 
     *              que pode ser usada como fallback para evitar erros em runtime.
     * 
     * @param variation: A variação do inimigo, por exemplo, "normal", "strong" ou "impossible".
     * @param enemyVariations: O array de variações do inimigo, que é um array de objetos do tipo EnemyVariation, e que existe para cada classe de inimigo, contendo as variações específicas daquela classe de inimigo.
     * 
     * @returns A textura associada à variação do inimigo, ou "Default-Texture" se a variação não for encontrada no array de variações do inimigo.
     */
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