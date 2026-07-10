// =====================================================================
// data.js — the word bank. THIS is the file to edit to add/change words.
// =====================================================================
//
// How a word is encoded:
//   Each entry is [casedWord, 中文, exampleSentence, category].
//   In `casedWord`, UPPERCASE letters mark the "trap" letters (the hard
//   part a phonics speller gets wrong). They drive the 填陷阱 (Fill-the-Trap)
//   blanks and the yellow highlight on the answer reveal.
//     e.g. "neCeSSary" → word "necessary", traps at c, s, s
//          "Know"      → word "know",      trap at the silent k
//
// Categories (see CATS below): A silent · B irregular · C weak-vowel ·
//   D double-letters · E homophones · F long words.

export const CATS = {
  A: { name: "不發音字母", en: "Silent letters", color: "var(--catA)" },
  B: { name: "不規則拼字", en: "Irregular",      color: "var(--catB)" },
  C: { name: "弱化母音",   en: "Weak vowel",     color: "var(--catC)" },
  D: { name: "雙子音",     en: "Double letters", color: "var(--catD)" },
  E: { name: "同音字",     en: "Homophones",     color: "var(--catE)" },
  F: { name: "長字多音節", en: "Long words",     color: "var(--catF)" },
};

// [casedWord, 中文, example sentence, category]
const RAW = [
  // ---- A: silent letters ----
  ["Know", "知道", "I Know your name.", "A"], ["Knife", "刀子", "Cut it with a Knife.", "A"],
  ["Knee", "膝蓋", "My Knee hurts.", "A"], ["Knock", "敲門", "Knock on the door.", "A"],
  ["Knowledge", "知識", "Books give us Knowledge.", "A"], ["Write", "寫", "Write your name here.", "A"],
  ["Wrong", "錯的", "That answer is Wrong.", "A"], ["Wrist", "手腕", "She wears it on her Wrist.", "A"],
  ["comB", "梳子", "Comb your hair.", "A"], ["climB", "爬", "We climB the hill.", "A"],
  ["thumB", "拇指", "Thumbs up!", "A"], ["douBt", "懷疑", "I douBt it is true.", "A"],
  ["haLf", "一半", "Give me haLf, please.", "A"], ["caLm", "冷靜", "Stay caLm and smile.", "A"],
  ["waLk", "走路", "Let's waLk to school.", "A"], ["taLk", "說話", "We taLk on the phone.", "A"],
  ["iSland", "島", "They live on an iSland.", "A"], ["lisTen", "聽", "lisTen to the music.", "A"],
  ["casTle", "城堡", "The king lives in a casTle.", "A"], ["gUitar", "吉他", "He plays the gUitar.", "A"],
  ["foreiGn", "外國的", "She learns a foreiGn language.", "A"], ["autumN", "秋天", "Leaves fall in autumN.", "A"],
  // ---- B: irregular ----
  ["frIEnd", "朋友", "You are my best frIEnd.", "B"], ["bEAUtiful", "美麗的", "What a bEAUtiful day!", "B"],
  ["bECAUse", "因為", "I smile bECAUse I'm happy.", "B"], ["pEOple", "人們", "Many pEOple are here.", "B"],
  ["Once", "一次", "I go there Once a week.", "B"], ["tWo", "二", "I have tWo cats.", "B"],
  ["eYe", "眼睛", "Close your eYes.", "B"], ["busIness", "生意", "My dad runs a busIness.", "B"],
  ["bUIld", "建造", "They bUIld a house.", "B"], ["frOnt", "前面", "Sit in the frOnt.", "B"],
  ["mOnth", "月份", "June is my favorite mOnth.", "B"], ["lauGH", "笑", "You make me lauGH.", "B"],
  ["enouGH", "足夠", "I have enouGH money.", "B"], ["tonGUe", "舌頭", "Don't bite your tonGUe.", "B"],
  ["sUgar", "糖", "Add some sUgar, please.", "B"], ["ansWer", "答案", "I know the ansWer.", "B"],
  ["Honest", "誠實的", "Be Honest with me.", "B"], ["hEArt", "心", "I love you with all my hEArt.", "B"],
  // ---- C: weak vowel (schwa) ----
  ["About", "關於", "Tell me About it.", "C"], ["animAl", "動物", "A dog is an animAl.", "C"],
  ["banAna", "香蕉", "I eat a banAna.", "C"], ["chocOlate", "巧克力", "I love chocOlate cake.", "C"],
  ["comfortAble", "舒服的", "This bed is comfortAble.", "C"], ["dangErous", "危險的", "Fire is dangErous.", "C"],
  ["diffErent", "不同的", "We are diffErent.", "C"], ["elephAnt", "大象", "The elephAnt is big.", "C"],
  ["famIly", "家庭", "I love my famIly.", "C"], ["hospItal", "醫院", "She works at a hospItal.", "C"],
  ["importAnt", "重要的", "This is importAnt.", "C"], ["mountAIn", "山", "We climb the mountAIn.", "C"],
  ["restAUrant", "餐廳", "We eat at a restAUrant.", "C"], ["secOnd", "秒／第二", "Wait a secOnd.", "C"],
  ["sentEnce", "句子", "Write one sentEnce.", "C"], ["tempErature", "溫度", "Check the tempErature.", "C"],
  ["tOgether", "一起", "Let's play tOgether.", "C"], ["tOmorrow", "明天", "See you tOmorrow.", "C"],
  ["vegEtable", "蔬菜", "Eat your vegEtables.", "C"], ["problEm", "問題", "No problEm!", "C"],
  // ---- D: double letters ----
  ["neCeSSary", "必要的", "Sleep is neCeSSary.", "D"], ["aDDreSS", "地址", "Write your aDDreSS.", "D"],
  ["embaRRaSS", "使尷尬", "Don't embaRRaSS me.", "D"], ["begiNNing", "開始", "This is the begiNNing.", "D"],
  ["diNNer", "晚餐", "diNNer is ready!", "D"], ["coFFee", "咖啡", "Mom drinks coFFee.", "D"],
  ["boRRow", "借入", "May I boRRow a pen?", "D"], ["aRRive", "到達", "We aRRive at six.", "D"],
  ["haPPen", "發生", "What will haPPen?", "D"], ["coLLege", "大學", "She goes to coLLege.", "D"],
  ["coMMon", "常見的", "Cats are coMMon pets.", "D"], ["cuRRent", "目前的", "What's the cuRRent time?", "D"],
  ["umbreLLa", "雨傘", "Take an umbreLLa.", "D"], ["baLLoon", "氣球", "The baLLoon is red.", "D"],
  ["diFFerence", "差別", "What's the diFFerence?", "D"], ["aSSistant", "助理", "She is my aSSistant.", "D"],
  // ---- F: long words ----
  ["refrigErator", "冰箱", "Milk is in the refrigErator.", "F"], ["dictiOnary", "字典", "Use a dictiOnary.", "F"],
  ["informAtion", "資訊", "I need more informAtion.", "F"], ["univErsity", "大學", "He studies at a univErsity.", "F"],
  ["vocabUlary", "字彙", "Learn new vocabUlary.", "F"], ["enviroNment", "環境", "Protect the enviroNment.", "F"],
  ["intErEsting", "有趣的", "This book is intErEsting.", "F"], ["especiAlly", "尤其", "I like fruit, especiAlly apples.", "F"],
  ["supermArket", "超市", "We shop at the supermArket.", "F"], ["televIsion", "電視", "Turn off the televIsion.", "F"],
  ["watermElon", "西瓜", "watermElon is sweet.", "F"], ["congratUlation", "恭喜", "congratUlations to you!", "F"],
];

