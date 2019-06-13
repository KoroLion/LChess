function formatTime(ms) {
    let s = ms / 1000;
    let m = Math.floor(s / 60);
    if (m < 10) {
        m = '0' + m;
    }
    s -= m * 60;
    s = Math.floor(s);
    if (s < 10) {
        s = '0' + s;
    }
    return m + ':' + s;
}

function evaluateBoard (board) {
    let evaluation = 0, cost, i, j, square;
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            square = board[i][j];
            if (square) { // (if square has piece on it)
                let cost = piecesCost[square.type];
                if (square.color == 'w') {
                    evaluation += cost;
                } else {
                    evaluation -= cost;
                }
            }
        }
    }
    return evaluation;
}
