// todo: идеально поддающийся бот

let whiteTime = 0;
let whiteStartMoveTime = 0;
let blackTime = 0;
let blackStartMoveTime = 0;
let isWhiteTurn = true;

function updateBoard (animation = true) {
    let fen = game.fen()
    chessBoard.position(fen, animation);
    currentFen.innerHTML = fen;
    evaluation.innerHTML = evaluateBoard(game.board());

    if (game.game_over()) {
        if (game.in_checkmate()) {
            return alert('Checkmate!');
        } else if (game.in_draw()) {
            return alert('Draw!');
        } else {
            return alert('Game over!');
        }
    }
}

function updateTime() {
    let curTime = 0;
    if (isWhiteTurn) {
        if (whiteStartMoveTime) {
            curTime = performance.now() - whiteStartMoveTime;
        }
        whiteTimeSpan.innerHTML = formatTime(whiteTime + curTime);
    } else {
        if (blackStartMoveTime) {
            curTime = performance.now() - blackStartMoveTime;
        }
        blackTimeSpan.innerHTML = formatTime(blackTime + curTime);
    }
}
setInterval(updateTime, 500);

let minimaxAiWorker = new Worker('js/ais-workers/minimax.js');
minimaxAiWorker.addEventListener('message', function (e) {
    let move = e.data[0];
    let positions = e.data[1];

    game.ugly_move(move);

    let moveTime = performance.now() - blackStartMoveTime;
    blackTime += moveTime;
    blackStartMoveTime = 0;
    updateTime();

    positionsInfo.innerHTML = positions;
    timeInfo.innerHTML = (moveTime / 1000).toFixed(2);

    isWhiteTurn = true;
    whiteTimeTitle.style.fontWeight = 'bold';
    blackTimeTitle.style.fontWeight = 'normal';
    whiteStartMoveTime = performance.now();

    updateBoard();
});

function makeAiMove () {
    whiteTime += performance.now() - whiteStartMoveTime;
    whiteStartMoveTime = 0;
    updateTime();
    isWhiteTurn = false;
    whiteTimeTitle.style.fontWeight = 'normal';
    blackTimeTitle.style.fontWeight = 'bold';

    blackStartMoveTime = performance.now();
    minimaxAiWorker.postMessage(game.fen());
}

let game = new Chess();
//game.load('r1bqkbnr/pppppppp/2n5/8/3P4/4P3/PPP2PPP/RNBQKBNR b KQkq - 1 2');
//game.load('rkr5/8/8/8/8/8/8/6KQ w KQkq - 1 2');

board.addEventListener('touchmove', function (e) {
    e.preventDefault();
});
let chessBoard = ChessBoard('board', {
    pieceTheme: 'lib/chessboardjs/img/chesspieces/wikipedia/{piece}.png',
    draggable: true,

    onDragStart: function (source, piece, position, orientation) {
        if (game.game_over() || !isWhiteTurn) {
            return false;
        } else if (piece.search(/^b/) !== -1) {
            return false;
        }
    },
    onDrop: function (source, target) {
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q' // обмен пешки на ферзя в конце
        });
        let isMoveCompleted = move !== null;

        if (isMoveCompleted) {
            updateBoard(false);
            makeAiMove();
            updateBoard();
        } else {
            return 'snapback';
        }
    },
    onSnapEnd: function() {
        updateBoard();
    },
});

updateBoard();
whiteStartMoveTime = performance.now();
whiteTimeTitle.style.fontWeight = 'bold';
