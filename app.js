(() => {
  const BOARD_SIZE = 9;
  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;

  const STAR_POINTS_9 = [
    { x: 2, y: 2 },
    { x: 6, y: 2 },
    { x: 4, y: 4 },
    { x: 2, y: 6 },
    { x: 6, y: 6 }
  ];

  const boardEl = document.getElementById("board");
  const titleEl = document.getElementById("term-title");
  const descEl = document.getElementById("term-description");
  const messageEl = document.getElementById("message");
  const listEl = document.getElementById("term-list");
  const stageIndicatorEl = document.getElementById("stage-indicator");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const resetBtn = document.getElementById("reset-btn");

  if (
    !boardEl ||
    !titleEl ||
    !descEl ||
    !messageEl ||
    !listEl ||
    !stageIndicatorEl ||
    !prevBtn ||
    !nextBtn ||
    !resetBtn
  ) {
    console.error("必要なHTML要素が見つかりません。index.html を確認してください。");
    return;
  }

  if (!window.STAGES || !Array.isArray(window.STAGES) || window.STAGES.length === 0) {
    console.error("stages.js の読み込みに失敗しています。");
    titleEl.textContent = "データ読み込みエラー";
    descEl.textContent = "stages.js が正しく読み込まれていません。";
    messageEl.textContent = "";
    return;
  }

  let currentIndex = 0;
  let currentStage = null;
  let currentBoard = null;
  let currentTarget = null;
  let solved = false;

  function cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  function makeEmptyBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(EMPTY));
  }

  function isValidBoard(board) {
    return (
      Array.isArray(board) &&
      board.length > 0 &&
      board.every(
        (row) =>
          Array.isArray(row) &&
          row.length === board.length &&
          row.every((cell) => [EMPTY, BLACK, WHITE].includes(cell))
      )
    );
  }

  function normalizeBoard(board) {
    const originalSize = board.length;

    if (originalSize === BOARD_SIZE) {
      return cloneBoard(board);
    }

    if (originalSize > BOARD_SIZE) {
      throw new Error(`盤面サイズ ${originalSize} は ${BOARD_SIZE} 路より大きいため表示できません。`);
    }

    const newBoard = makeEmptyBoard(BOARD_SIZE);
    const offset = Math.floor((BOARD_SIZE - originalSize) / 2);

    for (let y = 0; y < originalSize; y += 1) {
      for (let x = 0; x < originalSize; x += 1) {
        newBoard[y + offset][x + offset] = board[y][x];
      }
    }

    return newBoard;
  }

  function normalizePoint(point, originalSize) {
    if (!point) return null;
    const offset = Math.floor((BOARD_SIZE - originalSize) / 2);
    return {
      x: point.x + offset,
      y: point.y + offset
    };
  }

  function clearChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function setMessage(text, kind = "") {
    messageEl.textContent = text || "";
    messageEl.className = "message";
    if (kind) {
      messageEl.classList.add(kind);
    }
  }

  function getStoneClass(value) {
    if (value === BLACK) return "black";
    if (value === WHITE) return "white";
    return "";
  }

  function renderList() {
    clearChildren(listEl);

    window.STAGES.forEach((stage, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "term-item";

      if (index === currentIndex) {
        btn.classList.add("active");
      }

      const title = document.createElement("div");
      title.className = "term-item__title";
      title.textContent = `${String(index + 1).padStart(2, "0")} ${stage.title}`;

      const short = document.createElement("div");
      short.className = "term-item__short";
      short.textContent = stage.short || "";

      btn.appendChild(title);
      btn.appendChild(short);

      btn.addEventListener("click", () => {
        loadStage(index);
      });

      listEl.appendChild(btn);
    });
  }

  function addGridLines() {
    for (let i = 0; i < BOARD_SIZE; i += 1) {
      const v = document.createElement("div");
      v.className = "grid-line vertical";
      v.style.left = `calc(24px + ${i} * ((100% - 48px) / ${BOARD_SIZE - 1}))`;
      boardEl.appendChild(v);

      const h = document.createElement("div");
      h.className = "grid-line horizontal";
      h.style.top = `calc(24px + ${i} * ((100% - 48px) / ${BOARD_SIZE - 1}))`;
      boardEl.appendChild(h);
    }
  }

  function addStarPoints() {
    STAR_POINTS_9.forEach((point) => {
      const star = document.createElement("div");
      star.className = "star-point";
      star.style.left = `calc(24px + ${point.x} * ((100% - 48px) / ${BOARD_SIZE - 1}))`;
      star.style.top = `calc(24px + ${point.y} * ((100% - 48px) / ${BOARD_SIZE - 1}))`;
      boardEl.appendChild(star);
    });
  }

  function onIntersectionClick(x, y) {
    if (!currentStage || !currentBoard || solved) return;

    if (currentBoard[y][x] !== EMPTY) {
      setMessage("その交点にはすでに石があります。", "error");
      return;
    }

    const isCorrect =
      currentTarget &&
      x === currentTarget.x &&
      y === currentTarget.y;

    if (!isCorrect) {
      setMessage("そこではありません。赤い丸の位置を見て、もう一度試してみましょう。", "error");
      return;
    }

    currentBoard[y][x] = currentStage.moveColor || BLACK;
    solved = true;
    drawBoard();
    setMessage(currentStage.success || "正解です。", "success");
  }

  function createIntersection(x, y) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "intersection";
    btn.style.left = `calc(24px + ${x} * ((100% - 48px) / ${BOARD_SIZE - 1}))`;
    btn.style.top = `calc(24px + ${y} * ((100% - 48px) / ${BOARD_SIZE - 1}))`;

    if (
      currentTarget &&
      currentTarget.x === x &&
      currentTarget.y === y &&
      !solved &&
      currentBoard[y][x] === EMPTY
    ) {
      btn.classList.add("target");
    }

    const value = currentBoard[y][x];
    if (value !== EMPTY) {
      const stone = document.createElement("div");
      stone.className = `stone ${getStoneClass(value)}`;
      btn.appendChild(stone);
    }

    btn.addEventListener("click", () => onIntersectionClick(x, y));
    return btn;
  }

  function drawBoard() {
    clearChildren(boardEl);
    addGridLines();
    addStarPoints();

    for (let y = 0; y < BOARD_SIZE; y += 1) {
      for (let x = 0; x < BOARD_SIZE; x += 1) {
        boardEl.appendChild(createIntersection(x, y));
      }
    }
  }

  function updateNavButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === window.STAGES.length - 1;
  }

  function loadStage(index) {
    const stage = window.STAGES[index];
    if (!stage) return;

    if (!isValidBoard(stage.board)) {
      console.error("盤面データが不正です:", stage);
      titleEl.textContent = stage.title || "盤面エラー";
      descEl.textContent = "この用語の盤面データが正しくありません。";
      setMessage("");
      clearChildren(boardEl);
      currentStage = null;
      currentBoard = null;
      currentTarget = null;
      solved = false;
      return;
    }

    currentIndex = index;
    currentStage = stage;
    currentBoard = normalizeBoard(stage.board);
    currentTarget = normalizePoint(stage.correct, stage.board.length);
    solved = false;

    titleEl.textContent = stage.title || "";
    descEl.textContent = stage.description || "";
    stageIndicatorEl.textContent = `${currentIndex + 1} / ${window.STAGES.length}`;
    setMessage("赤い丸の位置に打って、この用語を体験してみましょう。");

    drawBoard();
    renderList();
    updateNavButtons();
  }

  function goPrev() {
    if (currentIndex <= 0) return;
    loadStage(currentIndex - 1);
  }

  function goNext() {
    if (currentIndex >= window.STAGES.length - 1) return;
    loadStage(currentIndex + 1);
  }

  function resetCurrent() {
    loadStage(currentIndex);
  }

  function initEvents() {
    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);
    resetBtn.addEventListener("click", resetCurrent);
  }

  function init() {
    initEvents();
    loadStage(0);
  }

  init();
})();
