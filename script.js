// ===== STATE =====
let currentChapterId = null;
let memorized = JSON.parse(localStorage.getItem("lunyu_memorized") || "{}");
let speaking = false;
let currentUtterance = null;
let textMode = localStorage.getItem("lunyu_text_mode") || "traditional";
let themeFilter = localStorage.getItem("lunyu_theme_filter") || "all";

const mascotMessages = [
  "今天读一小段就很好。小步走，也是在前进。",
  "遇到难句子，可以先听朗读，再看儿童导读。",
  "把喜欢的一句标记起来，慢慢变成自己的宝物。",
  "读《论语》不是背古文比赛，是练习怎样做一个温柔、可靠的人。",
  "可以和爸爸妈妈一起选一句，聊聊今天在哪里用得到。"
];

const themeRules = [
  { keys: ["學", "习", "習", "問", "闻", "聞", "知"], label: "学习", simple: "这句话提醒我们：学习要常常练习，也要愿意提问和思考。", jp: "学ぶこと、考えることを大切にする言葉です。" },
  { keys: ["孝", "父", "母", "弟", "兄"], label: "孝亲", simple: "这句话和家人有关：爱家人，不只是听话，也包括尊敬、关心和体谅。", jp: "家族を大切にし、敬う心についての言葉です。" },
  { keys: ["仁", "恕", "愛", "爱", "惠", "寬", "宽"], label: "仁爱", simple: "这句话讲的是仁爱：待人友善，能想到别人的感受。", jp: "人にやさしくする心についての言葉です。" },
  { keys: ["禮", "礼", "樂", "乐", "祭", "敬"], label: "礼仪", simple: "这句话讲礼：做事有分寸，心里有尊重，外在的规矩才有意义。", jp: "礼儀や敬う心についての言葉です。" },
  { keys: ["信", "忠", "言"], label: "诚信", simple: "这句话提醒我们：说话要真诚，答应的事要认真做到。", jp: "正直に話し、約束を大切にする言葉です。" },
  { keys: ["義", "义", "勇", "直"], label: "正直", simple: "这句话鼓励我们：看到应该做的事，要有勇气，也要守住正直。", jp: "正しいことを選ぶ勇気についての言葉です。" },
  { keys: ["君子", "小人", "德"], label: "品格", simple: "这句话在比较不同的做人方式，提醒我们培养稳定、善良的品格。", jp: "よい人柄を育てるための言葉です。" },
  { keys: ["政", "民", "邦", "國", "国", "君", "臣"], label: "治理", simple: "这句话讲的是管理和责任：有权力的人更要公平、守礼、关心大家。", jp: "人を導く責任についての言葉です。" },
  { keys: ["友", "朋", "交"], label: "朋友", simple: "这句话和朋友有关：真正的朋友会互相提醒、互相信任。", jp: "友だちとの信頼についての言葉です。" },
  { keys: ["過", "过", "改", "省"], label: "反省", simple: "这句话告诉我们：犯错不可怕，能发现错误并改正，才会成长。", jp: "まちがいに気づき、直していくための言葉です。" }
];

