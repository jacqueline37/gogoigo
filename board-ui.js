window.BoardUI = (() => {
  function applyEdgeClasses(cell, x, y, size) {
    if (y === 0) cell.classList.add("edge-top");
    if (y === size - 1) cell.classList.add("edge-bottom");
    if (x === 0) cell.classList.add("edge-left");
    if (x === size - 1) cell.classList.add("edge-right");
    const lang = window.I18N ? window.I18N.getLang() : "ja";
    const label = window.I18N
      ? window.I18N.ui[lang].common.cellAriaLabel(x + 1, y + 1)
      : `${x + 1}列 ${y + 1}行`;
    cell.setAttribute("aria-label", label);
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

    const containerStyle = getComputedStyle(container);
    const containerPadding =
      parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);

    const boardStyle = getComputedStyle(boardEl);
    const boardChrome =
      parseFloat(boardStyle.paddingLeft) +
      parseFloat(boardStyle.paddingRight) +
      parseFloat(boardStyle.borderLeftWidth) +
      parseFloat(boardStyle.borderRightWidth);

    const buffer = 2;
    const available = containerWidth - containerPadding - boardChrome - buffer;

    const maxCell = 48;
    const minCell = 26;
    const cell = Math.floor(available / size);
    return Math.max(minCell, Math.min(maxCell, cell));
  }

  return { applyEdgeClasses, createStone, computeCellSize };
})();
