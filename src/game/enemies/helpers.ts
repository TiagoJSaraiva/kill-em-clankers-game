// Funções auxiliares pra serem usados pelas classes de inimigos.

export function createEnemyLevels(name: string, healthPoints: number, collisionDamage: number, moveSpeed: number, spriteName: string) {
    /**
     * @description Factory function de EnemyLevels, que é um array que vai existir para cada classe de inimigo
     * e que contém objetos definindo cada variação desse inimigo, cada uma possuindo atributos e sprite diferentes.
     */

    return {
        name,
        healthPoints,
        collisionDamage,
        moveSpeed,
        spriteName
    }
}

export function getTexture(level: string, enemyLevels: ReturnType<typeof createEnemyLevels>[]) {
    for(let levelType of enemyLevels) {
        if(levelType.name == level) {
            return levelType.spriteName;
        }
    }
    return "default";
}

export function getAttributes(level: string, enemyLevels: ReturnType<typeof createEnemyLevels>[]) {
    for(let levelType of enemyLevels) {
        if(levelType.name == level) {
            return {
                healthPoints: levelType.healthPoints,
                collisionDamage: levelType.collisionDamage,
                moveSpeed: levelType.moveSpeed
            }
        }
    }
    return {
        healthPoints: 0,
        collisionDamage: 0,
        moveSpeed: 0
    }
}