const traditionalToSimplified = {
  學: "学", 習: "习", 說: "说", 悅: "悦", 樂: "乐", 來: "来", 遠: "远", 慍: "愠", 爲: "为",
  鮮: "鲜", 矣: "矣", 務: "务", 與: "与", 禮: "礼", 貴: "贵", 復: "复", 恥: "耻", 讓: "让",
  飽: "饱", 居: "居", 敏: "敏", 愼: "慎", 諂: "谄", 驕: "骄", 詩: "诗", 云: "云", 吿: "告",
  政: "政", 德: "德", 譬: "譬", 衆: "众", 共: "拱", 蔽: "蔽", 邪: "邪", 道: "道", 齊: "齐",
  刑: "刑", 免: "免", 違: "违", 禦: "御", 對: "对", 養: "养", 別: "别", 飮: "饮", 饌: "馔",
  視: "视", 觀: "观", 察: "察", 溫: "温", 器: "器", 從: "从", 周: "周", 罔: "罔", 殆: "殆",
  誨: "诲", 女: "汝", 知: "知", 闕: "阙", 愼: "慎", 尤: "尤", 擧: "举", 錯: "错", 勸: "劝",
  書: "书", 輗: "輗", 軏: "軏", 禘: "禘", 廟: "庙", 鄹: "邹", 聞: "闻", 喪: "丧", 寬: "宽",
  儉: "俭", 寧: "宁", 戚: "戚", 夷: "夷", 狄: "狄", 諸: "诸", 亡: "无", 旅: "旅", 揖: "揖",
  盼: "盼", 繪: "绘", 獻: "献", 灌: "灌", 獲: "获", 監: "鉴", 鬱: "郁", 射: "射", 朔: "朔",
  餼: "饩", 賜: "赐", 語: "语", 魯: "鲁", 師: "师", 樂: "乐", 韶: "韶", 武: "武", 盡: "尽",
  處: "处", 惡: "恶", 尙: "尚", 黨: "党", 朝: "朝", 閒: "间", 顚: "颠", 沛: "沛", 懷: "怀",
  惠: "惠", 怨: "怨", 參: "参", 貫: "贯", 齊: "齐", 諫: "谏", 勞: "劳", 遊: "游", 幾: "几",
  訥: "讷", 數: "数", 疏: "疏", 長: "长", 妻: "妻", 縲: "缧", 絏: "绁", 廢: "废", 戮: "戮",
  貢: "贡", 佞: "佞", 禦: "御", 說: "说", 桴: "桴", 浮: "浮", 賦: "赋", 賓: "宾", 齊: "齐",
  晝: "昼", 寢: "寝", 朽: "朽", 雕: "雕", 牆: "墙", 杇: "圬", 慾: "欲", 諸: "诸", 產: "产",
  養: "养", 善: "善", 節: "节", 藻: "藻", 梲: "梲", 淸: "清", 甯: "宁", 黨: "党", 斐: "斐",
  舊: "旧", 念: "念", 醯: "醯", 鄰: "邻", 匿: "匿", 顏: "颜", 淵: "渊", 裘: "裘", 憾: "憾",
  伐: "伐", 勞: "劳", 訟: "讼", 邑: "邑", 雍: "雍", 簡: "简", 臨: "临", 遷: "迁", 貳: "贰",
  釜: "釜", 庾: "庾", 粟: "粟", 騂: "骍", 角: "角", 舍: "舍", 藝: "艺", 閔: "闵", 騫: "骞",
  費: "费", 牖: "牖", 簞: "箪", 瓢: "瓢", 語: "语", 彬: "彬", 知: "知", 蕩: "荡", 賊: "贼",
  絞: "绞", 亂: "乱", 剛: "刚", 聖: "圣", 堯: "尧", 舜: "舜", 濟: "济", 眾: "众", 慾: "欲",
  達: "达", 識: "识", 厭: "厌", 誨: "诲", 憤: "愤", 啟: "启", 悱: "悱", 發: "发", 隅: "隅",
  藏: "藏", 馮: "凭", 懼: "惧", 謀: "谋", 齊: "齐", 疾: "疾", 聽: "听", 顔: "颜", 擇: "择",
  鄕: "乡", 黨: "党", 儺: "傩", 階: "阶", 趨: "趋", 謹: "谨", 衣: "衣", 裘: "裘", 褻: "亵",
  寢: "寝", 齋: "斋", 席: "席", 饋: "馈", 魚: "鱼", 膾: "脍", 醬: "酱", 沽: "沽", 酒: "酒",
  廄: "厩", 傷: "伤", 廷: "廷", 賜: "赐", 閔: "闵", 門: "门", 閔: "闵", 詳: "详", 由: "由",
  願: "愿", 車: "车", 馬: "马", 輕: "轻", 裘: "裘", 敝: "敝", 憾: "憾", 輿: "舆", 衞: "卫",
  靈: "灵", 憲: "宪", 問: "问", 稱: "称", 讓: "让", 遜: "逊", 讓: "让", 詐: "诈", 諒: "谅",
  損: "损", 益: "益", 便: "便", 辟: "辟", 侍: "侍", 愆: "愆", 躁: "躁", 隱: "隐", 瞽: "瞽",
  戒: "戒", 鬭: "斗", 畏: "畏", 聖: "圣", 狎: "狎", 視: "视", 聽: "听", 聰: "聪", 溫: "温",
  貌: "貌", 忿: "忿", 難: "难", 湯: "汤", 隱: "隐", 齊: "齐", 景: "景", 駟: "驷", 稱: "称",
  詩: "诗", 趨: "趋", 過: "过", 庭: "庭", 禮: "礼", 兒: "儿", 陽: "阳", 貨: "货", 歸: "归",
  塗: "涂", 諾: "诺", 將: "将", 仕: "仕", 近: "近", 遠: "远", 弦: "弦", 雞: "鸡", 擾: "扰",
  費: "费", 畔: "叛", 說: "说", 堅: "坚", 磷: "磷", 白: "白", 涅: "涅", 緇: "缁", 匏: "匏",
  繫: "系", 蔽: "蔽", 興: "兴", 邇: "迩", 鳥: "鸟", 獸: "兽", 禮: "礼", 帛: "帛", 鐘: "钟",
  厲: "厉", 荏: "荏", 譬: "譬", 盜: "盗", 鄕: "乡", 聽: "听", 塗: "涂", 棄: "弃", 憂: "忧",
  鑽: "钻", 燧: "燧", 穀: "谷", 錦: "锦", 懷: "怀", 飽: "饱", 博: "博", 弈: "弈", 尙: "尚",
  稱: "称", 訕: "讪", 訐: "讦", 維: "维", 微: "微", 箕: "箕", 諫: "谏", 黜: "黜", 待: "待",
  閒: "间", 歸: "归", 女: "女", 樂: "乐", 鳳: "凤", 諫: "谏", 趨: "趋", 辟: "避", 長: "长",
  耦: "耦", 津: "津", 輿: "舆", 誰: "谁", 魯: "鲁", 滔: "滔", 輟: "辍", 吿: "告", 獸: "兽",
  群: "群", 蓧: "蓧", 植: "植", 見: "见", 廢: "废", 潔: "洁", 倫: "伦", 亞: "亚", 飯: "饭",
  鼓: "鼓", 播: "播", 鼗: "鼗", 適: "适", 齊: "齐", 楚: "楚", 蔡: "蔡", 秦: "秦", 親: "亲",
  怨: "怨", 故: "故", 舊: "旧", 棄: "弃", 備: "备", 張: "张", 危: "危", 致: "致", 執: "执",
  篤: "笃", 亡: "无", 門: "门", 交: "交", 賢: "贤", 衆: "众", 矜: "矜", 雖: "虽", 道: "道",
  遠: "远", 泥: "泥", 無: "无", 謂: "谓", 寬: "宽", 洒: "洒", 掃: "扫", 應: "应", 對: "对",
  進: "进", 退: "退", 傳: "传", 誣: "诬", 優: "优", 喪: "丧", 莊: "庄", 讓: "让", 陽: "阳",
  膚: "肤", 士: "士", 師: "师", 實: "实", 矜: "矜", 衞: "卫", 墻: "墙", 闚: "窥", 廟: "庙",
  與: "与", 譽: "誉", 毀: "毁", 踰: "逾", 階: "阶", 昇: "升", 曆: "历", 數: "数", 躬: "躬",
  終: "终", 賚: "赉", 親: "亲", 百: "百", 姓: "姓", 過: "过", 謹: "谨", 權: "权", 量: "量",
  審: "审", 脩: "修", 廢: "废", 滅: "灭", 繼: "继", 絕: "绝", 舉: "举", 歸: "归", 寬: "宽",
  費: "费", 勞: "劳", 貪: "贪", 驕: "骄", 擇: "择", 猛: "猛", 屛: "屏", 惡: "恶", 虐: "虐",
  戒: "戒", 視: "视", 暴: "暴", 賊: "贼", 納: "纳", 吝: "吝", 命: "命", 無: "无"
};

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  buildSidebar();
  showHome();
  setupMascot();
  updateProgress();

  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) homeBtn.addEventListener("click", showHome);
});

