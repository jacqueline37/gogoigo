(() => {
  const GoRules = window.GoRules;
  const stages = window.RULE_STAGES;
  const { BLACK, WHITE, EMPTY } = GoRules;

  const boardEl = document.getElementById("board");
  const stageIndicatorEl = document.getElementById("stage-indicator");
  const titleEl = document.getElementById("rule-title");
  const subtitleEl = document.getElementById("rule-subtitle");
  const descriptionEl = document.getElementById("rule-description");
  const objectiveEl = document.getElementById("rule-objective");
  const messageEl = document.getElementById("message");

  const prevBtn = document.getElementById("prev-btn");
  const retryBtn = document.getElementById("retry-btn");
  const nextBtn = document.getElementById("next-btn");

  if (!GoRules || !stages || !Array.isArray(stages) || stages.length === 0) {
    titleEl.textContent = "データが見つかりません";
    descriptionEl.textContent = "go-rules.js / rules-stages.js の読み込みに失敗している可能性があります。";
    return;
  }

  const state = {
    stageIndex: 0,
    board: [],
    currentPlayer: BLACK,
    stageCleared: false,
    lastBoardHash: null,
    koLessonStep: 0,
  };

  function stage() {
    return stages[state.stageIndex];
  }

  function setMessage(text, kind = "") {
    messageEl.textContent = text;
    messageEl.className = "message";
    if (kind) messageEl.classList.add(kind);
  }

  function resetStage() {
    const current = stage();
    state.board = GoRules.cloneBoard(current.board);
    state.currentPlayer = BLACK;
    state.stageCleared = false;
    state.lastBoardHash = null;
    state.koLessonStep = 0;
    nextBtn.disabled = true;
    setMessage(current.initialMessage || "交点をクリックしてください。");
    renderAll();
  }

  function loadStage(index) {
    state.stageIndex = Math.max(0, Math.min(index, stages.length - 1));
    const current = stage();
    stageIndicatorEl.textContent = `第${state.stageIndex + 1}問 / ${stages.length}`;
    titleEl.textContent = `${String(state.stageIndex + 1).padStart(2, "0")} ${current.title}`;
    subtitleEl.textContent = current.subtitle || "";
    descriptionEl.textContent = current.description || "";
    objectiveEl.textContent = current.objective || "";
    prevBtn.disabled = state.stageIndex === 0;
    resetStage();
  }

  function clearStage() {
    state.stageCleared = true;
    nextBtn.disabled = state.stageIndex >= stages.length - 1;
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

  function evaluateGoal(moveInfo = null) {
    const current = stage();
    const goal = current.goal;

    if (goal.type === "placeAt") {
      if (state.board[goal.y][goal.x] === BLACK) {
        clearStage();
        setMessage(current.successMessage || "成功です。", "success");
      }
      return;
    }

    if (goal.type === "captureCount") {
      if (moveInfo && moveInfo.captured.length >= goal.count) {
        clearStage();
        setMessage(current.successMessage || "成功です。", "success");
      }
      return;
    }

    if (goal.type === "koLesson") {
      if (state.koLessonStep === 1) {
        setMessage("白の番になりました。今度はすぐ取り返したくなる場所をクリックしてみてください。", "success");
        return;
      }
      if (state.koLessonStep === 2) {
        clearStage();
        setMessage(current.successMessage || "成功です。", "success");
      }
    }
  }

  function handleCellClick(x, y) {
    if (state.stageCleared) return;
    const current = stage();
    const goal = current.goal;

    if (goal.type === "attemptForbidden") {
      if (x === goal.x && y === goal.y) {
        clearStage();
        setMessage(current.successMessage || "その手は禁止されています。", "success");
        renderAll();
        return;
      }
      setMessage("今回は中央の禁止点をクリックして試してみましょう。", "error");
      return;
    }

    const previousBoardHash = state.lastBoardHash;
    const sim = GoRules.simulateMove(state.board, x, y, state.currentPlayer, previousBoardHash);

    if (!sim.valid) {
      if (
        sim.isKo &&
        goal.type === "koLesson" &&
        state.koLessonStep === 1 &&
        x === goal.secondMove.x &&
        y === goal.secondMove.y
      ) {
        state.koLessonStep = 2;
        evaluateGoal();
        renderAll();
        return;
      }
      setMessage(sim.reason, "error");
      return;
    }

    const beforeHash = GoRules.hashBoard(state.board);
    state.board = sim.board;
    state.lastBoardHash = beforeHash;

    if (goal.type === "koLesson") {
      if (
        state.koLessonStep === 0 &&
        x === goal.firstMove.x &&
        y === goal.firstMove.y &&
        sim.captured.length > 0
      ) {
        state.koLessonStep = 1;
        state.currentPlayer = WHITE;
      }
    }

    if (sim.captured.length > 0) {
      setMessage(`${sim.captured.length}個の石を取りました。`, "success");
    } else {
      setMessage("石を置きました。", "");
    }

    evaluateGoal(sim);
    renderAll();
  }

  function createStone(color) {
    const stone = document.createElement("div");
    stone.className = `stone ${color === BLACK ? "black" : "white"}`;
    return stone;
  }

  function findPrimaryStone(board) {
    for (let y = 0; y < board.length; y += 1) {
      for (let x = 0; x < board.length; x += 1) {
        if (board[y][x] !== EMPTY) return { x, y };
      }
    }
    return null;
  }

  function renderBoard() {
    const current = stage();
    const size = state.board.length;
    boardEl.innerHTML = "";
    boardEl.style.gridTemplateColumns = `repeat(${size}, var(--board-cell))`;

    const target = currentTarget();
    const capturePreview = state.stageCleared
      ? new Set()
      : GoRules.getCapturePreview(state.board, state.currentPlayer);
    const forbiddenMoves = state.stageCleared
      ? new Set()
      : GoRules.getForbiddenMoves(state.board, state.currentPlayer, state.lastBoardHash);

    const hintSource = current.hintStone || findPrimaryStone(state.board);
    const hintGroup =
      hintSource && state.board[hintSource.y][hintSource.x] !== EMPTY
        ? GoRules.getGroup(state.board, hintSource.x, hintSource.y)
        : null;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";

        if (y === 0) cell.classList.add("edge-top");
        if (y === size - 1) cell.classList.add("edge-bottom");
        if (x === 0) cell.classList.add("edge-left");
        if (x === size - 1) cell.classList.add("edge-right");

        cell.setAttribute("aria-label", `${x + 1}列 ${y + 1}行`);

        if (target && target.x === x && target.y === y && !state.stageCleared) {
          cell.classList.add("target");
        }

        if (forbiddenMoves.has(`${x},${y}`)) {
          cell.classList.add("forbidden");
        }

        if (capturePreview.has(`${x},${y}`)) {
          cell.classList.add("capture-preview");
        }

        if (
          hintGroup &&
          hintGroup.liberties.some((lib) => lib.x === x && lib.y === y)
        ) {
          const marker = document.createElement("div");
          marker.className = "liberty-highlight";
          cell.appendChild(marker);
        }

        if (state.board[y][x] !== EMPTY) {
          cell.appendChild(createStone(state.board[y][x]));
        }

        cell.addEventListener("click", () => handleCellClick(x, y));
        boardEl.appendChild(cell);
      }
    }
  }

  function updateButtons() {
    prevBtn.disabled = state.stageIndex === 0;
    nextBtn.disabled = !state.stageCleared || state.stageIndex === stages.length - 1;
  }

  function renderAll() {
    renderBoard();
    updateButtons();
  }

  function goPrev() {
    if (state.stageIndex <= 0) return;
    loadStage(state.stageIndex - 1);
  }

  function goNext() {
    if (state.stageIndex >= stages.length - 1) return;
    loadStage(state.stageIndex + 1);
  }

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
  retryBtn.addEventListener("click", resetStage);

  loadStage(0);
})();
