(() => {
  const boardEl = document.getElementById("board");
  const titleEl = document.getElementById("term-title");
  const descriptionEl = document.getElementById("term-description");
  const instructionEl = document.getElementById("term-instruction");
  const messageEl = document.getElementById("message");
  const consequenceEl = document.getElementById("consequence");
  const stageIndicatorEl = document.getElementById("stage-indicator");
  const termListEl = document.getElementById("term-list");

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const resetBtn = document.getElementById("reset-btn");
  const restartBtn = document.getElementById("restart-btn");
  const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
  const sidebarEl = document.getElementById("sidebar");
  const langToggleBtn = document.getElementById("lang-toggle-btn");

  const eyebrowEl = document.getElementById("page-eyebrow");
  const siteTitleEl = document.getElementById("site-title");
  const siteLeadEl = document.getElementById("site-lead");
  const rulesLinkEl = document.getElementById("rules-link");
  const sidebarTitleEl = document.getElementById("sidebar-title");
  const sidebarNoteEl = document.getElementById("sidebar-note");
  const sectionLabelEl = document.getElementById("section-label");

  function lang() {
    return window.I18N ? window.I18N.getLang() : "ja";
  }

  function t() {
    return window.I18N ? window.I18N.ui[lang()].index : null;
  }

  function tc() {
    return window.I18N ? window.I18N.ui[lang()].common : null;
  }

  function stageText(stage) {
    if (lang() === "en" && window.I18N && window.I18N.terms.en[stage.id]) {
      return window.I18N.terms.en[stage.id];
    }
    return stage;
  }

  if (!window.STAGES || !Array.isArray(window.STAGES) || window.STAGES.length === 0) {
    const strings = t() || { dataMissingTitle: "データが見つかりません", dataMissingDesc: "stages.js の読み込みに失敗している可能性があります。" };
    titleEl.textContent = strings.dataMissingTitle;
    descriptionEl.textContent = strings.dataMissingDesc;
    return;
  }

  const stages = window.STAGES;

  let currentStageIndex = 0;
  let userMove = null;
  let solvedMap = new Map();
  let autoNextTimer = null;
  let lastLiberties = [];
  let lastCaptured = [];
  let isSidebarOpen = false;

  function sameCoord(a, b) {
    return a && b && a.x === b.x && a.y === b.y;
  }

  function buildBoardArray(stage) {
    const size = stage.boardSize || 9;
    const board = Array.from({ length: size }, () => Array(size).fill(window.GoRules.EMPTY));
    (stage.stones || []).forEach((s) => {
      board[s.y][s.x] = s.color === "white" ? window.GoRules.WHITE : window.GoRules.BLACK;
    });
    return board;
  }

  function getCurrentStage() {
    return stages[currentStageIndex];
  }

  function clearAutoNextTimer() {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      autoNextTimer = null;
    }
  }

  function buildTermList() {
    termListEl.innerHTML = "";

    stages.forEach((stage, index) => {
      const btn = document.createElement("button");
      btn.className = "term-item";
      btn.type = "button";

      const solved = solvedMap.get(stage.id) ? "✓ " : "";
      btn.innerHTML = `
        <span class="term-index">${String(index + 1).padStart(2, "0")}</span>
        <span>${solved}${stageText(stage).title}</span>
      `;

      if (index === currentStageIndex) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        clearAutoNextTimer();
        currentStageIndex = index;
        userMove = null;
        lastLiberties = [];
        lastCaptured = [];
        setMessage("", "");
        renderAll();
        closeSidebarOnMobile();
      });

      termListEl.appendChild(btn);
    });
  }

  function setMessage(text, type = "") {
    messageEl.textContent = text;
    messageEl.className = "message";
    if (type) {
      messageEl.classList.add(type);
    }
  }

  function renderHeader() {
    const solvedCount = solvedMap.size;
    stageIndicatorEl.textContent = t().stageIndicator(currentStageIndex + 1, stages.length, solvedCount);
  }

  function renderInfo() {
    const stage = getCurrentStage();
    const text = stageText(stage);
    titleEl.textContent = `${String(currentStageIndex + 1).padStart(2, "0")} ${text.title}`;
    descriptionEl.textContent = text.description || "";
    instructionEl.textContent = text.instruction || t().defaultInstruction;
  }

  function getStoneAt(stage, x, y) {
    return (stage.stones || []).find((s) => s.x === x && s.y === y);
  }

  function shouldShowStarPoint(size, x, y) {
    if (size !== 9) return false;
    const points = [
      [2, 2], [2, 6], [6, 2], [6, 6], [4, 4]
    ];
    return points.some(([px, py]) => px === x && py === y);
  }

  function handleCellClick(x, y) {
    const stage = getCurrentStage();
    const text = stageText(stage);

    if (solvedMap.get(stage.id)) return;

    const occupied = getStoneAt(stage, x, y);

    if (occupied) return;

    clearAutoNextTimer();
    userMove = { x, y };

    if (sameCoord(userMove, stage.answer)) {
      solvedMap.set(stage.id, true);
      setMessage(text.successMessage || t().defaultSuccess, "success");

      const board = buildBoardArray(stage);
      const player = stage.player === "white" ? window.GoRules.WHITE : window.GoRules.BLACK;
      const sim = window.GoRules.simulateMove(board, stage.answer.x, stage.answer.y, player);
      lastLiberties = sim.valid ? sim.liberties : [];
      lastCaptured = sim.valid ? sim.captured : [];

      renderBoard();
      buildTermList();
      updateButtons();
      renderHeader();

      if (currentStageIndex < stages.length - 1) {
        autoNextTimer = setTimeout(() => {
          goNext();
        }, 2200);
      }

      return;
    }

    lastLiberties = [];
    lastCaptured = [];

    setMessage(text.failureMessage || t().defaultFailure, "error");

    renderBoard();
    buildTermList();
    updateButtons();
  }

  function renderBoard() {
    const stage = getCurrentStage();
    const size = stage.boardSize || 9;
    boardEl.innerHTML = "";
    boardEl.setAttribute("aria-label", tc().boardAriaLabel);
    const cellSize = window.BoardUI.computeCellSize(boardEl, size);
    boardEl.style.setProperty("--board-cell", `${cellSize}px`);
    boardEl.style.gridTemplateColumns = `repeat(${size}, var(--board-cell))`;
    consequenceEl.textContent = lastLiberties.length
      ? t().libertyLabel(lastLiberties.length)
      : "";
    consequenceEl.title = lastLiberties.length ? t().libertyTooltip : "";

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";

        window.BoardUI.applyEdgeClasses(cell, x, y, size);

        const fixedStone = getStoneAt(stage, x, y);
        const capturedHere = lastCaptured.some((c) => c.x === x && c.y === y);
        const showFixedStone = fixedStone && !capturedHere;
        const correctSolved = solvedMap.get(stage.id) && sameCoord(stage.answer, { x, y });

        if (correctSolved) {
          cell.classList.add("highlight-answer");
        }

        if (shouldShowStarPoint(size, x, y) && !showFixedStone && !sameCoord(userMove, { x, y })) {
          const star = document.createElement("div");
          star.className = "star-point-dot";
          cell.appendChild(star);
        }

        if (showFixedStone) {
          const stone = window.BoardUI.createStone(fixedStone.color);
          cell.appendChild(stone);
        }

        if (correctSolved && !showFixedStone && !sameCoord(userMove, { x, y })) {
          const color = stage.player === "white" ? "white" : "black";
          cell.appendChild(window.BoardUI.createStone(color));
        }

        if (userMove && sameCoord(userMove, { x, y })) {
          const isCorrect = sameCoord(stage.answer, userMove);
          const color = stage.player === "white" ? "white" : "black";
          const ghostStone = window.BoardUI.createStone(color, false);
          ghostStone.style.outline = isCorrect
            ? "3px solid rgba(31,107,42,0.7)"
            : "3px solid rgba(140,45,45,0.65)";
          cell.appendChild(ghostStone);
        }

        if (lastLiberties.some((lib) => lib.x === x && lib.y === y)) {
          const marker = document.createElement("div");
          marker.className = "liberty-highlight";
          cell.appendChild(marker);
        }

        cell.addEventListener("click", () => handleCellClick(x, y));
        boardEl.appendChild(cell);
      }
    }
  }

  function updateButtons() {
    prevBtn.disabled = currentStageIndex === 0;
    nextBtn.disabled = currentStageIndex === stages.length - 1;
  }

  function renderAll() {
    renderHeader();
    renderInfo();
    renderBoard();
    buildTermList();
    updateButtons();
  }

  function resetStage() {
    clearAutoNextTimer();
    userMove = null;
    lastLiberties = [];
    lastCaptured = [];
    setMessage(t().resetMessage, "");
    renderBoard();
  }

  function restartAll() {
    const ok = window.confirm(t().restartConfirm);
    if (!ok) return;

    clearAutoNextTimer();
    currentStageIndex = 0;
    userMove = null;
    lastLiberties = [];
    lastCaptured = [];
    solvedMap = new Map();

    setMessage(t().restartMessage, "");
    renderAll();

    window.scrollTo({ top: 0, behavior: "smooth" });
    closeSidebarOnMobile();
  }

  function goPrev() {
    clearAutoNextTimer();
    if (currentStageIndex <= 0) return;
    currentStageIndex -= 1;
    userMove = null;
    lastLiberties = [];
    lastCaptured = [];
    setMessage("", "");
    renderAll();
  }

  function goNext() {
    clearAutoNextTimer();
    if (currentStageIndex >= stages.length - 1) return;
    currentStageIndex += 1;
    userMove = null;
    lastLiberties = [];
    lastCaptured = [];
    setMessage("", "");
    renderAll();
  }

  function updateToggleSidebarText() {
    if (!toggleSidebarBtn) return;
    toggleSidebarBtn.textContent = isSidebarOpen ? t().toggleSidebarClose : t().toggleSidebarOpen;
  }

  function closeSidebarOnMobile() {
    if (window.innerWidth <= 920 && sidebarEl && toggleSidebarBtn) {
      isSidebarOpen = false;
      sidebarEl.classList.remove("open");
      toggleSidebarBtn.setAttribute("aria-expanded", "false");
      updateToggleSidebarText();
    }
  }

  function toggleSidebar() {
    if (!sidebarEl || !toggleSidebarBtn) return;
    isSidebarOpen = sidebarEl.classList.toggle("open");
    toggleSidebarBtn.setAttribute("aria-expanded", String(isSidebarOpen));
    updateToggleSidebarText();
  }

  function applyStaticUI() {
    const strings = t();
    const common = tc();

    document.documentElement.lang = lang();
    document.title = strings.pageTitle;

    if (eyebrowEl) eyebrowEl.textContent = strings.eyebrow;
    if (siteTitleEl) siteTitleEl.textContent = strings.h1;
    if (siteLeadEl) siteLeadEl.textContent = strings.lead;
    if (rulesLinkEl) rulesLinkEl.textContent = strings.rulesLink;
    if (sidebarTitleEl) sidebarTitleEl.textContent = strings.sidebarTitle;
    if (sidebarNoteEl) sidebarNoteEl.textContent = strings.sidebarNote;
    if (sectionLabelEl) sectionLabelEl.textContent = strings.sectionLabel;

    prevBtn.textContent = common.prev;
    nextBtn.textContent = common.next;
    resetBtn.textContent = strings.reset;
    if (restartBtn) restartBtn.textContent = strings.restart;

    updateToggleSidebarText();

    if (langToggleBtn) {
      langToggleBtn.textContent = common.langToggleLabel;
      langToggleBtn.setAttribute("aria-label", common.langToggleAriaLabel);
    }
  }

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
  resetBtn.addEventListener("click", resetStage);

  if (restartBtn) {
    restartBtn.addEventListener("click", restartAll);
  }

  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener("click", toggleSidebar);
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      if (!window.I18N) return;
      window.I18N.toggleLang();
      applyStaticUI();
      renderAll();
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920 && sidebarEl && toggleSidebarBtn) {
      isSidebarOpen = false;
      sidebarEl.classList.remove("open");
      toggleSidebarBtn.setAttribute("aria-expanded", "false");
      updateToggleSidebarText();
    }
    renderBoard();
  });

  applyStaticUI();
  renderAll();
})();