// ===== HELPERS =====
function allLessons() {
  return lunyuData.chapters.flatMap(ch => ch.lessons.map(lesson => ({ ...lesson, chapter: ch })));
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHTML(value).replace(/`/g, "&#96;");
}

function toSimplified(text) {
  return String(text).split("").map(ch => traditionalToSimplified[ch] || ch).join("");
}

function displayText(text) {
  return textMode === "simplified" ? toSimplified(text) : text;
}

const japanesePhraseReadings = {
  "子曰": "しいわく",
  "孔子": "こうし",
  "夫子": "ふうし",
  "君子": "くんし",
  "小人": "しょうじん",
  "有子": "ゆうし",
  "曾子": "そうし",
  "子貢": "しこう",
  "子路": "しろ",
  "子夏": "しか",
  "子游": "しゆう",
  "子張": "しちょう",
  "子禽": "しきん",
  "孟子": "もうし",
  "孟武伯": "もうぶはく",
  "孟懿子": "もういし",
  "顏淵": "がんえん",
  "顔淵": "がんえん",
  "仲尼": "ちゅうじ",
  "伯夷": "はくい",
  "叔齊": "しゅくせい",
  "禮樂": "れいがく",
  "礼乐": "れいがく",
  "仁者": "じんしゃ",
  "知者": "ちしゃ",
  "孝弟": "こうてい",
  "朋友": "ほうゆう",
  "父母": "ふぼ",
  "詩": "し",
  "書": "しょ",
  "禮": "れい",
  "樂": "がく",
  "学": "がく",
  "學": "がく"
};

const japaneseKanjiReadings = {
  一: "いち", 二: "に", 三: "さん", 四: "し", 五: "ご", 六: "ろく", 七: "しち", 八: "はち", 九: "きゅう", 十: "じゅう", 百: "ひゃく", 千: "せん", 萬: "まん", 万: "まん",
  子: "し", 曰: "えつ", 學: "がく", 学: "がく", 而: "じ", 時: "じ", 習: "しゅう", 习: "しゅう", 之: "し", 不: "ふ", 亦: "えき", 說: "えつ", 说: "えつ", 乎: "こ", 有: "ゆう", 朋: "ほう", 自: "じ", 遠: "えん", 远: "えん", 方: "ほう", 來: "らい", 来: "らい", 樂: "がく", 乐: "がく", 人: "じん", 知: "ち", 慍: "うん", 君: "くん",
  其: "き", 爲: "い", 为: "い", 也: "や", 孝: "こう", 弟: "てい", 好: "こう", 犯: "はん", 上: "じょう", 者: "しゃ", 鮮: "せん", 鲜: "せん", 矣: "い", 作: "さく", 亂: "らん", 乱: "らん", 未: "み", 務: "む", 务: "む", 本: "ほん", 立: "りつ", 道: "どう", 生: "せい", 仁: "じん", 與: "よ", 与: "よ",
  巧: "こう", 言: "げん", 令: "れい", 色: "しょく", 曾: "そう", 吾: "ご", 日: "じつ", 省: "せい", 身: "しん", 謀: "ぼう", 谋: "ぼう", 忠: "ちゅう", 友: "ゆう", 交: "こう", 信: "しん", 傳: "でん", 传: "でん",
  政: "せい", 國: "こく", 国: "こく", 敬: "けい", 事: "じ", 節: "せつ", 节: "せつ", 用: "よう", 愛: "あい", 爱: "あい", 使: "し", 民: "みん", 以: "い", 入: "にゅう", 則: "そく", 则: "そく", 出: "しゅつ", 謹: "きん", 谨: "きん", 汎: "はん", 眾: "しゅう", 众: "しゅう", 親: "しん", 亲: "しん", 行: "こう", 餘: "よ", 余: "よ", 力: "りょく", 文: "ぶん",
  夏: "か", 賢: "けん", 贤: "けん", 易: "えき", 父: "ふ", 母: "ぼ", 能: "のう", 竭: "けつ", 致: "ち", 雖: "すい", 虽: "すい", 必: "ひつ", 謂: "い", 谓: "い", 已: "い", 重: "じゅう", 威: "い", 固: "こ", 主: "しゅ", 無: "む", 无: "む", 如: "じょ", 己: "こ", 過: "か", 过: "か", 勿: "ぶつ", 憚: "たん", 惮: "たん", 改: "かい",
  愼: "しん", 慎: "しん", 終: "しゅう", 终: "しゅう", 追: "つい", 歸: "き", 归: "き", 厚: "こう", 禮: "れい", 礼: "れい", 和: "わ", 貴: "き", 贵: "き", 先: "せん", 王: "おう", 美: "び", 小: "しょう", 大: "だい", 由: "ゆう", 所: "しょ", 可: "か", 義: "ぎ", 义: "ぎ", 復: "ふく", 复: "ふく", 恭: "きょう", 近: "きん", 恥: "ち", 耻: "ち", 辱: "じょく", 因: "いん", 失: "しつ", 宗: "そう",
  食: "しょく", 求: "きゅう", 飽: "ほう", 饱: "ほう", 居: "きょ", 安: "あん", 敏: "びん", 就: "しゅう", 正: "せい", 焉: "えん", 貧: "ひん", 贫: "ひん", 富: "ふ", 諂: "てん", 谄: "てん", 驕: "きょう", 骄: "きょう", 何: "か", 若: "じゃく", 詩: "し", 诗: "し", 云: "うん", 切: "せつ", 磋: "さ", 琢: "たく", 磨: "ま", 賜: "し", 赐: "し", 始: "し", 告: "こく", 吿: "こく", 往: "おう",
  德: "とく", 徳: "とく", 譬: "ひ", 如: "じょ", 北: "ほく", 辰: "しん", 星: "せい", 共: "きょう", 蔽: "へい", 思: "し", 邪: "じゃ", 齊: "せい", 齐: "せい", 刑: "けい", 免: "めん", 違: "い", 违: "い", 恥: "ち", 且: "しょ", 格: "かく", 十: "じゅう", 志: "し", 于: "う", 惑: "わく", 天: "てん", 命: "めい", 耳: "じ", 順: "じゅん", 顺: "じゅん", 從: "じゅう", 从: "じゅう", 心: "しん", 欲: "よく", 踰: "ゆ", 矩: "く",
  問: "もん", 问: "もん", 違: "い", 御: "ぎょ", 對: "たい", 对: "たい", 御: "ぎょ", 何: "か", 事: "じ", 死: "し", 葬: "そう", 祭: "さい", 唯: "ゆい", 疾: "しつ", 憂: "ゆう", 忧: "ゆう", 養: "よう", 养: "よう", 至: "し", 犬: "けん", 馬: "ば", 马: "ば", 皆: "かい", 別: "べつ", 别: "べつ", 難: "なん", 难: "なん", 服: "ふく", 勞: "ろう", 劳: "ろう", 酒: "しゅ", 先生: "せんせい", 饌: "せん",
  回: "かい", 視: "し", 视: "し", 觀: "かん", 观: "かん", 察: "さつ", 溫: "おん", 温: "おん", 故: "こ", 新: "しん", 師: "し", 师: "し", 器: "き", 周: "しゅう", 比: "ひ", 罔: "もう", 殆: "たい", 攻: "こう", 異: "い", 异: "い", 端: "たん", 害: "がい", 由: "ゆう", 誨: "かい", 诲: "かい", 女: "じょ", 闕: "けつ", 阙: "けつ", 疑: "ぎ", 寡: "か", 尤: "ゆう", 見: "けん", 见: "けん", 悔: "かい", 祿: "ろく", 禄: "ろく",
  哀: "あい", 公: "こう", 舉: "きょ", 举: "きょ", 直: "ちょく", 錯: "そ", 错: "そ", 諸: "しょ", 诸: "しょ", 枉: "おう", 季: "き", 康: "こう", 臨: "りん", 临: "りん", 莊: "そう", 庄: "そう", 慈: "じ", 善: "ぜん", 教: "きょう", 勸: "かん", 劝: "かん", 或: "わく", 書: "しょ", 书: "しょ", 車: "しゃ", 车: "しゃ", 輗: "げい", 軏: "げつ", 世: "せい", 殷: "いん", 損: "そん", 损: "そん", 益: "えき", 繼: "けい", 继: "けい", 百: "ひゃく", 鬼: "き", 勇: "ゆう",
  八: "はち", 佾: "いつ", 舞: "ぶ", 庭: "てい", 忍: "にん", 孰: "じゅく", 雍: "よう", 徹: "てつ", 相: "そう", 維: "い", 穆: "ぼく", 堂: "どう", 林: "りん", 放: "ほう", 奢: "しゃ", 寧: "ねい", 宁: "ねい", 儉: "けん", 俭: "けん", 喪: "そう", 丧: "そう", 戚: "せき", 夷: "い", 狄: "てき", 諸: "しょ", 夏: "か", 泰: "たい", 山: "さん", 冉: "ぜん", 救: "きゅう", 嗚: "お", 曾: "そう", 謂: "い", 揖: "ゆう", 讓: "じょう", 让: "じょう", 升: "しょう", 飮: "いん", 饮: "いん",
  笑: "しょう", 倩: "せん", 素: "そ", 繪: "かい", 绘: "かい", 起: "き", 商: "しょう", 獻: "けん", 献: "けん", 足: "そく", 徵: "ちょう", 宋: "そう", 禘: "てい", 灌: "かん", 掌: "しょう", 罪: "ざい", 禱: "とう", 祷: "とう", 監: "かん", 鑒: "かん", 文: "ぶん", 獲: "かく", 廟: "びょう", 庙: "びょう", 每: "まい", 孰: "じゅく", 射: "しゃ", 皮: "ひ", 賜: "し", 盡: "じん", 尽: "じん", 管: "かん", 仲: "ちゅう", 官: "かん", 邦: "ほう", 樹: "じゅ", 树: "じゅ", 門: "もん", 门: "もん",
  里: "り", 擇: "たく", 择: "たく", 處: "しょ", 处: "しょ", 長: "ちょう", 长: "ちょう", 惡: "あく", 恶: "あく", 尚: "しょう", 尙: "しょう", 黨: "とう", 党: "とう", 閒: "かん", 间: "かん", 造: "ぞう", 次: "じ", 顚: "てん", 沛: "はい", 朝: "ちょう", 夕: "せき", 蓋: "がい", 盖: "がい", 參: "さん", 参: "さん", 貫: "かん", 贯: "かん", 怨: "えん", 希: "き", 賊: "ぞく", 贼: "ぞく", 反: "はん", 省: "せい", 予: "よ", 顏: "がん", 颜: "がん", 淵: "えん", 渊: "えん", 克: "こく", 復: "ふく", 目: "もく", 非: "ひ", 勿: "ぶつ", 視: "し", 聽: "ちょう", 听: "ちょう", 達: "たつ", 达: "たつ", 恕: "じょ", 己: "こ", 施: "し", 篤: "とく", 笃: "とく", 敬: "けい", 哀: "あい", 弟: "てい", 弟子: "ていし",
  朝: "ちょう", 野: "や", 庭: "てい", 寢: "しん", 寝: "しん", 衣: "い", 裘: "きゅう", 羔: "こう", 羊: "よう", 冠: "かん", 必: "ひつ", 席: "せき", 肉: "にく", 魚: "ぎょ", 鱼: "ぎょ", 酒: "しゅ", 市: "し", 沽: "こ", 坐: "ざ", 雷: "らい", 風: "ふう", 风: "ふう", 疾: "しつ", 問: "もん", 亡: "ぼう", 廄: "きゅう", 傷: "しょう", 卿: "けい", 賓: "ひん", 宾: "ひん", 客: "きゃく", 過: "か", 鄉: "きょう", 乡: "きょう", 黨: "とう", 儺: "だ", 階: "かい", 趨: "すう", 趋: "すう",
  先: "せん", 進: "しん", 进: "しん", 後: "ご", 后: "ご", 退: "たい", 及: "きゅう", 先: "せん", 聞: "ぶん", 闻: "ぶん", 思: "し", 信: "しん", 舉: "きょ", 直: "ちょく", 廢: "はい", 废: "はい", 舊: "きゅう", 旧: "きゅう", 藏: "ぞう", 藏: "ぞう", 啟: "けい", 启: "けい", 發: "はつ", 发: "はつ", 隅: "ぐう", 反: "はん", 則: "そく",
  衛: "えい", 衞: "えい", 靈: "れい", 灵: "れい", 陳: "ちん", 陈: "ちん", 蔡: "さい", 楚: "そ", 齊: "せい", 魯: "ろ", 吴: "ご", 吳: "ご", 秦: "しん", 晉: "しん", 晋: "しん", 周: "しゅう", 堯: "ぎょう", 尧: "ぎょう", 舜: "しゅん", 禹: "う", 湯: "とう", 汤: "とう", 桀: "けつ", 紂: "ちゅう", 文: "ぶん", 武: "ぶ", 召: "しょう", 伯: "はく", 叔: "しゅく", 齊: "せい", 景: "けい", 公: "こう", 管: "かん", 仲: "ちゅう", 回: "かい", 丘: "きゅう", 由: "ゆう", 賜: "し", 張: "ちょう", 张: "ちょう", 參: "さん", 参: "さん", 商: "しょう", 偃: "えん", 鯉: "り", 鲤: "り",
  性: "せい", 習: "しゅう", 近: "きん", 遠: "えん", 移: "い", 知: "ち", 愚: "ぐ", 弦: "げん", 歌: "か", 聲: "せい", 声: "せい", 鷄: "けい", 雞: "けい", 鸡: "けい", 牛: "ぎゅう", 刀: "とう", 昔: "せき", 道: "どう", 從: "じゅう", 召: "しょう", 往: "おう", 磨: "ま", 白: "はく", 食: "しょく", 六: "ろく", 蔽: "へい", 直: "ちょく", 剛: "ごう", 狂: "きょう", 興: "こう", 观: "かん", 群: "ぐん", 怨: "えん", 鳥: "ちょう", 兽: "じゅう", 獸: "じゅう", 草: "そう", 木: "もく", 名: "めい", 玉: "ぎょく", 帛: "はく", 鐘: "しょう", 钟: "しょう", 鼓: "こ", 鄉: "きょう", 原: "げん", 棄: "き", 弃: "き", 飽: "ほう", 博: "はく", 弈: "えき", 義: "ぎ", 盜: "とう", 盗: "とう", 四: "し", 十: "じゅう", 年: "ねん", 終: "しゅう",
  微: "び", 去: "きょ", 奴: "ど", 比: "ひ", 干: "かん", 諫: "かん", 谏: "かん", 死: "し", 仁: "じん", 柳: "りゅう", 士: "し", 師: "し", 师: "し", 黜: "ちゅつ", 待: "たい", 老: "ろう", 用: "よう", 狂: "きょう", 接: "せつ", 輿: "よ", 舆: "よ", 鳳: "ほう", 凤: "ほう", 衰: "すい", 追: "つい", 從: "じゅう", 辟: "へき", 長: "ちょう", 沮: "そ", 溺: "でき", 耕: "こう", 津: "しん", 徒: "と", 滔: "とう", 易: "えき", 世: "せい", 丈: "じょう", 杖: "じょう", 荷: "か", 黍: "しょ", 義: "ぎ", 身: "しん", 亂: "らん", 倫: "りん", 降: "こう", 淸: "せい", 清: "せい", 權: "けん", 权: "けん",
  危: "き", 命: "めい", 執: "しつ", 执: "しつ", 弘: "こう", 門: "もん", 容: "よう", 眾: "しゅう", 众: "しゅう", 矜: "きん", 觀: "かん", 道: "どう", 泥: "でい", 工: "こう", 肆: "し", 成: "せい", 變: "へん", 变: "へん", 儼: "げん", 严: "げん", 溫: "おん", 厲: "れい", 游: "ゆう", 過: "か", 誣: "ふ", 传: "でん", 優: "ゆう", 仕: "し", 致: "ち", 喪: "そう", 友: "ゆう", 難: "なん", 仁: "じん", 堂: "どう", 聞: "ぶん", 莊: "そう", 散: "さん", 情: "じょう", 哀: "あい", 喜: "き", 下: "か", 流: "りゅう", 月: "げつ", 宮: "きゅう", 墻: "しょう", 牆: "しょう", 肩: "けん", 室: "しつ", 家: "か", 宗: "そう", 廟: "びょう", 官: "かん", 譽: "よ", 毀: "き", 踰: "ゆ", 階: "かい", 榮: "えい", 荣: "えい",
  咨: "し", 爾: "じ", 尔: "じ", 曆: "れき", 历: "れき", 數: "すう", 数: "すう", 在: "ざい", 躬: "きゅう", 允: "いん", 中: "ちゅう", 海: "かい", 困: "こん", 窮: "きゅう", 穷: "きゅう", 皇: "こう", 帝: "てい", 臣: "しん", 罪: "ざい", 赦: "しゃ", 蔽: "へい", 簡: "かん", 朕: "ちん", 姓: "せい", 謹: "きん", 量: "りょう", 審: "しん", 法: "ほう", 度: "ど", 修: "しゅう", 滅: "めつ", 举: "きょ", 逸: "いつ", 歸: "き", 寬: "かん", 费: "ひ", 費: "ひ", 貪: "どん", 驕: "きょう", 猛: "もう", 虐: "ぎゃく", 暴: "ぼう", 慢: "まん", 令: "れい", 期: "き", 賊: "ぞく", 納: "のう", 吝: "りん",
  乘: "じょう", 於: "お", 是: "ぜ", 抑: "よく", 良: "りょう", 得: "とく", 患: "かん", 沒: "ぼつ", 没: "ぼつ", 斯: "し", 乘: "じょう", 邦: "ほう", 溫: "おん"
};

const sortedJapanesePhrases = Object.keys(japanesePhraseReadings).sort((a, b) => b.length - a.length);

function isCJKChar(ch) {
  return /[\u3400-\u9fff\uf900-\ufaff]/.test(ch);
}

function renderRubyText(text) {
  let html = "";
  let i = 0;
  while (i < text.length) {
    const phrase = sortedJapanesePhrases.find(item => text.startsWith(item, i));
    if (phrase) {
      html += `<ruby>${escapeHTML(phrase)}<rt>${escapeHTML(japanesePhraseReadings[phrase])}</rt></ruby>`;
      i += phrase.length;
      continue;
    }

    const ch = text[i];
    const reading = japaneseKanjiReadings[ch];
    if (reading) {
      html += `<ruby>${escapeHTML(ch)}<rt>${escapeHTML(reading)}</rt></ruby>`;
    } else {
      html += escapeHTML(ch);
    }
    i += 1;
  }
  return html;
}

function getTheme(text) {
  const expanded = `${text}${toSimplified(text)}`;
  return themeRules.find(rule => rule.keys.some(key => expanded.includes(key))) || {
    label: "修身",
    simple: "这句话适合慢慢读：先理解字面意思，再想想它能怎样帮助我们今天做得更好。",
    jp: "ゆっくり読み、今の生活でどう使えるか考える言葉です。"
  };
}

function lessonMeta(lesson) {
  const theme = getTheme(lesson.original);
  const expanded = `${lesson.original}${toSimplified(lesson.original)}`;
  const keywords = themeRules
    .filter(rule => rule.keys.some(key => expanded.includes(key)))
    .slice(0, 4)
    .map(rule => rule.label);
  if (!keywords.length) keywords.push(theme.label);

  return {
    theme,
    keywords: [...new Set(keywords)],
    difficulty: Math.min(3, Math.max(1, Math.ceil(lesson.original.length / 70)))
  };
}

function visibleLessons(chapter) {
  if (themeFilter === "all") return chapter.lessons;
  return chapter.lessons.filter(lesson => lessonMeta(lesson).keywords.includes(themeFilter));
}

function filteredLessonsWithChapter() {
  return allLessons().filter(({ original }) => {
    return themeFilter === "all" || lessonMeta({ original }).keywords.includes(themeFilter);
  });
}

function getDailyLesson() {
  const pool = filteredLessonsWithChapter();
  if (!pool.length) return null;
  const now = new Date();
  const dayKey = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return pool[dayKey % pool.length];
}

function getContinueLesson() {
  const pool = filteredLessonsWithChapter();
  return pool.find(lesson => !memorized[lesson.id]) || pool[0] || null;
}

function goToLesson(entry) {
  if (!entry) return;
  showChapter(entry.chapter.id, entry.id);
}

function openDailyLesson() {
  goToLesson(getDailyLesson());
}

function openRandomLesson() {
  const pool = filteredLessonsWithChapter();
  if (!pool.length) return;
  goToLesson(pool[Math.floor(Math.random() * pool.length)]);
}

function openContinueLesson() {
  goToLesson(getContinueLesson());
}

function renderStudyStarter() {
  const daily = getDailyLesson();
  const next = getContinueLesson();
  if (!daily) {
    return '<div class="study-starter empty-state">当前主题下没有可学习的章句，请换一个主题。</div>';
  }

  const dailyMeta = lessonMeta(daily);
  const nextText = next ? `${next.chapter.title} ${next.section}` : "暂无";

  return `
    <section class="study-starter" aria-label="今日学习入口">
      <div class="study-copy">
        <div class="study-kicker">今日一句 · ${escapeHTML(daily.chapter.title)} ${escapeHTML(daily.section)}</div>
        <div class="study-quote">${escapeHTML(displayText(daily.original))}</div>
        <div class="study-hint">${escapeHTML(dailyMeta.theme.simple)}</div>
      </div>
      <div class="study-actions">
        <button class="study-primary" onclick="openDailyLesson()">学习今日一句</button>
        <button class="study-secondary" onclick="openContinueLesson()">继续：${escapeHTML(nextText)}</button>
        <button class="study-secondary" onclick="openRandomLesson()">随机一句</button>
      </div>
    </section>`;
}

function renderThemeOptions() {
  const labels = themeRules.map(rule => rule.label);
  return ['<option value="all">全部主题</option>']
    .concat(labels.map(label => `<option value="${escapeAttr(label)}"${themeFilter === label ? " selected" : ""}>${escapeHTML(label)}</option>`))
    .join("");
}

function renderToolbar() {
  return `
    <div class="learning-toolbar">
      <div class="segmented-control" aria-label="文字显示">
        <button class="${textMode === "traditional" ? "active" : ""}" onclick="setTextMode('traditional')">繁体</button>
        <button class="${textMode === "simplified" ? "active" : ""}" onclick="setTextMode('simplified')">简体</button>
      </div>
      <label class="theme-select-label">
        <span>主题</span>
        <select class="theme-select" onchange="setThemeFilter(this.value)">${renderThemeOptions()}</select>
      </label>
    </div>`;
}

function setTextMode(mode) {
  textMode = mode;
  localStorage.setItem("lunyu_text_mode", textMode);
  if (currentChapterId) showChapter(currentChapterId);
  else showHome();
}

function setThemeFilter(value) {
  themeFilter = value;
  localStorage.setItem("lunyu_theme_filter", themeFilter);
  if (currentChapterId) showChapter(currentChapterId);
  else showHome();
}

function adjustColor(hex) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - 30);
  const g = Math.max(0, ((num >> 8) & 0xff) - 30);
  const b = Math.max(0, (num & 0xff) - 30);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ===== SIDEBAR =====
function buildSidebar() {
  const chapterNav = document.getElementById("chapterNav");
  chapterNav.innerHTML = "";

  lunyuData.chapters.forEach(ch => {
    const btn = document.createElement("button");
    btn.className = "chapter-btn";
    btn.id = `nav-${ch.id}`;
    btn.style.background = ch.color;
    btn.style.color = "white";
    btn.innerHTML = `
      <span class="chapter-icon">${ch.icon}</span>
      <span class="chapter-info">
        <span class="chapter-name">${escapeHTML(ch.title)}</span>
        <span class="chapter-reading">${escapeHTML(ch.titleReading)}</span>
      </span>
      <span class="lesson-count">${ch.lessons.length} 条</span>
    `;
    btn.addEventListener("click", () => showChapter(ch.id));
    chapterNav.appendChild(btn);
  });
}

// ===== HOME =====
function showHome() {
  currentChapterId = null;
  updateActiveNav(null);

  const content = document.getElementById("content");
  const totalLessons = allLessons().length;
  const memorizedCount = Object.keys(memorized).filter(id => allLessons().some(l => l.id === id)).length;
  const filteredTotal = themeFilter === "all"
    ? totalLessons
    : allLessons().filter(({ original }) => lessonMeta({ original }).keywords.includes(themeFilter)).length;

  const gridHTML = lunyuData.chapters.map(ch => {
    const chMemorized = ch.lessons.filter(l => memorized[l.id]).length;
    const allDone = chMemorized === ch.lessons.length && ch.lessons.length > 0;
    const visibleCount = visibleLessons(ch).length;
    return `
      <div class="chapter-card" style="background: linear-gradient(135deg, ${ch.color}, ${adjustColor(ch.color)})"
           onclick="showChapter(${ch.id})">
        ${allDone ? '<div class="memorized-badge" style="display:flex">★</div>' : ""}
        <div class="card-icon">${ch.icon}</div>
        <div class="card-title">${escapeHTML(ch.title)}</div>
        <div class="card-reading">${escapeHTML(ch.titleJP)} · ${escapeHTML(ch.titleReading)}</div>
        <div class="card-count">${themeFilter === "all" ? ch.lessons.length : visibleCount} 条 · 已记 ${chMemorized}</div>
      </div>`;
  }).join("");

  content.innerHTML = `
    <div class="home-section">
      <div class="home-title">儿童《论语》学习</div>
      <p class="home-desc">
        完整 20 篇原文，配合儿童导读、日语提示和中日文朗读。每天读一点，慢慢认识孔子的智慧。
      </p>
      ${renderToolbar()}
      <div class="stats-row">
        <div class="stat-chip">全 ${totalLessons} 条</div>
        <div class="stat-chip">当前 ${filteredTotal} 条</div>
        <div class="stat-chip">已记 ${memorizedCount} 条</div>
        <div class="stat-chip">完成 ${totalLessons > 0 ? Math.round(memorizedCount / totalLessons * 100) : 0}%</div>
      </div>
      ${renderStudyStarter()}
      <div class="search-panel">
        <input id="globalSearch" class="search-input" type="search" placeholder="搜索原文、篇名或主题，比如 学、仁、朋友" />
        <button class="search-btn" onclick="runSearch()">搜索</button>
      </div>
      <div id="searchResults"></div>
      <div class="chapter-grid">${gridHTML}</div>
      <p class="source-note">原文底本：<a href="${escapeAttr(lunyuData.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHTML(lunyuData.source)}</a></p>
    </div>`;

  document.getElementById("globalSearch").addEventListener("keydown", event => {
    if (event.key === "Enter") runSearch();
  });
}

function runSearch() {
  const input = document.getElementById("globalSearch");
  const box = document.getElementById("searchResults");
  const query = input.value.trim();
  if (!query) {
    box.innerHTML = "";
    return;
  }

  const results = allLessons().filter(({ original, chapter }) => {
    const meta = lessonMeta({ original });
    if (themeFilter !== "all" && !meta.keywords.includes(themeFilter)) return false;
    const haystack = [
      original,
      toSimplified(original),
      chapter.title,
      chapter.titleTraditional,
      toSimplified(chapter.titleTraditional),
      meta.keywords.join("")
    ].join("");
    return haystack.includes(query);
  }).slice(0, 30);

  box.innerHTML = `
    <div class="search-results">
      <div class="search-title">找到 ${results.length} 条${results.length === 30 ? "（先显示前 30 条）" : ""}</div>
      ${results.map(({ chapter, ...lesson }) => `
        <button class="search-item" onclick="showChapter(${chapter.id}, '${lesson.id}')">
          <strong>${escapeHTML(chapter.title)} ${escapeHTML(lesson.section)}</strong>
          <span>${escapeHTML(displayText(lesson.original).slice(0, 90))}${lesson.original.length > 90 ? "..." : ""}</span>
        </button>
      `).join("")}
    </div>`;
}

// ===== CHAPTER =====
function showChapter(chapterId, focusLessonId = null) {
  currentChapterId = chapterId;
  const ch = lunyuData.chapters.find(c => c.id === chapterId);
  if (!ch) return;
  updateActiveNav(chapterId);

  const content = document.getElementById("content");
  const lessons = visibleLessons(ch);
  const lessonsHTML = lessons.map((lesson, idx) => buildLessonCard(lesson, ch.color, idx)).join("");
  const memorizedCount = ch.lessons.filter(l => memorized[l.id]).length;
  const emptyHTML = lessons.length ? "" : '<div class="empty-state">这个主题在本篇暂时没有匹配的章句，可以换一个主题看看。</div>';

  content.innerHTML = `
    ${renderToolbar()}
    <div class="chapter-header" style="border-left: 6px solid ${ch.color}">
      <div class="big-icon">${ch.icon}</div>
      <div>
        <h2>${escapeHTML(ch.title)} <small>${escapeHTML(displayText(ch.titleTraditional))}</small></h2>
        <div class="reading">${escapeHTML(ch.titleJP)} · ${escapeHTML(ch.titleReading)} · 当前 ${lessons.length}/${ch.lessons.length} 条 · 已记 ${memorizedCount}</div>
      </div>
    </div>
    ${emptyHTML}
    ${lessonsHTML}
  `;

  if (focusLessonId) {
    const target = document.getElementById(`card-${focusLessonId}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.classList.add("focus-card");
      setTimeout(() => target.classList.remove("focus-card"), 1800);
    }
  } else {
    content.scrollTop = 0;
  }
}

