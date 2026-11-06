import Phaser from 'phaser';

/**
 * Parte visual de uma unidade que pode receber o efeito de dano.
 */
export type FlashTarget = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

// Tint so escurece a imagem, entao o clareamento mistura a cor original com
// branco por uma matriz de cor, aplicada apenas enquanto o efeito dura.
// Na ultima coluna, o Phaser espera deslocamentos de 0 a 255.
const whiteColorMatrix = [
    0, 0, 0, 0, 255,
    0, 0, 0, 0, 255,
    0, 0, 0, 0, 255,
    0, 0, 0, 1, 0
];
const flashPeakStrength = 0.55;
const flashHalfDuration = 110;

const explosionTextureKey = 'death-explosion';
const explosionAnimationKey = 'death-explosion';
const explosionFrameRate = 14;
const explosionFrameSize = 280;
const explosionVisibleSize = 273; // Maior medida visivel entre os quadros
// Os quadros nao estao centralizados nas celulas do arquivo. Recortar a partir
// do centro de cada desenho evita que a explosao salte entre um quadro e outro.
const explosionFrameCenters = [
    { x: 169, y: 212 },
    { x: 482, y: 212 },
    { x: 812, y: 212 },
    { x: 175, y: 577 },
    { x: 484, y: 578 },
    { x: 806, y: 575 }
];

const activeFlashes = new WeakMap<Phaser.GameObjects.GameObject, () => void>();

/**
 * Clareia as partes da unidade e as devolve a cor original.
 *
 * Sem WebGL nao ha matriz de cor, e a unidade apenas nao pisca.
 *
 * @param owner Unidade que recebeu o dano; um novo dano reinicia o efeito.
 * @param targets Partes visuais que devem clarear juntas.
 */
export function playHitFlash (owner: Phaser.GameObjects.Sprite, targets: FlashTarget[]): void
{
    activeFlashes.get(owner)?.();

    const effects = targets.flatMap((target) => {
        const effect = target.preFX?.addColorMatrix();

        if (!effect)
        {
            return [];
        }

        effect.set(whiteColorMatrix);
        effect.alpha = 0;
        return [effect];
    });

    if (effects.length === 0)
    {
        return;
    }

    const finish = () => {
        tween.remove();
        activeFlashes.delete(owner);
        targets.forEach((target) => target.preFX?.disable(true));
    };

    const tween = owner.scene.tweens.addCounter({
        from: 0,
        to: flashPeakStrength,
        duration: flashHalfDuration,
        ease: 'Quad.easeOut',
        yoyo: true,
        onUpdate: (counter) => {
            const strength = counter.getValue() ?? 0;
            effects.forEach((effect) => { effect.alpha = strength; });
        },
        onComplete: finish
    });

    activeFlashes.set(owner, finish);
}

/**
 * Toca a explosao de morte, com o desenho mais largo do tamanho da maior
 * dimensao do sprite da unidade.
 *
 * @param unit Unidade que morreu; precisa estar ativa ao chamar esta funcao.
 * @param onComplete Chamado quando a animacao termina.
 */
export function playDeathExplosion (unit: Phaser.GameObjects.Sprite, onComplete?: () => void): void
{
    const scene = unit.scene;

    createExplosionAnimation(scene);

    const longestSide = Math.max(unit.displayWidth, unit.displayHeight);
    const explosion = scene.add.sprite(unit.x, unit.y, explosionTextureKey, 'frame-0')
        .setScale(longestSide / explosionVisibleSize)
        .setDepth(unit.depth + 1);

    explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        explosion.destroy();
        onComplete?.();
    });
    explosion.play(explosionAnimationKey);
}

/**
 * Registra os quadros recortados e a animacao compartilhada da explosao.
 */
function createExplosionAnimation (scene: Phaser.Scene): void
{
    if (scene.anims.exists(explosionAnimationKey))
    {
        return;
    }

    const texture = scene.textures.get(explosionTextureKey);
    const half = explosionFrameSize / 2;

    explosionFrameCenters.forEach(({ x, y }, index) => {
        texture.add(`frame-${index}`, 0, x - half, y - half, explosionFrameSize, explosionFrameSize);
    });

    scene.anims.create({
        key: explosionAnimationKey,
        frames: explosionFrameCenters.map((_center, index) => ({
            key: explosionTextureKey,
            frame: `frame-${index}`
        })),
        frameRate: explosionFrameRate,
        repeat: 0
    });
}