// Homophones: [ [words...], 中文, sentence-with-___, correctAnswer ]
const HOMO = [
  [["to", "too", "two"], "到／也／二", "I have ___ apples.", "two"],
  [["there", "their"], "那裡／他們的", "Put it over ___.", "there"],
  [["write", "right"], "寫／對", "Please ___ your name.", "write"],
  [["week", "weak"], "星期／虛弱", "There are 7 days in a ___.", "week"],
  [["meat", "meet"], "肉／見面", "Let's ___ at 3 o'clock.", "meet"],
  [["know", "no"], "知道／不", "I ___ the answer.", "know"],
  [["here", "hear"], "這裡／聽見", "Can you ___ me?", "hear"],
  [["sea", "see"], "海／看見", "I ___ a bird.", "see"],
  [["flour", "flower"], "麵粉／花", "A rose is a ___.", "flower"],
  [["piece", "peace"], "一片／和平", "I want a ___ of cake.", "piece"],
  [["our", "hour"], "我們的／小時", "One ___ has 60 minutes.", "hour"],
  [["buy", "by"], "買／在旁邊", "I want to ___ a toy.", "buy"],
];

// Split a cased word into its lowercase spelling + a boolean "trap" mask.
function parse(cased) {
  let word = "";
  const mask = [];
  for (const ch of cased) {
    const low = ch.toLowerCase();
    mask.push(ch !== low && ch >= "A" && ch <= "Z");
    word += low;
  }
  return { word, mask };
}

// A word object: { id, word, mask[], zh, sent, cat, homo? }
function buildWords() {
  const list = RAW.map((r, i) => {
    const { word, mask } = parse(r[0]);
    return { id: "w" + i, word, mask, zh: r[1], sent: r[2], cat: r[3] };
  });
  HOMO.forEach((h, i) => {
    list.push({
      id: "h" + i, word: h[3], mask: h[3].split("").map(() => false),
      zh: h[1], sent: h[2], cat: "E", homo: h[0],
    });
  });
  return list;
}

export const WORDS = buildWords();
