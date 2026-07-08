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
  const langToggleBtn = document.getElementById("lang-toggle-btn");

  const eyebrowEl = document.getElementById("page-eyebrow");
  const siteTitleEl = document.getElementById("site-title");
  const siteLeadEl = document.getElementById("site-lead");
  const indexLinkEl = document.getElementById("index-link");
  const sectionLabelEl = document.getElementById("section-label");

  function lang() {
    return window.I18N ? window.I18N.getLang() : "ja";
  }

  function t() {
    return window.I18N ? window.I18N.ui[lang()].rules : null;
  }

  function tc() {
    return window.I18N ? window.I18N.ui[lang()].common : null;
  }

  function ruleText(stage) {
    if (lang() === "en" && window.I18N && window.I18N.rulesContent.en[stage.id]) {
      return window.I18N.rulesContent.en[stage.id];
    }
    return stage;
  }

  function localizeReason(sim) {
    if (window.I18N && sim.reasonKey) {
      const dict = window.I18N.goRules[lang()];
      if (dict && dict[sim.reasonKey]) return dict[sim.reasonKey];
    }
    return sim.reason;
  }

  if (!GoRules || !stages || !Array.isArray(stages) || stages.length === 0) {
    const strings = t() || { dataMissingTitle: "データが見つかりません", dataMissingDesc: "go-rules.js / rules-stages.js の読み込みに失敗している可能性があります。" };
    titleEl.textContent = strings.dataMissingTitle;
    descriptionEl.textContent = strings.dataMissingDesc;
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
    setMessage(ruleText(current).initialMessage || t().defaultInitialMessage);
    renderAll();
  }

  function loadStage(index) {
    state.stageIndex = Math.max(0, Math.min(index, stages.length - 1));
    refreshStageTexts();
    prevBtn.disabled = state.stageIndex === 0;
    resetStage();
  }

  function refreshStageTexts() {
    const current = stage();
    const text = ruleText(current);
    stageIndicatorEl.textContent = t().stageIndicator(state.stageIndex + 1, stages.length);
    titleEl.textContent = `${String(state.stageIndex + 1).padStart(2, "0")} ${text.title}`;
    subtitleEl.textContent = text.subtitle || "";
    descriptionEl.textContent = text.description || "";
    objectiveEl.textContent = text.objective || "";
  }

  function clearStage() {
    state.stageCleared = true;
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

  function evaluateGoal(moveInfo = null, x = null, y = null) {
    const current = stage();
    const text = ruleText(current);
    const goal = current.goal;

    if (goal.type === "placeAt") {
      if (state.board[goal.y][goal.x] === BLACK) {
        clearStage();
        setMessage(text.successMessage || t().defaultSuccessMessage, "success");
      }
      return;
    }

    if (goal.type === "captureCount") {
      const atTarget = !current.target || (x === current.target.x && y === current.target.y);
      if (moveInfo && atTarget && moveInfo.captured.length >= goal.count) {
        clearStage();
        setMessage(text.successMessage || t().defaultSuccessMessage, "success");
      }
      return;
    }

    if (goal.type === "koLesson") {
      if (state.koLessonStep === 1) {
        setMessage(t().koWhiteTurnMessage, "success");
        return;
      }
      if (state.koLessonStep === 2) {
        clearStage();
        setMessage(text.successMessage || t().defaultSuccessMessage, "success");
      }
    }
  }

  function handleCellClick(x, y) {
    if (state.stageCleared) return;
    const current = stage();
    const text = ruleText(current);
    const goal = current.goal;

    if (goal.type === "attemptForbidden") {
      if (x === goal.x && y === goal.y) {
        clearStage();
        setMessage(text.successMessage || t().forbiddenSuccessFallback, "success");
        renderAll();
        return;
      }
      setMessage(t().forbiddenHintMessage, "error");
      return;
    }

    if (goal.type === "koLesson" && (state.koLessonStep === 0 || state.koLessonStep === 1)) {
      const expected = currentTarget();
      if (!expected || x !== expected.x || y !== expected.y) {
        setMessage(t().koHintMessage, "error");
        return;
      }
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
      setMessage(localizeReason(sim), "error");
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
      setMessage(t().capturedMessage(sim.captured.length), "success");
    } else {
      setMessage(t().placedMessage, "");
    }

    evaluateGoal(sim, x, y);
    renderAll();
  }

  function createStone(color) {
    return window.BoardUI.createStone(color === BLACK ? "black" : "white");
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
    boardEl.setAttribute("aria-label", tc().boardAriaLabel);
    const cellSize = window.BoardUI.computeCellSize(boardEl, size);
    boardEl.style.setProperty("--board-cell", `${cellSize}px`);
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

        window.BoardUI.applyEdgeClasses(cell, x, y, size);

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

  function applyStaticUI() {
    const strings = t();
    const common = tc();

    document.documentElement.lang = lang();
    document.title = strings.pageTitle;

    if (eyebrowEl) eyebrowEl.textContent = strings.eyebrow;
    if (siteTitleEl) siteTitleEl.textContent = strings.h1;
    if (siteLeadEl) siteLeadEl.textContent = strings.lead;
    if (indexLinkEl) indexLinkEl.textContent = strings.indexLink;
    if (sectionLabelEl) sectionLabelEl.textContent = strings.sectionLabel;

    prevBtn.textContent = common.prev;
    nextBtn.textContent = common.next;
    retryBtn.textContent = strings.retry;

    if (langToggleBtn) {
      langToggleBtn.textContent = common.langToggleLabel;
      langToggleBtn.setAttribute("aria-label", common.langToggleAriaLabel);
    }
  }

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
  retryBtn.addEventListener("click", resetStage);

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      if (!window.I18N) return;
      window.I18N.toggleLang();
      applyStaticUI();
      refreshStageTexts();
      renderAll();
    });
  }

  window.addEventListener("resize", () => {
    renderBoard();
  });

  applyStaticUI();
  loadStage(0);
})();
