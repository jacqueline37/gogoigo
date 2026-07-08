window.I18N = (() => {
  const STORAGE_KEY = "gogoigo-lang";

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "ja";
    } catch (e) {
      return "ja";
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function toggleLang() {
    const next = getLang() === "ja" ? "en" : "ja";
    setLang(next);
    return next;
  }

  const ui = {
    ja: {
      common: {
        boardAriaLabel: "囲碁盤",
        cellAriaLabel: (x, y) => `${x}列 ${y}行`,
        prev: "← 前へ",
        next: "次へ →",
        loading: "読み込み中...",
        langToggleLabel: "EN",
        langToggleAriaLabel: "英語に切り替える",
      },
      index: {
        pageTitle: "囲碁の基本用語を体験で学ぶ",
        eyebrow: "Interactive Go Terms",
        h1: "囲碁の基本用語を体験で学ぶ",
        lead: "左の一覧から用語を選び、盤面をクリックして「この手かな？」を試しながら覚えるサイトです。",
        rulesLink: "用語の前提知識：ルールを体験する →",
        sidebarTitle: "19の基本用語",
        sidebarNote:
          "用語を選ぶと、その用語の短い説明と例題が表示されます。正解すると、その手でつながった石の「呼吸点」（石に隣接する空いている交点の数）も確認できます。",
        sectionLabel: "用語の説明",
        toggleSidebarOpen: "用語一覧を開く",
        toggleSidebarClose: "用語一覧を閉じる",
        reset: "リセット",
        restart: "最初からやり直す",
        restartConfirm: "最初からやり直しますか？",
        resetMessage: "盤面をリセットしました。",
        restartMessage: "最初からやり直しました。",
        stageIndicator: (current, total, solved) =>
          `第${current}問 / ${total}（${solved}問クリア）`,
        libertyLabel: (n) => `残り呼吸点: ${n}`,
        libertyTooltip:
          "呼吸点とは、石に隣接する空いている交点の数です。0になるとその石は取られます。",
        defaultInstruction: "盤面の交点をクリックして答えを選んでください。",
        defaultSuccess: "正解です。",
        defaultFailure: "そこではありません。もう一度考えてみましょう。",
        dataMissingTitle: "データが見つかりません",
        dataMissingDesc: "stages.js の読み込みに失敗している可能性があります。",
      },
      rules: {
        pageTitle: "囲碁のルールを体験で学ぶ",
        eyebrow: "Interactive Go Terms · ルール編（前提知識）",
        h1: "囲碁のルールを体験で学ぶ",
        lead:
          "「用語編」に出てくる手筋を理解するための前提知識として、呼吸点・アタリ・取る・コウといった囲碁の基本ルールを実際に石を置きながら体感するページです。",
        indexLink: "本編：用語を学ぶ →",
        sectionLabel: "ルールの説明",
        retry: "もう一度",
        stageIndicator: (current, total) => `第${current}問 / ${total}`,
        dataMissingTitle: "データが見つかりません",
        dataMissingDesc: "go-rules.js / rules-stages.js の読み込みに失敗している可能性があります。",
        capturedMessage: (n) => `${n}個の石を取りました。`,
        placedMessage: "石を置きました。",
        koWhiteTurnMessage:
          "白の番になりました。今度はすぐ取り返したくなる場所をクリックしてみてください。",
        koHintMessage: "ハイライトされた点をクリックしてみましょう。",
        forbiddenHintMessage: "今回は中央の禁止点をクリックして試してみましょう。",
        defaultInitialMessage: "交点をクリックしてください。",
        defaultSuccessMessage: "成功です。",
        forbiddenSuccessFallback: "その手は禁止されています。",
      },
    },
    en: {
      common: {
        boardAriaLabel: "Go board",
        cellAriaLabel: (x, y) => `Column ${x}, Row ${y}`,
        prev: "← Previous",
        next: "Next →",
        loading: "Loading...",
        langToggleLabel: "日本語",
        langToggleAriaLabel: "Switch to Japanese",
      },
      index: {
        pageTitle: "Learn Go Terms Hands-On",
        eyebrow: "Interactive Go Terms",
        h1: "Learn Go Terms Hands-On",
        lead:
          "Pick a term from the list on the left, then click the board to test out ‘is this the move?’ as you learn.",
        rulesLink: "Prerequisite: try the rules of Go →",
        sidebarTitle: "19 Essential Terms",
        sidebarNote:
          "Choosing a term shows a short explanation and an example. Get it right, and you can also check the “liberties” (empty intersections adjacent to the connected stones) created by that move.",
        sectionLabel: "Term Explanation",
        toggleSidebarOpen: "Show term list",
        toggleSidebarClose: "Hide term list",
        reset: "Reset",
        restart: "Start over",
        restartConfirm: "Start over from the beginning?",
        resetMessage: "Board reset.",
        restartMessage: "Restarted from the beginning.",
        stageIndicator: (current, total, solved) =>
          `Question ${current} / ${total} (${solved} solved)`,
        libertyLabel: (n) => `Liberties remaining: ${n}`,
        libertyTooltip:
          "A liberty is an empty intersection adjacent to a stone. When it reaches zero, the stone is captured.",
        defaultInstruction: "Click an intersection on the board to choose your answer.",
        defaultSuccess: "Correct!",
        defaultFailure: "That's not it. Think again.",
        dataMissingTitle: "Data not found",
        dataMissingDesc: "stages.js may have failed to load.",
      },
      rules: {
        pageTitle: "Learn the Rules of Go Hands-On",
        eyebrow: "Interactive Go Terms · Rules (Prerequisite)",
        h1: "Learn the Rules of Go Hands-On",
        lead:
          "As background for understanding the moves covered in the Terms section, this page lets you experience Go's basic rules — liberties, atari, capturing, and ko — by actually placing stones.",
        indexLink: "Main: Learn the Terms →",
        sectionLabel: "Rule Explanation",
        retry: "Retry",
        stageIndicator: (current, total) => `Question ${current} / ${total}`,
        dataMissingTitle: "Data not found",
        dataMissingDesc: "go-rules.js / rules-stages.js may have failed to load.",
        capturedMessage: (n) => `Captured ${n} stone${n === 1 ? "" : "s"}.`,
        placedMessage: "Stone placed.",
        koWhiteTurnMessage:
          "It's now White's turn. Try clicking the point where you'd want to immediately recapture.",
        koHintMessage: "Try clicking the highlighted point.",
        forbiddenHintMessage: "This time, try clicking the forbidden point in the center.",
        defaultInitialMessage: "Click an intersection to play.",
        defaultSuccessMessage: "Success!",
        forbiddenSuccessFallback: "That move is forbidden.",
      },
    },
  };

  const terms = {
    en: {
      kiri: {
        title: "Kiri",
        description:
          "A move that severs the connection between the opponent's stones. Once cut, each group must fight on its own.",
        instruction:
          "Click the point that cuts Black's connection while also connecting White's own stones.",
        successMessage:
          "Correct! A cut divides the opponent while connecting your own stones at the same time — a classic two-birds-one-stone move.",
        failureMessage: "That doesn't cut Black. Look for the point between the two Black stones.",
      },
      tsugi: {
        title: "Tsugi",
        description:
          "The opposite of a cut: filling in your own weak point so your stones become one connected group.",
        instruction: "Fill in the point White is aiming at to connect the Black stones.",
        successMessage: "Correct! Filling in your own weak point removes the risk of being cut.",
        failureMessage: "Black still isn't connected there. Look for the point White is targeting.",
      },
      hane: {
        title: "Hane",
        description: "A move that wraps diagonally around the head of the opponent's stone.",
        instruction:
          "Click the point that blocks diagonally around Black's head, starting from the White stone.",
        successMessage: "Correct! Blocking diagonally around the opponent's head is a hane.",
        failureMessage: "Hane blocks the head diagonally, not straight on.",
      },
      osae: {
        title: "Osae",
        description:
          "A move that blocks straight on, stopping the direction the opponent wants to advance.",
        instruction: "Click where Black should block before White can push further up.",
        successMessage: "Correct! Blocking straight on in the opponent's path is osae.",
        failureMessage: "Osae blocks the point the opponent wants to play next, before they get there.",
      },
      magari: {
        title: "Magari",
        description:
          "A move that bends at a right angle from your own stone to strengthen its shape.",
        instruction: "Click the point where the blocked Black stone bends at a right angle.",
        successMessage: "Correct! Bending at a right angle to make a solid shape is magari.",
        failureMessage: "Magari bends at a right angle from the existing line of Black stones.",
      },
      ikken: {
        title: "Ikken (One-Space Jump)",
        description: "A basic spacing move: playing one empty point away from your own stone.",
        instruction: "Click the one-space point, leaving a single gap from the White stone.",
        successMessage: "Correct! Leaving a single empty point between stones is ikken.",
        failureMessage: "Ikken leaves exactly one intersection of space between the stones.",
      },
      watari: {
        title: "Watari",
        description:
          "Connecting stones by using the edge of the board — an important technique especially near the side.",
        instruction: "Click the point where White connects along the bottom edge (watari).",
        successMessage: "Correct! Connecting by using the edge of the board is watari.",
        failureMessage: "Look for the point along the edge where the two White stones can connect.",
      },
      nozoki: {
        title: "Nozoki",
        description:
          "A move that says ‘I'm about to cut’ and pressures the opponent to respond. It isn't the cut itself.",
        instruction: "Click the White point that peeps at Black's weakness.",
        successMessage:
          "Correct! Rather than cutting immediately, showing that a cut is coming next is nozoki.",
        failureMessage: "Nozoki isn't played at the weak point itself, but at the point beside it.",
      },
      tsuke: {
        title: "Tsuke",
        description:
          "A move played directly against an opponent's stone. It marks the start of close-range fighting.",
        instruction: "Click the point where White attaches directly against the Black stone.",
        successMessage: "Correct! Playing directly against the opponent's stone is tsuke.",
        failureMessage: "Tsuke is played on a point directly adjacent to the opponent's stone.",
      },
      tobi: {
        title: "Tobi",
        description: "A move that leaps one space from a stone, advancing lightly.",
        instruction: "Click where the Black stone under pressure from White jumps forward.",
        successMessage: "Correct! Jumping lightly past the opponent's pressure is tobi.",
        failureMessage: "Tobi advances by leaping one space, not by playing right next to the stone.",
      },
      butsukari: {
        title: "Butsukari",
        description:
          "A move that runs a stone straight into the opponent's stone, backed up by your own stone behind it.",
        instruction: "Click the point where Black bumps into the White stone.",
        successMessage:
          "Correct! Bumping straight into the opponent's stone while backed up from behind is butsukari.",
        failureMessage: "Butsukari makes direct contact with the opponent's stone, straight on.",
      },
      oshi: {
        title: "Oshi",
        description: "A move that pushes straight along the opponent's stone.",
        instruction: "Click where White pushes straight along the line of Black stones.",
        successMessage: "Correct! Pushing straight ahead is oshi.",
        failureMessage: "Oshi pushes straight forward, not diagonally.",
      },
      hai: {
        title: "Hai",
        description: "A move that crawls low along the very edge of the board.",
        instruction: "Click where the pressured Black stone crawls along the edge.",
        successMessage: "Correct! Crawling low along the edge of the board is hai.",
        failureMessage: "Hai advances along the very edge line of the board.",
      },
      hiki: {
        title: "Hiki",
        description:
          "Instead of pushing forward, a move that pulls back toward your own stone to settle it.",
        instruction: "Click where the pressured Black stone draws back toward its own stone.",
        successMessage:
          "Correct! Rather than forcing forward, pulling back toward your own stone to settle is hiki.",
        failureMessage: "Hiki draws back toward your own stone instead of pushing forward.",
      },
      nobi: {
        title: "Nobi",
        description: "A move that extends straight outward from your own stone.",
        instruction: "Click where the White stone touched by Black extends straight outward.",
        successMessage: "Correct! Extending straight outward is nobi.",
        failureMessage: "Nobi extends outward, rather than drawing back.",
      },
      kakae: {
        title: "Kakae",
        description:
          "A move that blocks every escape route of the opponent's stone, enclosing and capturing it.",
        instruction: "Click the point where Black blocks the White stone's last escape route.",
        successMessage:
          "Correct! Blocking every escape route to enclose and capture the opponent is kakae.",
        failureMessage: "Kakae blocks the opponent's last remaining escape route.",
      },
      sagari: {
        title: "Sagari",
        description:
          "A move that steps down toward the edge of the board, rather than toward the center.",
        instruction: "Click where the pressured White stone descends toward the edge of the board.",
        successMessage: "Correct! Stepping down toward the edge of the board is sagari.",
        failureMessage: "Sagari steps down toward the edge, rather than extending outward.",
      },
      kosumi: {
        title: "Kosumi",
        description: "A gentle connecting move played one point diagonally from your own stone.",
        instruction: "Click the point diagonally adjacent to the Black stone.",
        successMessage: "Correct! Shifting one point diagonally to connect is kosumi.",
        failureMessage: "Kosumi is played on a diagonal point, not a straight line.",
      },
      hiraki: {
        title: "Hiraki",
        description:
          "A move that opens widely from your stone on the side, staking out territory.",
        instruction: "Click where White should make a wide extension from the stone on the top side.",
        successMessage: "Correct! Opening widely along the side to stake out territory is hiraki.",
        failureMessage: "Hiraki leaves a wider gap than playing right next to the stone.",
      },
    },
  };

  const rulesContent = {
    en: {
      liberty: {
        title: "Liberties",
        subtitle: "Learn about the “breathing space” a stone has",
        description:
          "Every stone on the board has empty points directly adjacent to it — up, down, left, and right — called liberties. When all of a stone's liberties are filled, it gets captured.",
        objective:
          "The Black stone in the center has 4 liberties (highlighted points). Try placing another Black stone on the point to the right.",
        initialMessage:
          "The highlighted points are the Black stone's liberties. Try placing a Black stone on one of them.",
        successMessage: "Correct! When you connect stones together, the whole group's liberties increase.",
      },
      atari: {
        title: "Atari",
        subtitle: "When a stone has only one liberty left",
        description:
          "A stone with only one liberty remaining is said to be in “atari” — a dangerous state where the next move can capture it.",
        objective:
          "The White stone currently has 2 liberties (highlighted points). Fill in one of them with Black to put White in atari.",
        initialMessage: "The White stone has 2 liberties. Playing Black on either one puts it in atari.",
        successMessage: "Correct! The White stone now has only one liberty left. This is “atari.”",
      },
      capture: {
        title: "Capturing a Stone",
        subtitle: "When liberties reach zero, the stone is removed from the board",
        description:
          "When you fill in all of the opponent's liberties, that stone (or group) is captured and removed from the board.",
        objective: "The White stone has only 1 liberty left. Play Black there to capture it.",
        initialMessage: "The White stone has only 1 liberty left (highlighted point). Play Black there.",
        successMessage: "Correct! With no liberties left, the White stone was captured and removed from the board.",
      },
      suicide: {
        title: "Suicide Moves Are Forbidden",
        subtitle: "You can't play a move that leaves your own stone with zero liberties",
        description:
          "A move that would leave your own stone with zero liberties the instant it's played (a suicide move) cannot be played under the rules.",
        objective:
          "The center point is surrounded on all four sides by White. Try playing Black there to see why it's forbidden.",
        initialMessage: "Try clicking the center point.",
        successMessage:
          "That move is forbidden as a suicide move — it would leave the Black stone with zero liberties the instant it's played.",
      },
      ko: {
        title: "Ko",
        subtitle: "The rule against immediately repeating the same board position",
        description:
          "If recapturing a stone would return the board to its exact previous position, that immediate recapture is forbidden. This situation is called “ko.”",
        objective: "Capture the White stone with Black. Then try to immediately recapture it with White.",
        initialMessage: "The White stone has only 1 liberty left. Play Black to capture it.",
        successMessage: "Success! In a ko, you can't immediately repeat the same board position.",
      },
    },
  };

  const goRules = {
    ja: {
      outOfBounds: "盤外です。",
      occupied: "その交点にはすでに石があります。",
      suicide: "自分の石の呼吸点がなくなるため、自殺手です。",
      ko: "コウです。同じ盤面をすぐには繰り返せません。",
    },
    en: {
      outOfBounds: "That's outside the board.",
      occupied: "There's already a stone there.",
      suicide: "That move would leave your own stone with no liberties — a suicide move.",
      ko: "That's a ko. You can't immediately repeat the same board position.",
    },
  };

  return { getLang, setLang, toggleLang, ui, terms, rulesContent, goRules };
})();
