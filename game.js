(() => {
  const BOARD_SIZE = 5;
  const STORAGE_KEY = "go-rule-learning-progress-v1";
  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;

  const state = {
    stageIndex: 0,
    board: [],
    initialBoard: [],
    currentPlayer: BLACK,
    moveCount: 0,
    capturedThisMove: 0,
    totalCaptured: 0,
    stageCleared: false,
    showHints: true,
    showCoords: false,
    message: "",
    koHistory: [],
    lastBoardHash: null,
    koLessonStep: 0,
    lastForbiddenAttempt: null,
  };

  const el = {
    board: document.getElementById("board"),
    stageNumber: document.getElementById("stage-number"),
    stageTitle: document.getElementById("stage-title"),
    stageSubtitle: document.getElementById("stage-subtitle"),
    stageDescription: document.getElementById("stage-description"),
    objective: document.getElementById("objective"),
    message: document.getElementById("message"),
    nextBtn: document.getElementById("next-btn"),
    prevBtn: document.getElementById("prev-btn"),
    retryBtn: document.getElementById("retry-btn"),
    hintToggle: document.getElementById("hint-toggle"),
    coordToggle: document.getElementById("coord-toggle"),
    resetProgressBtn: document.getElementById("reset-progress-btn"),
  };

  function cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  function hashBoard(board) {
    return board.flat().join("");
  }

  function within(x, y) {
    return x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE;
  }

  function neighbors(x, y) {
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ].filter((p) => within(p.x, p.y));
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

      for (const n of neighbors(current.x, current.y)) {
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
    if (!within(x, y)) return { valid: false, reason: "盤外です。" };
    if (board[y][x] !== EMPTY) return { valid: false, reason: "その交点にはすでに石があります。" };

    const nextBoard = cloneBoard(board);
    nextBoard[y][x] = player;
    const enemy = player === BLACK ? WHITE : BLACK;
    let captured = [];

    for (const n of neighbors(x, y)) {
      if (nextBoard[n.y][n.x] !== enemy) continue;
      const enemyGroup = getGroup(nextBoard, n.x, n.y);
      if (enemyGroup.liberties.length === 0) {
        captured = captured.concat(enemyGroup.stones);
        removeGroup(nextBoard, enemyGroup);
      }
    }

    const ownGroup = getGroup(nextBoard, x, y);
    if (ownGroup.liberties.length === 0) {
      return { valid: false, reason: "自分の石の呼吸点がなくなるため、自殺手です。" };
    }

    const nextHash = hashBoard(nextBoard);
    if (previousBoardHash && nextHash === previousBoardHash) {
      return { valid: false, reason: "コウです。同じ盤面をすぐには繰り返せません。", isKo: true };
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
    const result = new Set();
    for (let y = 0; y < BOARD_SIZE; y += 1) {
      for (let x = 0; x < BOARD_SIZE; x += 1) {
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
    const moves = new Set();
    for (let y = 0; y < BOARD_SIZE; y += 1) {
      for (let x = 0; x < BOARD_SIZE; x += 1) {
        if (board[y][x] !== EMPTY) continue;
        const sim = simulateMove(board, x, y, player, previousBoardHash);
        if (!sim.valid) moves.add(`${x},${y}`);
      }
    }
    return moves;
  }

  function loadProgress() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const saved = Number.parseInt(raw, 10);
    return Number.isNaN(saved) ? 0 : Math.max(0, Math.min(saved, window.STAGES.length - 1));
  }

  function saveProgress() {
    const unlocked = Math.max(loadProgress(), state.stageIndex + (state.stageCleared ? 1 : 0));
    localStorage.setItem(STORAGE_KEY, String(Math.min(unlocked, window.STAGES.length - 1)));
  }

  function stage() {
    return window.STAGES[state.stageIndex];
  }

  function setMessage(text, kind = "") {
    state.message = text;
    el.message.textContent = text;
    el.message.className = `message ${kind}`.trim();
  }

  function resetStage() {
    const current = stage();
    state.board = cloneBoard(current.board);
    state.initialBoard = cloneBoard(current.board);
    state.currentPlayer = BLACK;
    state.moveCount = 0;
    state.capturedThisMove = 0;
    state.totalCaptured = 0;
    state.stageCleared = false;
    state.koHistory = [hashBoard(state.board)];
    state.lastBoardHash = null;
    state.koLessonStep = 0;
    state.lastForbiddenAttempt = null;
    el.nextBtn.disabled = true;
    setMessage(current.initialMessage || "交点をクリックしてください。");
    updateUI();
  }

  function loadStage(index) {
    state.stageIndex = Math.max(0, Math.min(index, window.STAGES.length - 1));
    const current = stage();
    el.stageNumber.textContent = `${current.id} / ${window.STAGES.length}`;
    el.stageTitle.textContent = current.title;
    el.stageSubtitle.textContent = current.subtitle;
    el.stageDescription.textContent = current.description;
    el.objective.textContent = current.objective;
    el.prevBtn.disabled = state.stageIndex === 0;
    resetStage();
  }

  function clearStage() {
    state.stageCleared = true;
    el.nextBtn.disabled = state.stageIndex >= window.STAGES.length - 1 ? true : false;
    saveProgress();
  }

  function evaluateGoal(moveInfo = null) {
    const goal = stage().goal;
    if (!goal) return;

    if (goal.type === "placeAt") {
      if (state.board[goal.y][goal.x] === BLACK) {
        clearStage();
        setMessage("成功です。目標地点に黒石を置けました。", "success");
      }
      return;
    }

    if (goal.type === "captureCount") {
      if (moveInfo && moveInfo.captured.length >= goal.count) {
        clearStage();
        setMessage(`成功です。白石を ${moveInfo.captured.length} 個取りました。`, "success");
      }
      return;
    }

    if (goal.type === "attemptForbidden") {
      return;
    }

    if (goal.type === "koLesson") {
      if (state.koLessonStep === 1) {
        setMessage("白の番になりました。今度はすぐ取り返したくなる場所をクリックしてみてください。", "success");
        return;
      }
      if (state.koLessonStep === 2) {
        clearStage();
        setMessage("成功です。コウでは同じ盤面をすぐに繰り返せません。", "success");
      }
    }
  }

  function currentTarget() {
    const current = stage();
    if (current.goal.type === "koLesson") {
      if (state.koLessonStep === 0) return current.goal.firstMove;
      if (state.koLessonStep === 1) return current.goal.secondMove;
      return null;
    }
    return current.target || null;
  }

  function onIntersectionClick(x, y) {
    if (state.stageCleared) return;
    const current = stage();
    const goal = current.goal;

    if (goal.type === "attemptForbidden") {
      if (x === goal.x && y === goal.y) {
        state.lastForbiddenAttempt = { x, y };
        clearStage();
        setMessage("その手は自殺手なので禁止です。置いた瞬間に黒石の呼吸点が0になってしまいます。", "success");
        updateUI();
        return;
      }
      setMessage("今回は中央の禁止手を試してみましょう。", "error");
      return;
    }

    const previousBoardHash = state.lastBoardHash;
    const sim = simulateMove(state.board, x, y, state.currentPlayer, previousBoardHash);

    if (!sim.valid) {
      if (sim.isKo && goal.type === "koLesson" && state.koLessonStep === 1 && x === goal.secondMove.x && y === goal.secondMove.y) {
        state.koLessonStep = 2;
        evaluateGoal();
        updateUI();
        return;
      }
      setMessage(sim.reason, "error");
      return;
    }

    const beforeHash = hashBoard(state.board);
    state.board = sim.board;
    state.moveCount += 1;
    state.capturedThisMove = sim.captured.length;
    state.totalCaptured += sim.captured.length;
    state.lastBoardHash = beforeHash;
    state.koHistory.push(sim.nextHash);

    if (goal.type === "koLesson") {
      if (state.koLessonStep === 0 && x === goal.firstMove.x && y === goal.firstMove.y && sim.captured.length > 0) {
        state.koLessonStep = 1;
        state.currentPlayer = WHITE;
      }
    }

    if (sim.captured.length > 0) {
      setMessage(`白石を ${sim.captured.length} 個取りました。`, "success");
    } else {
      setMessage("黒石を置きました。", "");
    }

    evaluateGoal(sim);
    updateUI();
  }

  function drawBoard() {
    el.board.innerHTML = "";
    const padding = 32;
    const usable = 100 - (padding / el.board.clientWidth) * 200;
    const step = usable / (BOARD_SIZE - 1);

    for (let i = 0; i < BOARD_SIZE; i += 1) {
      const vertical = document.createElement("div");
      vertical.className = "grid-line vertical";
      vertical.style.left = `calc(${padding}px + (${i} * ((100% - ${padding * 2}px) / ${BOARD_SIZE - 1})))`;
      el.board.appendChild(vertical);

      const horizontal = document.createElement("div");
      horizontal.className = "grid-line horizontal";
      horizontal.style.top = `calc(${padding}px + (${i} * ((100% - ${padding * 2}px) / ${BOARD_SIZE - 1})))`;
      el.board.appendChild(horizontal);
    }

    const star = document.createElement("div");
    star.className = "star-point";
    star.style.left = "50%";
    star.style.top = "50%";
    el.board.appendChild(star);

    const capturePreview = getCapturePreview(state.board, state.currentPlayer);
    const forbiddenMoves = getForbiddenMoves(state.board, state.currentPlayer, state.lastBoardHash);
    const target = currentTarget();

    for (let y = 0; y < BOARD_SIZE; y += 1) {
      for (let x = 0; x < BOARD_SIZE; x += 1) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "intersection";
        btn.style.left = `calc(${padding}px + (${x} * ((100% - ${padding * 2}px) / ${BOARD_SIZE - 1})))`;
        btn.style.top = `calc(${padding}px + (${y} * ((100% - ${padding * 2}px) / ${BOARD_SIZE - 1})))`;
        btn.addEventListener("click", () => onIntersectionClick(x, y));

        if (target && target.x === x && target.y === y && !state.stageCleared) {
          btn.classList.add("target");
        }

        if (forbiddenMoves.has(`${x},${y}`) && state.board[y][x] === EMPTY) {
          btn.classList.add("forbidden");
        }

        if (state.board[y][x] !== EMPTY) {
          const stone = document.createElement("div");
          stone.className = `stone ${state.board[y][x] === BLACK ? "black" : "white"}`;
          btn.appendChild(stone);
        }

        if (capturePreview.has(`${x},${y}`)) {
          btn.classList.add("capture-preview");
        }

        if (state.showCoords) {
          const coord = document.createElement("span");
          coord.className = "coord-label";
          coord.textContent = `${String.fromCharCode(65 + x)}${y + 1}`;
          coord.style.top = "-14px";
          btn.appendChild(coord);
        }

        el.board.appendChild(btn);
      }
    }

    if (state.showHints) {
      const currentStage = stage();
      const hintSource = currentStage.hintStone || findPrimaryBlackStone();
      if (hintSource) {
        const group = getGroup(state.board, hintSource.x, hintSource.y);
        group.liberties.forEach((liberty) => {
          const marker = document.createElement("div");
          marker.className = "liberty-marker";
          marker.style.left = `calc(${padding}px + (${liberty.x} * ((100% - ${padding * 2}px) / ${BOARD_SIZE - 1})))`;
          marker.style.top = `calc(${padding}px + (${liberty.y} * ((100% - ${padding * 2}px) / ${BOARD_SIZE - 1})))`;
          el.board.appendChild(marker);
        });
      }
    }
  }

  function findPrimaryBlackStone() {
    for (let y = 0; y < BOARD_SIZE; y += 1) {
      for (let x = 0; x < BOARD_SIZE; x += 1) {
        if (state.board[y][x] === BLACK) return { x, y };
      }
    }
    return null;
  }

  function updateUI() {
    drawBoard();
    el.stageNumber.textContent = `${stage().id} / ${window.STAGES.length}`;
    el.prevBtn.disabled = state.stageIndex === 0;
    el.nextBtn.disabled = !state.stageCleared || state.stageIndex === window.STAGES.length - 1;
  }

  function bindEvents() {
    el.retryBtn.addEventListener("click", resetStage);
    el.prevBtn.addEventListener("click", () => loadStage(state.stageIndex - 1));
    el.nextBtn.addEventListener("click", () => loadStage(state.stageIndex + 1));
    el.hintToggle.addEventListener("change", (e) => {
      state.showHints = e.target.checked;
      updateUI();
    });
    el.coordToggle.addEventListener("change", (e) => {
      state.showCoords = e.target.checked;
      updateUI();
    });
    el.resetProgressBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      loadStage(0);
      setMessage("進行状況をリセットしました。", "success");
    });
    window.addEventListener("resize", updateUI);
  }

  function init() {
    bindEvents();
    state.showHints = true;
    state.showCoords = false;
    loadStage(loadProgress());
  }

  init();
})();
