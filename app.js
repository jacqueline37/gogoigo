(() => {

  const SIZE = 9;

  const boardEl = document.getElementById("board");
  const titleEl = document.getElementById("term-title");
  const descEl = document.getElementById("term-description");
  const messageEl = document.getElementById("message");
  const listEl = document.getElementById("term-list");
  const indicatorEl = document.getElementById("stage-indicator");

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const resetBtn = document.getElementById("reset-btn");

  let currentIndex = 0;
  let board = [];
  let target = null;
  let solved = false;

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
    indicatorEl.textContent = `${i+1} / ${STAGES.length}`;

    messageEl.textContent = "赤い位置に打ってみましょう";

    draw();
    renderList();
  }

  function draw(){
    boardEl.innerHTML = "";

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

        d.onclick=()=>click(x,y);

        boardEl.appendChild(d);
      }
    }
  }

  function click(x,y){
    if(solved) return;

    if(board[y][x]!==0){
      messageEl.textContent="そこには置けません";
      return;
    }

    if(x===target.x && y===target.y){
      board[y][x]=STAGES[currentIndex].moveColor;
      solved=true;
      messageEl.textContent=STAGES[currentIndex].success;
      draw();
    }else{
      messageEl.textContent="そこじゃない";
    }
  }

  function renderList(){
    listEl.innerHTML="";

    STAGES.forEach((s,i)=>{
      const b=document.createElement("button");
      b.textContent=`${String(i+1).padStart(2,"0")} ${s.title}`;

      if(i===currentIndex){
        b.classList.add("active");
      }

      b.onclick=()=>loadStage(i);

      listEl.appendChild(b);
    });
  }

  prevBtn.onclick=()=>{
    if(currentIndex>0){
      currentIndex--;
      loadStage(currentIndex);
    }
  };

  nextBtn.onclick=()=>{
    if(currentIndex<STAGES.length-1){
      currentIndex++;
      loadStage(currentIndex);
    }
  };

  resetBtn.onclick=()=>{
    loadStage(currentIndex);
  };

  loadStage(0);

})();
