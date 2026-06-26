import { Scene } from 'phaser';
import { Player } from '../../player/Player';
import manageSpawn from './services/spawn/spawnService';
import { loadAssets } from '../main-menu/assetLoader/assetLoaderService';
import Phaser from 'phaser';
import Enemy from '../../enemies/Enemy';
import { EnemyProjectile } from '../../enemies/EnemyProjectile';
import Projectile from '../../player/projectiles/Projectile';
import CannonProjectile from '../../player/projectiles/CannonProjectile';

/**
 * Tipo comum recebido pelos callbacks de overlap da fisica Arcade.
 */
type ArcadeOverlapObject = Parameters<Phaser.Types.Physics.Arcade.ArcadePhysicsCallback>[0];

/**
 * Cena principal da partida.
 *
 * Coordena player, inimigos, projeteis, parallax, pontuacao, spawn e regras de
 * colisao entre os grupos fisicos.
 */
export class Game extends Scene
{
    private static readonly PARALLAX_FAR_SPEED = 0.1;
    private static readonly PARALLAX_NEAR_SPEED = 1.1;
    private static readonly PARALLAX_MIDDLE_SPEED = 0.5;
    private static readonly PARALLAX_VERY_FAR_SPEED = 0.05;

    camera: Phaser.Cameras.Scene2D.Camera;
    player: Player;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    backgroundFar: Phaser.GameObjects.TileSprite;
    backgroundNear: Phaser.GameObjects.TileSprite;
    backgroundMiddle: Phaser.GameObjects.TileSprite;
    backgroundVeryFar: Phaser.GameObjects.TileSprite;
    enemies: Phaser.Physics.Arcade.Group;
    playerProjectiles: Phaser.Physics.Arcade.Group;
    enemyProjectiles: Phaser.Physics.Arcade.Group;
    gameOst?: Phaser.Sound.BaseSound;
    score: number = 0;
    scoreText: Phaser.GameObjects.Text;

    /**
     * Registra a cena com a chave usada pelas transicoes do Phaser.
     */
    constructor ()
    {
        super('Game');
    }

    /**
     * Carrega todos os assets compartilhados do jogo.
     */
    preload () {
        loadAssets(this);
    }

