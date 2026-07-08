window.GoRules = (() => {
  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;

  function cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  function hashBoard(board) {
    return board.flat().join("");
  }

  function within(board, x, y) {
    const size = board.length;
    return x >= 0 && y >= 0 && x < size && y < size;
  }

  function neighbors(board, x, y) {
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ].filter((p) => within(board, p.x, p.y));
  }

  function getGroup(board, x, y) {
    const color = board[y][x];
    if (color === EMPTY) {
      return { stones: [], liberties: [] };
    }

    const stack = [{ x, y }];
    const visited = new Set();
    const stones = [];
    const liberties = new Map();

    while (stack.length) {
      const current = stack.pop();
      const key = `${current.x},${current.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      stones.push(current);

      for (const n of neighbors(board, current.x, current.y)) {
        const value = board[n.y][n.x];
        if (value === color) {
          const nKey = `${n.x},${n.y}`;
          if (!visited.has(nKey)) stack.push(n);
        } else if (value === EMPTY) {
          liberties.set(`${n.x},${n.y}`, n);
        }
      }
    }

    return { stones, liberties: [...liberties.values()] };
  }

  function removeGroup(board, group) {
    for (const stone of group.stones) {
      board[stone.y][stone.x] = EMPTY;
    }
  }

  function simulateMove(board, x, y, player, previousBoardHash = null) {
    if (!within(board, x, y)) return { valid: false, reason: "盤外です。", reasonKey: "outOfBounds" };
    if (board[y][x] !== EMPTY) {
      return { valid: false, reason: "その交点にはすでに石があります。", reasonKey: "occupied" };
    }

    const nextBoard = cloneBoard(board);
    nextBoard[y][x] = player;
    const enemy = player === BLACK ? WHITE : BLACK;
    let captured = [];

    for (const n of neighbors(board, x, y)) {
      if (nextBoard[n.y][n.x] !== enemy) continue;
      const enemyGroup = getGroup(nextBoard, n.x, n.y);
      if (enemyGroup.liberties.length === 0) {
        captured = captured.concat(enemyGroup.stones);
        removeGroup(nextBoard, enemyGroup);
      }
    }

    const ownGroup = getGroup(nextBoard, x, y);
    if (ownGroup.liberties.length === 0) {
      return { valid: false, reason: "自分の石の呼吸点がなくなるため、自殺手です。", reasonKey: "suicide" };
    }

    const nextHash = hashBoard(nextBoard);
    if (previousBoardHash && nextHash === previousBoardHash) {
      return { valid: false, reason: "コウです。同じ盤面をすぐには繰り返せません。", reasonKey: "ko", isKo: true };
    }

    return {
      valid: true,
      board: nextBoard,
      captured,
      nextHash,
      liberties: ownGroup.liberties,
    };
  }

  function getCapturePreview(board, player) {
    const size = board.length;
    const result = new Set();
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (board[y][x] !== EMPTY) continue;
        const sim = simulateMove(board, x, y, player, null);
        if (sim.valid && sim.captured.length > 0) {
          sim.captured.forEach((stone) => result.add(`${stone.x},${stone.y}`));
        }
      }
    }
    return result;
  }

  function getForbiddenMoves(board, player, previousBoardHash) {
    const size = board.length;
    const moves = new Set();
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (board[y][x] !== EMPTY) continue;
        const sim = simulateMove(board, x, y, player, previousBoardHash);
        if (!sim.valid) moves.add(`${x},${y}`);
      }
    }
    return moves;
  }

  return {
    EMPTY,
    BLACK,
    WHITE,
    cloneBoard,
    hashBoard,
    within,
    neighbors,
    getGroup,
    simulateMove,
    getCapturePreview,
    getForbiddenMoves,
  };
})();
