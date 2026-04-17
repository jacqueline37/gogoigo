(() => {
  const boardEl = document.getElementById("board");
  const titleEl = document.getElementById("term-title");
  const descriptionEl = document.getElementById("term-description");
  const instructionEl = document.getElementById("term-instruction");
  const messageEl = document.getElementById("message");
  const stageIndicatorEl = document.getElementById("stage-indicator");
  const termListEl = document.getElementById("term-list");

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const resetBtn = document.getElementById("reset-btn");
  const restartBtn = document.getElementById("restart-btn");
  const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
  const sidebarEl = document.getElementById("sidebar");

  if (!window.STAGES || !Array.isArray(window.STAGES) || window.STAGES.length === 0) {
    titleEl.textContent = "データが見つかりません";
    descriptionEl.textContent = "stages.js の読み込みに失敗している可能性があります。";
    return;
  }

  const stages = window.STAGES;

  let currentStageIndex = 0;
  let userMove = null;
  let solvedMap = new Map();
  let autoNextTimer = null;

  function sameCoord(a, b) {
    return a && b && a.x === b.x && a.y === b.y;
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
        <span>${solved}${stage.title}</span>
      `;

      if (index === currentStageIndex) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        clearAutoNextTimer();
        currentStageIndex = index;
        userMove = null;
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
    stageIndicatorEl.textContent =
      `第${currentStageIndex + 1}問 / ${stages.length}（${solvedCount}問クリア）`;
  }

  function renderInfo() {
    const stage = getCurrentStage();
    titleEl.textContent = `${String(currentStageIndex + 1).padStart(2, "0")} ${stage.title}`;
    descriptionEl.textContent = stage.description || "";
    instructionEl.textContent =
      stage.instruction || "盤面の交点をクリックして答えを選んでください。";
  }

  function createStone(color, ghost = false) {
    const stone = document.createElement("div");
    stone.className = `stone ${color}${ghost ? " ghost" : ""}`;
    return stone;
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
    const occupied = getStoneAt(stage, x, y);

    if (occupied) return;

    clearAutoNextTimer();
    userMove = { x, y };

    if (sameCoord(userMove, stage.answer)) {
      solvedMap.set(stage.id, true);
      setMessage(stage.successMessage || "正解です。", "success");

      renderBoard();
      buildTermList();
      updateButtons();
      renderHeader();

      if (currentStageIndex < stages.length - 1) {
        autoNextTimer = setTimeout(() => {
          goNext();
        }, 800);
      }

      return;
    }

    setMessage(
      stage.failureMessage || "そこではありません。もう一度考えてみましょう。",
      "error"
    );

    renderBoard();
    buildTermList();
    updateButtons();
  }

  function renderBoard() {
    const stage = getCurrentStage();
    const size = stage.boardSize || 9;
    boardEl.innerHTML = "";
    boardEl.style.gridTemplateColumns = `repeat(${size}, var(--board-cell))`;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";

        if (y === 0) cell.classList.add("edge-top");
        if (y === size - 1) cell.classList.add("edge-bottom");
        if (x === 0) cell.classList.add("edge-left");
        if (x === size - 1) cell.classList.add("edge-right");

        cell.setAttribute("aria-label", `${x + 1}列 ${y + 1}行`);

        const fixedStone = getStoneAt(stage, x, y);
        const correctSolved = solvedMap.get(stage.id) && sameCoord(stage.answer, { x, y });

        if (correctSolved) {
          cell.classList.add("highlight-answer");
        }

        if (shouldShowStarPoint(size, x, y) && !fixedStone && !sameCoord(userMove, { x, y })) {
          const star = document.createElement("div");
          star.className = "star-point-dot";
          cell.appendChild(star);
        }

        if (fixedStone) {
          const stone = createStone(fixedStone.color);
          cell.appendChild(stone);
        }

        if (userMove && sameCoord(userMove, { x, y })) {
          const isCorrect = sameCoord(stage.answer, userMove);
          const color = stage.player === "white" ? "white" : "black";
          const ghostStone = createStone(color, false);
          ghostStone.style.outline = isCorrect
            ? "3px solid rgba(31,107,42,0.7)"
            : "3px solid rgba(140,45,45,0.65)";
          cell.appendChild(ghostStone);
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
    setMessage("盤面をリセットしました。", "");
    renderBoard();
  }

  function restartAll() {
    const ok = window.confirm("最初からやり直しますか？");
    if (!ok) return;

    clearAutoNextTimer();
    currentStageIndex = 0;
    userMove = null;
    solvedMap = new Map();

    setMessage("最初からやり直しました。", "");
    renderAll();

    window.scrollTo({ top: 0, behavior: "smooth" });
    closeSidebarOnMobile();
  }

  function goPrev() {
    clearAutoNextTimer();
    if (currentStageIndex <= 0) return;
    currentStageIndex -= 1;
    userMove = null;
    setMessage("", "");
    renderAll();
  }

  function goNext() {
    clearAutoNextTimer();
    if (currentStageIndex >= stages.length - 1) return;
    currentStageIndex += 1;
    userMove = null;
    setMessage("", "");
    renderAll();
  }

  function closeSidebarOnMobile() {
    if (window.innerWidth <= 920 && sidebarEl && toggleSidebarBtn) {
      sidebarEl.classList.remove("open");
      toggleSidebarBtn.setAttribute("aria-expanded", "false");
      toggleSidebarBtn.textContent = "用語一覧を開く";
    }
  }

  function toggleSidebar() {
    if (!sidebarEl || !toggleSidebarBtn) return;
    const isOpen = sidebarEl.classList.toggle("open");
    toggleSidebarBtn.setAttribute("aria-expanded", String(isOpen));
    toggleSidebarBtn.textContent = isOpen ? "用語一覧を閉じる" : "用語一覧を開く";
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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920 && sidebarEl && toggleSidebarBtn) {
      sidebarEl.classList.remove("open");
      toggleSidebarBtn.setAttribute("aria-expanded", "false");
      toggleSidebarBtn.textContent = "用語一覧を開く";
    }
  });

  renderAll();
})();
