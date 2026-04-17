window.STAGES = [
  {
    id: "kiri",
    title: "キリ",
    description: "相手のつながりを断つ手です。石同士の連絡を切って、別々にしてしまいます。",
    instruction: "黒どうしの連絡を断つ白1の場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 3 },
    successMessage: "正解です。キリは、相手のつながりを断つ基本の手です。",
    failureMessage: "そこだと切れていません。黒の連絡が切れる交点を見てみましょう。",
    stones: [
      { x: 3, y: 3, color: "black" },
      { x: 5, y: 3, color: "black" },
      { x: 4, y: 2, color: "white" },
      { x: 4, y: 4, color: "white" }
    ]
  },
  {
    id: "tsugi",
    title: "ツギ",
    description: "切られないように石をつなぐ手です。離れた石同士を安全につなげる基本形です。",
    instruction: "白に切られないよう、黒がつなぐ場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 4, y: 3 },
    successMessage: "正解です。ツギは、自分の石を切られないようにつなぐ手です。",
    failureMessage: "そこでは十分につながりません。2つの黒石を直接つなげる点を選びましょう。",
    stones: [
      { x: 3, y: 3, color: "black" },
      { x: 5, y: 3, color: "black" },
      { x: 4, y: 2, color: "white" }
    ]
  },
  {
    id: "hane",
    title: "ハネ",
    description: "相手の石の横を曲がるように打ち、頭をおさえたり進路を制限したりする手です。",
    instruction: "白が黒の頭をおさえるハネの位置をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 2 },
    successMessage: "正解です。相手の頭を押さえるように曲がる手がハネです。",
    failureMessage: "ハネは、相手の石の横を曲がる感じの手です。",
    stones: [
      { x: 4, y: 3, color: "black" },
      { x: 3, y: 3, color: "white" }
    ]
  },
  {
    id: "osae",
    title: "オサエ",
    description: "相手が出ていこうとするところを止める手です。進路をふさぐ意味合いがあります。",
    instruction: "白が上に出ようとしています。黒がオサエる場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 4, y: 2 },
    successMessage: "正解です。相手の進出を止めるのがオサエです。",
    failureMessage: "相手の進みたい方向を止める位置を探しましょう。",
    stones: [
      { x: 4, y: 3, color: "white" },
      { x: 3, y: 3, color: "black" }
    ]
  },
  {
    id: "magari",
    title: "マガリ",
    description: "直角に曲がって打つ手です。形がしっかりしていて、連絡にも使われます。",
    instruction: "黒が直角に曲がって形を整える場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 4, y: 4 },
    successMessage: "正解です。直角に曲がる手がマガリです。",
    failureMessage: "マガリは、今ある黒石から直角方向に曲がる手です。",
    stones: [
      { x: 3, y: 3, color: "black" },
      { x: 4, y: 3, color: "black" }
    ]
  },
  {
    id: "ikken",
    title: "一間（いっけん）",
    description: "石から一路あけて打つ形です。攻めにも守りにもよく出てくる基本の間隔です。",
    instruction: "白石から一路あけて右に打つ一間の場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 5, y: 4 },
    successMessage: "正解です。一路あけて打つ形が一間です。",
    failureMessage: "一間は、石との間にちょうど1つの交点があく形です。",
    stones: [
      { x: 3, y: 4, color: "white" }
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
      { x: 4, y: 6, color: "black" }
    ]
  },
  {
    id: "nozoki",
    title: "ノゾキ",
    description: "『次に切りますよ』と相手に受けを迫る手です。すぐに切る手そのものではありません。",
    instruction: "黒に受けを迫る白のノゾキの場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 2 },
    successMessage: "正解です。ノゾキは、相手に『受けないと困りますよ』と迫る手です。",
    failureMessage: "今すぐ切るのではなく、次に切れる形を見せる手がノゾキです。",
    stones: [
      { x: 3, y: 3, color: "black" },
      { x: 4, y: 3, color: "black" },
      { x: 5, y: 3, color: "white" },
      { x: 2, y: 3, color: "white" }
    ]
  },
  {
    id: "tsuke",
    title: "ツケ",
    description: "相手の石にぴったりくっつけて打つ手です。接近戦の起点になります。",
    instruction: "白が黒石にツケる場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 5, y: 4 },
    successMessage: "正解です。相手の石にぴったり接する手がツケです。",
    failureMessage: "ツケは、相手の石に直接くっつく手です。",
    stones: [
      { x: 4, y: 4, color: "black" }
    ]
  },
  {
    id: "tobi",
    title: "トビ",
    description: "石から飛ぶように離れて打つ手です。中央への発展や軽い連絡に使います。",
    instruction: "白が右に一間トビする場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 5, y: 4 },
    successMessage: "正解です。軽く前に出る基本形が一間トビです。",
    failureMessage: "トビは、くっつくのではなく1つ飛んで進むイメージです。",
    stones: [
      { x: 3, y: 4, color: "white" }
    ]
  },
  {
    id: "butsukari",
    title: "ブツカリ",
    description: "相手の石にぶつかるように打つ手です。押さえ込みや戦いのきっかけになります。",
    instruction: "白が黒にぶつかるブツカリの場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 3 },
    successMessage: "正解です。相手に正面からぶつかる手がブツカリです。",
    failureMessage: "ブツカリは、相手の進路にぶつかる感覚の手です。",
    stones: [
      { x: 4, y: 4, color: "black" },
      { x: 3, y: 4, color: "white" }
    ]
  },
  {
    id: "oshi",
    title: "オシ",
    description: "相手を押しつけるように打ち、圧迫する手です。相手に受けを強要しやすい形です。",
    instruction: "白が黒を押すオシの場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 2 },
    successMessage: "正解です。相手を圧迫する手がオシです。",
    failureMessage: "相手の石を外から押しつける位置を探してみましょう。",
    stones: [
      { x: 4, y: 3, color: "black" },
      { x: 3, y: 3, color: "white" }
    ]
  },
  {
    id: "hai",
    title: "ハイ",
    description: "低いところを這うように進む手です。辺での細かい攻防でよく出てきます。",
    instruction: "黒が下辺を這うハイの場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 4, y: 7 },
    successMessage: "正解です。辺を低く這うように進むのがハイです。",
    failureMessage: "ハイは、辺に沿って低く進む手です。",
    stones: [
      { x: 3, y: 7, color: "black" },
      { x: 3, y: 6, color: "white" }
    ]
  },
  {
    id: "hiki",
    title: "ヒキ",
    description: "自分の方へ引くように打つ手です。ツケたあとの形でよく現れます。",
    instruction: "黒が自分の方へ引くヒキの場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 3, y: 4 },
    successMessage: "正解です。自分の石の方向へ引く手がヒキです。",
    failureMessage: "ヒキは、前進よりも自分の側へ引きつける感じです。",
    stones: [
      { x: 4, y: 4, color: "black" },
      { x: 5, y: 4, color: "white" },
      { x: 5, y: 3, color: "black" }
    ]
  },
  {
    id: "nobi",
    title: "ノビ",
    description: "外側へまっすぐ伸びる手です。ヒキと対になる感覚で覚えると分かりやすいです。",
    instruction: "黒が外側へ伸びるノビの場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 5, y: 4 },
    successMessage: "正解です。外へ向かって伸びる手がノビです。",
    failureMessage: "ノビは、後ろに引くのでなく外側へ伸びる手です。",
    stones: [
      { x: 4, y: 4, color: "black" },
      { x: 4, y: 3, color: "white" }
    ]
  },
  {
    id: "kakae",
    title: "カカエ",
    description: "相手の石を逃がさないように、抱え込むように打つ手です。取りに行くときの基本です。",
    instruction: "白1子を逃がさないよう、黒がカカえる場所をクリックしてください。",
    boardSize: 9,
    player: "black",
    answer: { x: 5, y: 4 },
    successMessage: "正解です。相手石を閉じ込めるように打つのがカカエです。",
    failureMessage: "逃げ道をふさぐ位置を探してみてください。",
    stones: [
      { x: 4, y: 4, color: "white" },
      { x: 4, y: 3, color: "black" },
      { x: 3, y: 4, color: "black" },
      { x: 4, y: 5, color: "black" }
    ]
  },
  {
    id: "sagari",
    title: "サガリ",
    description: "一段下がるように打つ手です。辺の地を守ったり、形を安定させたりします。",
    instruction: "白が一段下がるサガリの場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 7 },
    successMessage: "正解です。ひとつ下がって形を安定させるのがサガリです。",
    failureMessage: "サガリは、上に伸びるのでなく一段低く下がる手です。",
    stones: [
      { x: 4, y: 6, color: "white" }
    ]
  },
  {
    id: "kosumi",
    title: "コスミ",
    description: "斜めに1つずれるように打つ手です。形が柔らかく、実戦でとてもよく使います。",
    instruction: "白石から右下へコスむ場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 4, y: 4 },
    successMessage: "正解です。斜めに一つずれる手がコスミです。",
    failureMessage: "コスミは、縦横ではなく斜めの連絡です。",
    stones: [
      { x: 3, y: 3, color: "white" }
    ]
  },
  {
    id: "hiraki",
    title: "ヒラキ",
    description: "すでにある石から、地を広げるように大きく開く手です。隅や辺の基本です。",
    instruction: "左下の白から、辺に沿って大きくヒラく場所をクリックしてください。",
    boardSize: 9,
    player: "white",
    answer: { x: 5, y: 7 },
    successMessage: "正解です。勢力や地を広げるように開く手がヒラキです。",
    failureMessage: "ヒラキは、くっつくのではなく少し大きめに間をあける手です。",
    stones: [
      { x: 2, y: 7, color: "white" }
    ]
  }
];
