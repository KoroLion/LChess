importScripts('../../lib/chess.js', '../chess-data.js', '../utils.js');

// WARNING: TWO THREADS MAY BREAK THIS COUNTER!
let positions = 0;

function minimax (game, depth, isMaximizingPlayer) {
    positions++;
    if (game.game_over()) {
        if (game.in_draw()) {
            return 0;
        } else {
            if (isMaximizingPlayer) {
                return -Infinity;
            } else {
                return +Infinity;
            }
        }
    }
    if (depth == 0) {
        return evaluateBoard(game.board());
    }

    let moves = game.ugly_moves();
    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            game.ugly_move(moves[i]);
            maxEval = Math.max(maxEval, minimax(game, depth - 1, false));
            game.undo();
        }
        return maxEval;
    } else {
        let maxEval = Infinity;
        for (let i = 0; i < moves.length; i++) {
            game.ugly_move(moves[i]);
            maxEval = Math.min(maxEval, minimax(game, depth - 1, true));
            game.undo();
        }
        return maxEval;
    }
}

function minimaxAi(game) {
    let moves = game.ugly_moves();
    let bestResult = Infinity;
    let bestMove;
    positions = 0;
    for (move of moves) {
        game.ugly_move(move);
        let result = minimax(game, 2, true);
        if (result <= bestResult) {
            bestResult = result;
            bestMove = move;
        }
        game.undo();
    }

    return [bestMove, positions];
}

this.addEventListener('message', function (e) {
    let game = new Chess();
    game.load(e.data);

    // WARNING AGAIN
    positions = 0;
    let move = minimaxAi(game);

    this.postMessage(move);
});