function buildLessonCard(lesson, color, idx) {
  const isMemorized = !!memorized[lesson.id];
  const meta = lessonMeta(lesson);
  const stars = "★".repeat(meta.difficulty) + "☆".repeat(3 - meta.difficulty);
  const keywordsHTML = meta.keywords.map(k => `<span class="keyword-tag">${escapeHTML(k)}</span>`).join("");
  const originalForDisplay = displayText(lesson.original);
  const safeOriginal = escapeHTML(originalForDisplay);
  const rubyOriginal = renderRubyText(originalForDisplay);
  const simple = meta.theme.simple;
  const jpHint = meta.theme.jp;

  return `
    <div class="lesson-card" id="card-${lesson.id}" style="animation-delay:${Math.min(idx, 8) * 0.04}s">
      <div class="card-top">
        <div class="lesson-index">${escapeHTML(lesson.section)}</div>
        <div class="original-text" style="color: ${color}">${safeOriginal}</div>
        <div class="ruby-text" aria-label="日文平假名标注">${rubyOriginal}</div>
        <div class="jp-reading">日本語ヒント：${escapeHTML(jpHint)}</div>
      </div>
      <div class="card-bottom">
        <div class="zh-section">
          <div class="zh-label full">原文导读</div>
          <div class="zh-text">这一章句属于「${escapeHTML(meta.theme.label)}」主题。先读原文，再想一想：孔子和弟子是在提醒我们怎样做人、学习或与人相处？</div>
        </div>
        <div class="zh-section">
          <div class="zh-label simple">简单来说</div>
          <div class="zh-simple">${escapeHTML(simple)}</div>
        </div>
        <div class="keywords">${keywordsHTML}</div>
        <div class="difficulty">难度：<span class="star">${stars}</span></div>
      </div>
      <div class="card-controls">
        <button class="play-btn" id="play-${lesson.id}" onclick="playAudio('${lesson.id}', \`${escapeAttr(lesson.original)}\`, 'ja-JP')">
          <span class="btn-icon">▶</span> 日语朗读
        </button>
        <button class="play-btn zh-play" onclick="playAudio('${lesson.id}-zh', \`${escapeAttr(simple)}\`, 'zh-CN')">
          <span class="btn-icon">▶</span> 中文导读
        </button>
        <button class="memorize-btn ${isMemorized ? "memorized" : ""}" id="mem-${lesson.id}"
                onclick="toggleMemorize('${lesson.id}')">
          ${isMemorized ? "★ 已记住" : "☆ 标记记住"}
        </button>
      </div>
    </div>`;
}

