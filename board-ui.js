window.BoardUI = (() => {
  function applyEdgeClasses(cell, x, y, size) {
    if (y === 0) cell.classList.add("edge-top");
    if (y === size - 1) cell.classList.add("edge-bottom");
    if (x === 0) cell.classList.add("edge-left");
    if (x === size - 1) cell.classList.add("edge-right");
    cell.setAttribute("aria-label", `${x + 1}列 ${y + 1}行`);
  }

  function createStone(color, ghost = false) {
    const stone = document.createElement("div");
    stone.className = `stone ${color}${ghost ? " ghost" : ""}`;
    return stone;
  }

  function computeCellSize(boardEl, size) {
    const container = boardEl.parentElement;
    const containerWidth = container ? container.clientWidth : 0;
    if (!containerWidth) return 48;

    const cardPadding = 40; // .card's left+right padding
    const boardChrome = 28; // .board's own padding+border
    const buffer = 8;
    const available = containerWidth - cardPadding - boardChrome - buffer;

    const maxCell = 48;
    const minCell = 26;
    const cell = Math.floor(available / size);
    return Math.max(minCell, Math.min(maxCell, cell));
  }

  return { applyEdgeClasses, createStone, computeCellSize };
})();
