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
    { x: 6, y: 6 },
  ];

  const listEl = document.getElementById("list");
  const boardEl = document.getElementById("board");
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("desc");
  const hintEl = document.getElementById("hint");
  const searchEl = document.getElementById("search");
  const resetEl = document.getElementById("reset");

  if (
    !listEl ||
    !boardEl ||
    !titleEl ||
    !descEl ||
    !hintEl ||
    !searchEl ||
    !resetEl
  ) {
    console.error("必要なHTML要素が見つかりません。index.html を確認してください。");
    return;
  }

  if (!window.TERMS || !Array.isArray(window.TERMS)) {
    console.error("window.TERMS が見つかりません。terms.js の読み込みを確認してください。");
    titleEl.textContent = "データ読み込みエラー";
    descEl.textContent = "terms.js が正しく読み込まれていません。";
    hintEl.textContent = "";
    return;
  }

  let currentIndex = 0;
  let currentTerm = null;
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

  function normalizeTarget(target, originalSize) {
    if (!target) return null;
    const offset = Math.floor((BOARD_SIZE - originalSize) / 2);
    return {
      x: target.x + offset,
      y: target.y + offset,
    };
  }

  function getStoneClass(value) {
    if (value === BLACK) return "black";
    if (value === WHITE) return "white";
    return "";
  }

  function clearChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function getFilteredTerms(filterText = "") {
    const normalized = filterText.trim();
    if (!normalized) return window.TERMS;

    return window.TERMS.filter((term) => {
      const haystack = `${term.title} ${term.yomi || ""} ${term.short || ""} ${term.description || ""}`;
      return haystack.includes(normalized);
    });
  }

  function renderList(filterText = "") {
    clearChildren(listEl);

    const filteredTerms = getFilteredTerms(filterText);

    if (filteredTerms.length === 0) {
      const empty = document.createElement("div");
      empty.className = "term empty";
      empty.textContent = "該当する用語がありません";
      listEl.appendChild(empty);
      return;
    }

    filteredTerms.forEach((term) => {
      const originalIndex = window.TERMS.findIndex((t) => t.id === term.id);

      const item = document.createElement("button");
      item.type = "button";
      item.className = "term";

      if (originalIndex === currentIndex) {
        item.classList.add("active");
      }

      const title = document.createElement("div");
      title.className = "term-title";
      title.textContent = `${String(originalIndex + 1).padStart(2, "0")} ${term.title}`;

      const short = document.createElement("div");
      short.className = "term-short";
      short.textContent = term.short || "";

      item.appendChild(title);
      item.appendChild(short);

      item.addEventListener("click", () => {
        loadTerm(originalIndex);
        renderList(searchEl.value);
      });

      listEl.appendChild(item);
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

  function setHint(text, kind = "") {
    hintEl.textContent = text || "";
    hintEl.className = "hint";
    if (kind) {
      hintEl.classList.add(kind);
    }
  }

  function loadTerm(index) {
    const term = window.TERMS[index];
    if (!term) return;

    if (!isValidBoard(term.board)) {
      console.error("盤面データが不正です:", term);
      titleEl.textContent = term.title || "盤面エラー";
      descEl.textContent = "この用語の盤面データが正しくありません。";
      setHint("");
      clearChildren(boardEl);
      currentTerm = null;
      currentBoard = null;
      currentTarget = null;
      solved = false;
      return;
    }

    currentIndex = index;
    currentTerm = term;
    currentBoard = normalizeBoard(term.board);
    currentTarget = normalizeTarget(term.target, term.board.length);
    solved = false;

    titleEl.textContent = term.title || "";
    descEl.textContent = term.description || "";
    setHint(term.hint || "");

    drawBoard();
  }

  function onIntersectionClick(x, y) {
    if (!currentTerm || !currentBoard || solved) return;

    if (currentBoard[y][x] !== EMPTY) {
      setHint("その交点にはすでに石があります。", "error");
      return;
    }

    const isCorrect =
      currentTarget &&
      x === currentTarget.x &&
      y === currentTarget.y;

    if (!isCorrect) {
      setHint("そこではありません。赤い目標地点に打ってみましょう。", "error");
      return;
    }

    currentBoard[y][x] = currentTerm.moveColor || BLACK;
    solved = true;
    drawBoard();
    setHint(currentTerm.afterText || "OK！", "success");
  }

  function resetCurrentTerm() {
    if (!currentTerm) return;
    currentBoard = normalizeBoard(currentTerm.board);
    currentTarget = normalizeTarget(currentTerm.target, currentTerm.board.length);
    solved = false;
    drawBoard();
    setHint(currentTerm.hint || "");
  }

  function initEvents() {
    searchEl.addEventListener("input", (e) => {
      renderList(e.target.value);
    });

    resetEl.addEventListener("click", () => {
      resetCurrentTerm();
    });
  }

  function init() {
    initEvents();
    renderList("");
    loadTerm(0);
    renderList("");
  }

  init();
})();