// ===== AUDIO =====
function playAudio(lessonId, text, lang) {
  if (!window.speechSynthesis) {
    showToast("当前浏览器不支持语音朗读");
    return;
  }

  if (speaking && currentUtterance) {
    speechSynthesis.cancel();
    resetPlayButtons();
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = lang === "ja-JP" ? 0.75 : 0.9;
  utter.pitch = 1.05;

  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang && v.lang.startsWith(lang.slice(0, 2)));
  if (voice) utter.voice = voice;

  const btn = document.getElementById(`play-${lessonId}`);
  utter.onstart = () => {
    speaking = true;
    currentUtterance = utter;
    if (btn) {
      btn.classList.add("playing");
      btn.innerHTML = '<span class="btn-icon">■</span> 停止';
    }
  };
  utter.onend = utter.onerror = () => {
    speaking = false;
    currentUtterance = null;
    resetPlayButtons();
  };
  speechSynthesis.speak(utter);
}

function resetPlayButtons() {
  speaking = false;
  currentUtterance = null;
  document.querySelectorAll(".play-btn").forEach(btn => {
    btn.classList.remove("playing");
    if (btn.classList.contains("zh-play")) {
      btn.innerHTML = '<span class="btn-icon">▶</span> 中文导读';
    } else {
      btn.innerHTML = '<span class="btn-icon">▶</span> 日语朗读';
    }
  });
}

