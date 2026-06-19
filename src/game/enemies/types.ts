export type EnemyVariation = {
    variationName: VariationName,
    texture: string,
    healthPoints: number,
    damage: number,
    moveSpeed: number,
    scoreValue: number
}

export type VariationName = "normal" | "strong" | "impossible";

export type Attributes = {
    healthPoints: number,
    damage: number,
    moveSpeed: number
    scoreValue: number
}
