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

  return { applyEdgeClasses, createStone };
})();