if (window.speechSynthesis) {
  speechSynthesis.addEventListener("voiceschanged", () => {});
}

// ===== MEMORIZE =====
function toggleMemorize(lessonId) {
  const btn = document.getElementById(`mem-${lessonId}`);
  if (memorized[lessonId]) {
    delete memorized[lessonId];
    if (btn) {
      btn.className = "memorize-btn";
      btn.textContent = "☆ 标记记住";
    }
    showToast("已取消标记");
  } else {
    memorized[lessonId] = true;
    if (btn) {
      btn.className = "memorize-btn memorized";
      btn.textContent = "★ 已记住";
      celebrateEffect(btn);
    }
    showToast("又记住一条，真不错！");
  }
  localStorage.setItem("lunyu_memorized", JSON.stringify(memorized));
  updateProgress();
}

function celebrateEffect(el) {
  const rect = el.getBoundingClientRect();
  const marks = ["★", "✓", "好", "学"];
  for (let i = 0; i < 8; i++) {
    const span = document.createElement("span");
    span.textContent = marks[Math.floor(Math.random() * marks.length)];
    span.style.cssText = `
      position:fixed; left:${rect.left + rect.width / 2}px; top:${rect.top}px;
      font-size:1.5rem; pointer-events:none; z-index:9999;
      animation: confetti 1s ease forwards;
      --dx: ${(Math.random() - 0.5) * 150}px;
      --dy: ${-Math.random() * 120 - 40}px;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1100);
  }
}

// ===== PROGRESS =====
function updateProgress() {
  const lessons = allLessons();
  const total = lessons.length;
  const done = Object.keys(memorized).filter(id => lessons.some(l => l.id === id)).length;
  const pct = total > 0 ? (done / total * 100) : 0;
  const bar = document.getElementById("progressFill");
  const count = document.getElementById("progressCount");
  if (bar) bar.style.width = `${pct}%`;
  if (count) count.textContent = `${done} / ${total} 条`;
}

// ===== NAV =====
function updateActiveNav(chapterId) {
  document.querySelectorAll(".chapter-btn").forEach(btn => btn.classList.remove("active"));
  if (chapterId) {
    const active = document.getElementById(`nav-${chapterId}`);
    if (active) active.classList.add("active");
  }
}

// ===== MASCOT =====
function setupMascot() {
  const mascot = document.getElementById("mascot");
  const bubble = document.getElementById("mascotBubble");
  if (!mascot || !bubble) return;

  let msgIdx = 0;
  const showMsg = () => {
    bubble.textContent = mascotMessages[msgIdx % mascotMessages.length];
    bubble.classList.add("show");
    msgIdx++;
    setTimeout(() => bubble.classList.remove("show"), 3000);
  };
  mascot.addEventListener("click", showMsg);
  setTimeout(showMsg, 3000);
  setInterval(showMsg, 12000);
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}
