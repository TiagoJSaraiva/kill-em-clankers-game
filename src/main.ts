import StartGame from './game/main';

/**
 * Inicializa o jogo quando o container HTML ja esta disponivel no DOM.
 */
document.addEventListener('DOMContentLoaded', () => {

    StartGame('game-container');

});
