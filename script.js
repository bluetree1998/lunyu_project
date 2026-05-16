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
  const simple = meta.theme.simple;
  const jpHint = meta.theme.jp;

  return `
    <div class="lesson-card" id="card-${lesson.id}" style="animation-delay:${Math.min(idx, 8) * 0.04}s">
      <div class="card-top">
        <div class="lesson-index">${escapeHTML(lesson.section)}</div>
        <div class="original-text" style="color: ${color}">${safeOriginal}</div>
        <div class="ruby-text">${safeOriginal}</div>
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
