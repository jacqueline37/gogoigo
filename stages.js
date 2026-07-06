window.STAGES = [
  {
    id: "kiri",
    title: "キリ",
    description: "相手の石のつながりを断つ手です。切られた石はそれぞれ別のグループとして戦わなければなりません。",
    instruction: "黒の連絡を断ち、同時に白自身もつながる一点をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 3, y: 2 },
    successMessage: "正解です。キリは、相手を分断すると同時に自分もつながる、一石二鳥の手です。",
    failureMessage: "そこでは黒を切れていません。黒の間にある一点を探しましょう。",
    stones: [
      { x: 2, y: 2, color: "black" },
      { x: 4, y: 2, color: "black" },
      { x: 3, y: 1, color: "white" },
      { x: 3, y: 3, color: "white" }
    ]
  },
  {
    id: "tsugi",
    title: "ツギ",
    description: "キリの逆で、切られそうな弱点を自分でふさぎ、石をひとつながりにする手です。",
    instruction: "白に狙われている一点をふさぎ、黒をつなげてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 6, y: 6 },
    successMessage: "正解です。弱点を自分でふさぐと、もう切られる心配がなくなります。",
    failureMessage: "そこではまだ黒はつながっていません。白に狙われている一点を探しましょう。",
    stones: [
      { x: 5, y: 6, color: "black" },
      { x: 7, y: 6, color: "black" },
      { x: 6, y: 5, color: "white" },
      { x: 6, y: 7, color: "white" }
    ]
  },
  {
    id: "hane",
    title: "ハネ",
    description: "相手の石の頭を、斜めに回り込むようにして押さえる手です。",
    instruction: "白石から、黒の頭を斜めに抑える点をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 3 },
    successMessage: "正解です。相手の頭を斜めに抑えるのがハネです。",
    failureMessage: "ハネは、まっすぐではなく斜めに頭を抑える手です。",
    stones: [
      { x: 4, y: 4, color: "black" },
      { x: 3, y: 4, color: "white" }
    ]
  },
  {
    id: "osae",
    title: "オサエ",
    description: "相手が進みたい方向を、まっすぐ塞いで止める手です。",
    instruction: "白が上に進む前に、黒が止める場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 6, y: 3 },
    successMessage: "正解です。相手の進路をまっすぐ塞ぐのがオサエです。",
    failureMessage: "オサエは、相手が次に進みたい場所を先に塞ぐ手です。",
    stones: [
      { x: 6, y: 4, color: "white" },
      { x: 6, y: 5, color: "white" },
      { x: 5, y: 4, color: "black" },
      { x: 5, y: 5, color: "black" }
    ]
  },
  {
    id: "magari",
    title: "マガリ",
    description: "自分の石から直角に曲がって、形を強くする手です。",
    instruction: "白に止められた黒石が、直角に曲がる場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 3, y: 5 },
    successMessage: "正解です。直角に曲がってしっかりした形を作るのがマガリです。",
    failureMessage: "マガリは、今ある黒石の並びから直角方向に曲がる手です。",
    stones: [
      { x: 2, y: 4, color: "black" },
      { x: 3, y: 4, color: "black" },
      { x: 4, y: 4, color: "white" }
    ]
  },
  {
    id: "ikken",
    title: "一間（いっけん）",
    description: "自分の石から、ひとつ空点をあけて打つ、基本的な間隔の取り方です。",
    instruction: "白石から一路あけて打つ、一間の場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 3, y: 4 },
    successMessage: "正解です。ひとつ空点をあけて打つ形が一間です。",
    failureMessage: "一間は、石との間にちょうど1つ交点があく間隔です。",
    stones: [
      { x: 1, y: 4, color: "white" }
    ]
  },
  {
    id: "watari",
    title: "ワタリ",
    description: "盤端を使って石同士が連絡することです。特に端では重要な手筋です。",
    instruction: "白が下辺を使って連絡するワタリの場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 7 },
    successMessage: "正解です。端を利用してつながるのがワタリです。",
    failureMessage: "端を使って、2つの白石が連絡できる場所を見つけましょう。",
    stones: [
      { x: 3, y: 6, color: "white" },
      { x: 5, y: 6, color: "white" },
      { x: 4, y: 6, color: "black" },
      { x: 3, y: 7, color: "black" },
      { x: 5, y: 7, color: "black" },
      { x: 2, y: 6, color: "white" }
    ]
  },
  {
    id: "nozoki",
    title: "ノゾキ",
    description: "『次に切りますよ』と、相手に受けを迫る手です。切る手そのものではありません。",
    instruction: "黒の弱点をのぞく白の場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 6, y: 5 },
    successMessage: "正解です。今すぐ切るのではなく、次に切れる形を見せるのがノゾキです。",
    failureMessage: "ノゾキは、弱点そのものではなく、その脇からのぞく手です。",
    stones: [
      { x: 7, y: 4, color: "black" },
      { x: 7, y: 6, color: "black" }
    ]
  },
  {
    id: "tsuke",
    title: "ツケ",
    description: "相手の石に直接くっつけて打つ手です。接近戦の始まりになります。",
    instruction: "黒石にぴったりとくっつける白の場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 1, y: 1 },
    successMessage: "正解です。相手の石に直接接するのがツケです。",
    failureMessage: "ツケは、相手の石に隣接する点に打つ手です。",
    stones: [
      { x: 1, y: 2, color: "black" }
    ]
  },
  {
    id: "tobi",
    title: "トビ",
    description: "石から一路とばして、軽やかに進む手です。",
    instruction: "白に押さえられそうな黒が、跳んで進む場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 7, y: 6 },
    successMessage: "正解です。相手の圧力をかわして軽く跳ぶのがトビです。",
    failureMessage: "トビは、隣に打つのではなく一路とばして進む手です。",
    stones: [
      { x: 5, y: 6, color: "black" },
      { x: 5, y: 5, color: "white" }
    ]
  },
  {
    id: "butsukari",
    title: "ブツカリ",
    description: "自分の石を後ろに従えて、相手の石に正面からぶつかっていく手です。",
    instruction: "白石にぶつかっていく黒の場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 4, y: 4 },
    successMessage: "正解です。後ろの石に支えられて正面からぶつかるのがブツカリです。",
    failureMessage: "ブツカリは、相手の石に正面から接触する手です。",
    stones: [
      { x: 4, y: 5, color: "black" },
      { x: 4, y: 3, color: "white" }
    ]
  },
  {
    id: "oshi",
    title: "オシ",
    description: "相手の石に沿って、まっすぐ押していく手です。",
    instruction: "白が黒の石に沿ってまっすぐ押す場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 1, y: 4 },
    successMessage: "正解です。まっすぐ押していく手がオシです。",
    failureMessage: "オシは、斜めではなくまっすぐ押し進む手です。",
    stones: [
      { x: 2, y: 3, color: "black" },
      { x: 2, y: 4, color: "black" },
      { x: 1, y: 3, color: "white" }
    ]
  },
  {
    id: "hai",
    title: "ハイ",
    description: "盤の一番端を、低く這うように進む手です。",
    instruction: "白に押されている黒が、辺を這うように進む場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 0, y: 4 },
    successMessage: "正解です。盤端を低く這うように進むのがハイです。",
    failureMessage: "ハイは、盤の一番端の線を進む手です。",
    stones: [
      { x: 0, y: 3, color: "black" },
      { x: 1, y: 4, color: "white" }
    ]
  },
  {
    id: "hiki",
    title: "ヒキ",
    description: "前に出ずに、自分の石の方へ引いて安定させる手です。",
    instruction: "白に迫られた黒が、自分の石の方へ引く場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 5, y: 4 },
    successMessage: "正解です。無理に前へ出ず、自分の石へ引いて安定させるのがヒキです。",
    failureMessage: "ヒキは、前に出るのではなく自分の石の方向へ引く手です。",
    stones: [
      { x: 5, y: 3, color: "black" },
      { x: 5, y: 5, color: "black" },
      { x: 6, y: 3, color: "white" }
    ]
  },
  {
    id: "nobi",
    title: "ノビ",
    description: "自分の石から、まっすぐ外側へ伸びる手です。",
    instruction: "黒に触れられた白が、まっすぐ外へ伸びる場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 6, y: 7 },
    successMessage: "正解です。外側へまっすぐ伸びるのがノビです。",
    failureMessage: "ノビは、後ろに引くのではなく外側へ伸びる手です。",
    stones: [
      { x: 6, y: 6, color: "white" },
      { x: 6, y: 5, color: "black" }
    ]
  },
  {
    id: "kakae",
    title: "カカエ",
    description: "相手の石の逃げ道をすべてふさぎ、抱えるように閉じ込める手です。",
    instruction: "白石の最後の逃げ道をふさぐ黒の場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 8, y: 2 },
    successMessage: "正解です。相手の逃げ道をすべてふさいで閉じ込めるのがカカエです。",
    failureMessage: "カカエは、相手の最後に残った逃げ道をふさぐ手です。",
    stones: [
      { x: 7, y: 2, color: "white" },
      { x: 6, y: 2, color: "black" },
      { x: 7, y: 1, color: "black" },
      { x: 7, y: 3, color: "black" }
    ]
  },
  {
    id: "sagari",
    title: "サガリ",
    description: "中央に向かってではなく、盤端に向かって一段下がる手です。",
    instruction: "黒に迫られた白が、盤端に向かって下がる場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 3, y: 8 },
    successMessage: "正解です。盤端に向かって一段下がるのがサガリです。",
    failureMessage: "サガリは、外へ伸びるのではなく盤端に向かって下がる手です。",
    stones: [
      { x: 3, y: 7, color: "white" },
      { x: 2, y: 7, color: "black" }
    ]
  },
  {
    id: "kosumi",
    title: "コスミ",
    description: "自分の石から斜めにひとつずれた点に打つ、柔らかいつながりの手です。",
    instruction: "黒石から斜めにずれた点をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 2, y: 6 },
    successMessage: "正解です。斜めにひとつずれてつながるのがコスミです。",
    failureMessage: "コスミは、縦横ではなく斜めにずれた点に打つ手です。",
    stones: [
      { x: 1, y: 5, color: "black" }
    ]
  },
  {
    id: "hiraki",
    title: "ヒラキ",
    description: "辺にある自分の石から、地を囲うように大きく開く手です。",
    instruction: "上辺の白石から、大きくヒラく場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 5, y: 0 },
    successMessage: "正解です。辺で大きく開いて地を囲うのがヒラキです。",
    failureMessage: "ヒラキは、隣に打つのではなく少し大きめに間をあける手です。",
    stones: [
      { x: 2, y: 0, color: "white" },
      { x: 4, y: 2, color: "black" }
    ]
  }
];
