// Funções auxiliares pra serem usados pelas classes de inimigos.

export function createEnemyVariations(name: string, healthPoints: number, damage: number, moveSpeed: number, spriteName: string) {
    /**
     * @description Factory function de EnemyLevels, que é um array que vai existir para cada classe de inimigo
     * e que contém objetos definindo cada variação desse inimigo, cada uma possuindo atributos e sprite diferentes.
     */

    return {
        name,
        healthPoints,
        damage,
        moveSpeed,
        spriteName
    }
}

export function getTexture(level: string, enemyLevels: ReturnType<typeof createEnemyVariations>[]) {
    for(let levelType of enemyLevels) {
        if(levelType.name == level) {
            return levelType.spriteName;
        }
    }
    return "default";
}

export function getAttributes(level: string, enemyLevels: ReturnType<typeof createEnemyVariations>[]) {
    for(let levelType of enemyLevels) {
        if(levelType.name == level) {
            return {
                healthPoints: levelType.healthPoints,
                damage: levelType.damage,
                moveSpeed: levelType.moveSpeed
            }
        }
    }
    return {
        healthPoints: 0,
        damage: 0,
        moveSpeed: 0
    }
}