    /**
     * Monta cenario, grupos fisicos, jogador, HUD de placar, audio e colisoes.
     */
    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x2A195C);

        const { width, height } = this.scale;

        this.backgroundFar = this.add.tileSprite(0, 0, width, height, 'bg-far');
        this.backgroundFar.setOrigin(0, 0);
        this.backgroundFar.setDepth(-20);

        this.backgroundNear = this.add.tileSprite(0, 0, width, height, 'bg-near');
        this.backgroundNear.setOrigin(0,-0.3);
        this.backgroundNear.setDepth(-10);

        this.backgroundMiddle = this.add.tileSprite(0, 0, width, height, 'bg-middle');
        this.backgroundMiddle.setOrigin(0,-0.18);
        this.backgroundMiddle.setDepth(-15);

        this.backgroundVeryFar = this.add.tileSprite(0, 0, width, height, 'bg-very-far');
        this.backgroundVeryFar.setOrigin(0, 0);
        this.backgroundVeryFar.setDepth(-25);

        this.enemies = this.physics.add.group();
        this.playerProjectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();

        this.player = new Player(this, 100, 450);
        this.player.setDepth(-1);
        this.cursors = this.input.keyboard?.createCursorKeys()!;

        this.createScoreText();
        this.playGameOst();
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.stopGameOst, this);

        this.physics.world.setBoundsCollision(true, false, true, true);
        this.configureCollisions();
    }

    /**
     * Atualiza spawn, parallax, grupos de entidades e jogador.
     *
     * @param time Tempo total da cena em milissegundos.
     * @param delta Tempo desde o ultimo frame em milissegundos.
     */
    update (time: number, delta: number) {
        const elapsedTimeInSeconds = Math.floor(time / 1000);

        manageSpawn(this, elapsedTimeInSeconds);

        const dt = delta / 1000;
        this.backgroundFar.tilePositionX += Game.PARALLAX_FAR_SPEED * 60 * dt;
        this.backgroundNear.tilePositionX += Game.PARALLAX_NEAR_SPEED * 60 * dt;
        this.backgroundMiddle.tilePositionX += Game.PARALLAX_MIDDLE_SPEED * 60 * dt;
        this.backgroundVeryFar.tilePositionX += Game.PARALLAX_VERY_FAR_SPEED * 60 * dt;
        this.updateGroup(this.enemies, time, delta);
        this.updateGroup(this.playerProjectiles, time, delta);
        this.updateGroup(this.enemyProjectiles, time, delta);
        this.player.update(this.cursors, this);
    }

    /**
     * Adiciona um inimigo ao grupo fisico controlado pela cena.
     */
    registerEnemy(enemy: Enemy): void
    {
        this.enemies.add(enemy);
    }

    /**
     * Adiciona um projetil do jogador ao grupo fisico monitorado por colisoes.
     */
    registerPlayerProjectile(projectile: Projectile): void
    {
        this.playerProjectiles.add(projectile);
    }

    /**
     * Adiciona um projetil inimigo ao grupo fisico monitorado por colisoes.
     */
    registerEnemyProjectile(projectile: EnemyProjectile): void
    {
        this.enemyProjectiles.add(projectile);
    }

    /**
     * Configura os overlaps que representam dano e contato entre entidades.
     */
    private configureCollisions(): void
    {
        this.physics.add.overlap(
            this.playerProjectiles,
            this.enemies,
            this.handlePlayerProjectileEnemyOverlap,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.enemyProjectiles,
            this.player,
            this.handleEnemyProjectilePlayerOverlap,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.enemies,
            this.player,
            this.handleEnemyPlayerOverlap,
            undefined,
            this
        );
    }

    /**
     * Chama `update` manualmente nos filhos ativos de um grupo Arcade.
     */
    private updateGroup(group: Phaser.Physics.Arcade.Group, time: number, delta: number): void
    {
        for (const child of group.getChildren())
        {
            if (!child.active)
            {
                continue;
            }

            const updatable = child as Phaser.GameObjects.GameObject & {
                update?: (time: number, delta: number) => void
            };

            updatable.update?.(time, delta);
        }
    }

    /**
     * Resolve dano de projeteis do jogador contra inimigos e atualiza score.
     */
    private handlePlayerProjectileEnemyOverlap(
        projectileObject: ArcadeOverlapObject,
        enemyObject: ArcadeOverlapObject
    ): void
    {
        const projectile = projectileObject as Projectile;
        const enemy = enemyObject as Enemy;

        let takeDamageResult: number | boolean;

        if (!projectile.active || !enemy.active)
        {
            return;
        }

        takeDamageResult = enemy.takeDamage(projectile.damage);

        if(typeof takeDamageResult === 'number') {
            if (projectile instanceof CannonProjectile) {
                this.score += takeDamageResult;
                this.score += projectile.explode(this.enemies, enemy);
                projectile.destroy();
                this.updateScoreText();
                return;
            }

            projectile.penetrationLeft -= 1;

            if (projectile.penetrationLeft <= 0) {
                projectile.destroy();
            }
            this.score += takeDamageResult;
        }

        this.updateScoreText();
    }

    /**
     * Resolve dano de projeteis inimigos contra o jogador.
     */
    private handleEnemyProjectilePlayerOverlap(
        _playerObject: ArcadeOverlapObject,
        projectileObject: ArcadeOverlapObject
    ): void
    {
        const projectile = projectileObject as EnemyProjectile;

        if (!projectile.active || !this.player.active)
        {
            return;
        }

        let dead: boolean = this.player.takeDamage(projectile.damage);
        if (dead)
        {
            this.callGameOver();
        }
        projectile.destroy();
    }

    /**
     * Resolve dano de contato entre inimigos e jogador.
     */
    private handleEnemyPlayerOverlap(
        _playerObject: ArcadeOverlapObject,
        enemyObject: ArcadeOverlapObject,
    ): void
    {
        const enemy = enemyObject as Enemy;

        if (!enemy.active || !this.player.active)
        {
            return;
        }

        enemy.tryContactDamage(this.player, this.time.now);
    }

    /**
     * Encerra a partida atual e envia o placar para a cena de Game Over.
     */
    private callGameOver(): void
    {
        this.scene.start('GameOver', { score: this.score });
    }

    /**
     * Inicia a musica de fundo da partida em loop.
     */
    private playGameOst(): void
    {
        this.gameOst = this.sound.add('game-ost', {
            loop: true,
        });

        this.gameOst.play();
    }

    /**
     * Para e remove a musica quando a cena e desligada.
     */
    private stopGameOst(): void
    {
        if (!this.gameOst)
        {
            return;
        }

        this.gameOst.stop();
        this.gameOst.destroy();
        this.gameOst = undefined;
    }

    /**
     * Cria o texto fixo que exibe a pontuacao atual.
     */
    private createScoreText(): void
    {
        const style = { font: '20px Arial', fill: '#fff' };
        this.scoreText = this.add.text(500, 150, `Score: ${this.score}`, style).setScrollFactor(0);
    }

    /**
     * Atualiza o texto do placar depois de mudancas de score.
     */
    private updateScoreText(): void
    {
        if (this.scoreText)
        {
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }
}
