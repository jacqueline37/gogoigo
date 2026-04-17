(() => {

  const SIZE = 9;

  const boardEl = document.getElementById("board");
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("desc");
  const hintEl = document.getElementById("hint");
  const stageIndicator = document.getElementById("stage-indicator");

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const resetBtn = document.getElementById("reset");

  let stageIndex = 0;
  let board = [];
  let target = null;
  let solved = false;

  // 5→9に中央配置
  function normalizeBoard(src){
    const offset = Math.floor((SIZE - src.length)/2);
    const newBoard = Array.from({length:SIZE},()=>Array(SIZE).fill(0));

    for(let y=0;y<src.length;y++){
      for(let x=0;x<src[y].length;x++){
        newBoard[y+offset][x+offset]=src[y][x];
      }
    }
    return newBoard;
  }

  function normalizeTarget(t, size){
    const offset = Math.floor((SIZE - size)/2);
    return {x:t.x+offset,y:t.y+offset};
  }

  function loadStage(i){

    const s = STAGES[i];

    board = normalizeBoard(s.board);
    target = normalizeTarget(s.correct, s.board.length);

    solved = false;

    titleEl.textContent = s.title;
    descEl.textContent = s.description;
    hintEl.textContent = "考えて打ってみよう";

    stageIndicator.textContent = `ステージ ${i+1} / ${STAGES.length}`;

    draw();
  }

  function draw(){
    boardEl.innerHTML="";

    for(let y=0;y<SIZE;y++){
      for(let x=0;x<SIZE;x++){

        const d=document.createElement("div");
        d.className="intersection";

        d.style.left=`${(x/(SIZE-1))*100}%`;
        d.style.top=`${(y/(SIZE-1))*100}%`;

        if(!solved && x===target.x && y===target.y){
          d.classList.add("target");
        }

        if(board[y][x]){
          const s=document.createElement("div");
          s.className="stone "+(board[y][x]==1?"black":"white");
          d.appendChild(s);
        }

        d.onclick=()=>onClick(x,y);

        boardEl.appendChild(d);
      }
    }
  }

  function onClick(x,y){

    if(solved) return;

    if(board[y][x]!==0){
      hintEl.textContent="そこには打てません";
      return;
    }

    if(x===target.x && y===target.y){

      board[y][x]=STAGES[stageIndex].moveColor;

      solved=true;

      hintEl.textContent=STAGES[stageIndex].success;

      draw();

    }else{
      hintEl.textContent="そこじゃない";
    }
  }

  function next(){
    if(stageIndex < STAGES.length-1){
      stageIndex++;
      loadStage(stageIndex);
    }
  }

  function prev(){
    if(stageIndex > 0){
      stageIndex--;
      loadStage(stageIndex);
    }
  }

  function reset(){
    loadStage(stageIndex);
  }

  nextBtn.onclick = next;
  prevBtn.onclick = prev;
  resetBtn.onclick = reset;

  loadStage(0);

})();
