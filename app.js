const listEl = document.getElementById("list");
const boardEl = document.getElementById("board");
const titleEl = document.getElementById("title");
const descEl = document.getElementById("desc");
const hintEl = document.getElementById("hint");
const searchEl = document.getElementById("search");

let current = null;

function renderList(filter="") {
  listEl.innerHTML = "";
  TERMS
    .filter(t => t.title.includes(filter))
    .forEach((t,i)=>{
      const div = document.createElement("div");
      div.className = "term";
      div.textContent = t.title;
      div.onclick = ()=>loadTerm(i);
      listEl.appendChild(div);
    });
}

function loadTerm(i){
  current = JSON.parse(JSON.stringify(TERMS[i]));
  titleEl.textContent = current.title;
  descEl.textContent = current.desc;
  hintEl.textContent = current.hint;
  drawBoard();
}

function drawBoard(){
  boardEl.innerHTML = "";
  const size = 5;

  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.left = `${(x/(size-1))*100}%`;
      cell.style.top = `${(y/(size-1))*100}%`;

      if(current.board[y][x]){
        const stone = document.createElement("div");
        stone.className = "stone " + (current.board[y][x]===1?"black":"white");
        cell.appendChild(stone);
      }

      if(current.target.x===x && current.target.y===y){
        cell.classList.add("target");
      }

      cell.onclick = ()=>{
        if(x===current.target.x && y===current.target.y){
          current.board[y][x]=1;
          hintEl.textContent = "OK！";
          drawBoard();
        }else{
          hintEl.textContent = "そこじゃない";
        }
      };

      boardEl.appendChild(cell);
    }
  }
}

searchEl.oninput = ()=>renderList(searchEl.value);

document.getElementById("reset").onclick = ()=>{
  if(current) loadTerm(TERMS.findIndex(t=>t.title===current.title));
};

renderList();
