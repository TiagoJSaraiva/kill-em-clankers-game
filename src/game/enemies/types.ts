/**
 * Configuracao de uma variante especifica de inimigo.
 */
export type EnemyVariation = {
    variationName: VariationName,
    texture: string,
    healthPoints: number,
    damage: number,
    moveSpeed: number,
    scoreValue: number
}

/**
 * Identificadores de dificuldade/forca usados pelas variacoes de inimigos.
 */
export type VariationName = "normal" | "strong" | "impossible";

/**
 * Atributos aplicados a uma instancia de inimigo apos selecionar a variacao.
 */
export type Attributes = {
    healthPoints: number,
    damage: number,
    moveSpeed: number
    scoreValue: number
}
