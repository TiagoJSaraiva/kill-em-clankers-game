// Funções auxiliares pra serem usados pelas classes de inimigos.

import { EnemyVariation, Attributes, VariationName } from "./types";

/**
 * Cria a configuracao de uma variante de inimigo.
 *
 * @param variationName Nome da variante.
 * @param texture Chave da textura ou spritesheet usada pela variante.
 * @param healthPoints Vida inicial.
 * @param damage Dano causado por ataque ou contato.
 * @param moveSpeed Velocidade de movimento.
 * @param scoreValue Pontos concedidos ao derrotar o inimigo.
 * @returns Objeto de variacao usado pelos helpers de textura e atributos.
 */
export function enemyVariation(variationName: VariationName, texture: string, healthPoints: number, damage: number, moveSpeed: number, scoreValue: number): EnemyVariation {
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
        scoreValue
    }
}

/**
 * Busca a textura associada a uma variacao dentro do catalogo do inimigo.
 *
 * @param variation Variacao solicitada.
 * @param enemyVariations Lista de variacoes suportadas por uma classe.
 * @returns Chave de textura correspondente ou `Default-Texture` como fallback.
 */
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

/**
 * Extrai os atributos numericos de uma variacao de inimigo.
 *
 * @param variation Variacao solicitada.
 * @param enemyVariations Lista de variacoes suportadas por uma classe.
 * @returns Atributos da variacao ou valores zerados quando nao encontrada.
 */
export function getAttributes(variation: VariationName, enemyVariations: EnemyVariation[]): Attributes {
    for(let variationType of enemyVariations) {
        if(variationType.variationName == variation) {
            return {
                healthPoints: variationType.healthPoints,
                damage: variationType.damage,
                moveSpeed: variationType.moveSpeed,
                scoreValue: variationType.scoreValue
            }
        }
    }
    return {
        healthPoints: 0,
        damage: 0,
        moveSpeed: 0,
        scoreValue: 0
    }
}
