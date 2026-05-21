export function createEnemyLevels(name: string, healthPoints: number, collisionDamage: number, moveSpeed: number, spriteName: string) {
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