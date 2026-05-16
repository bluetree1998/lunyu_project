// ===== STATE =====
let currentChapterId = null;
let memorized = JSON.parse(localStorage.getItem('lunyu_memorized') || '{}');
let speaking = false;
let currentUtterance = null;
const mascotMessages = [
  "一緒に論語を学ぼう！📖",
  "今日も頑張ろう！✨",
  "素晴らしい！続けて！🌟",
  "孔子先生のお言葉を覚えよう！",
  "毎日少しずつ学ぼう！🌈",
  "君子になろう！💪"
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  showHome();
  setupMascot();
  updateProgress();
});

// ===== SIDEBAR =====
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  const chapterNav = document.getElementById('chapterNav');
  chapterNav.innerHTML = '';
  lunyuData.chapters.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'chapter-btn';
    btn.id = `nav-${ch.id}`;
    btn.style.background = ch.color;
    btn.style.color = 'white';
    btn.innerHTML = `
      <span class="chapter-icon">${ch.icon}</span>
      <span class="chapter-info">
        <span class="chapter-name">${ch.title}</span>
        <span class="chapter-reading">${ch.titleReading}</span>
      </span>
      <span class="lesson-count">${ch.lessons.length}句</span>
    `;
    btn.addEventListener('click', () => showChapter(ch.id));
    chapterNav.appendChild(btn);
  });
}

// ===== HOME =====
function showHome() {
  currentChapterId = null;
  updateActiveNav(null);
  const content = document.getElementById('content');
  const totalLessons = lunyuData.chapters.reduce((a, ch) => a + ch.lessons.length, 0);
  const memorizedCount = Object.keys(memorized).length;

  let gridHTML = lunyuData.chapters.map(ch => {
    const chMemorized = ch.lessons.filter(l => memorized[l.id]).length;
    const allDone = chMemorized === ch.lessons.length && ch.lessons.length > 0;
    return `
    <div class="chapter-card" style="background: linear-gradient(135deg, ${ch.color}, ${adjustColor(ch.color)})"
         onclick="showChapter(${ch.id})">
      ${allDone ? '<div class="memorized-badge" style="display:flex">⭐</div>' : ''}
      <div class="card-icon">${ch.icon}</div>
      <div class="card-title">${ch.title}</div>
      <div class="card-reading">${ch.titleReading}</div>
      <div class="card-count">${ch.lessons.length} 句 · 已记 ${chMemorized}</div>
    </div>`;
  }).join('');

  content.innerHTML = `
    <div class="home-section">
      <div class="home-title">🎋 儿童论语学习 🎋</div>
      <p class="home-desc">
        和孔子爷爷一起，用日文读懂中国古代智慧！<br>
        <ruby>論語<rt>ろんご</rt></ruby>を<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>学<rt>まな</rt></ruby>ぼう！
      </p>
      <div class="stats-row">
        <div class="stat-chip">📖 共 ${totalLessons} 句</div>
        <div class="stat-chip">⭐ 已记 ${memorizedCount} 句</div>
        <div class="stat-chip">📊 完成 ${totalLessons > 0 ? Math.round(memorizedCount/totalLessons*100) : 0}%</div>
      </div>
      <div class="chapter-grid">${gridHTML}</div>
    </div>`;
}

function adjustColor(hex) {
  // Darken slightly for gradient end
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, (num >> 16) - 30);
  const g = Math.max(0, ((num >> 8) & 0xFF) - 30);
  const b = Math.max(0, (num & 0xFF) - 30);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ===== CHAPTER =====
function showChapter(chapterId) {
  currentChapterId = chapterId;
  const ch = lunyuData.chapters.find(c => c.id === chapterId);
  if (!ch) return;
  updateActiveNav(chapterId);

  const content = document.getElementById('content');
  const lessonsHTML = ch.lessons.map((lesson, idx) => buildLessonCard(lesson, ch.color, idx)).join('');

  content.innerHTML = `
    <div class="chapter-header" style="border-left: 6px solid ${ch.color}">
      <div class="big-icon">${ch.icon}</div>
      <div>
        <h2>${ch.title}</h2>
        <div class="reading">${ch.titleReading}</div>
      </div>
    </div>
    ${lessonsHTML}
  `;
  content.scrollTop = 0;
}

function buildLessonCard(lesson, color, idx) {
  const isMemorized = !!memorized[lesson.id];
  const stars = '★'.repeat(lesson.difficulty) + '☆'.repeat(3 - lesson.difficulty);
  const keywordsHTML = lesson.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('');

  return `
  <div class="lesson-card" id="card-${lesson.id}" style="animation-delay:${idx * 0.1}s">
    <div class="card-top">
      <div class="original-text" style="color: ${color}">${lesson.original}</div>
      <div class="ruby-text">${lesson.rubyText}</div>
      <div class="jp-reading">🔤 ${lesson.jpReading}</div>
    </div>
    <div class="card-bottom">
      <div class="zh-section">
        <div class="zh-label full">📜 原文解释</div>
        <div class="zh-text">${lesson.zhExplanation}</div>
      </div>
      <div class="zh-section">
        <div class="zh-label simple">💡 简单来说</div>
        <div class="zh-simple">${lesson.zhSimple}</div>
      </div>
      <div class="keywords">${keywordsHTML}</div>
      <div class="difficulty">
        难度：<span class="star">${stars}</span>
      </div>
    </div>
    <div class="card-controls">
      <button class="play-btn" id="play-${lesson.id}" onclick="playAudio('${lesson.id}', '${escapeStr(lesson.audioText)}')">
        <span class="btn-icon">🔊</span> 朗读日文
      </button>
      <button class="play-btn" style="background: linear-gradient(135deg,#4ECDC4,#44B3AB)"
              onclick="playZH('${escapeStr(lesson.zhSimple)}')">
        <span class="btn-icon">🗣️</span> 朗读中文
      </button>
      <button class="memorize-btn ${isMemorized ? 'memorized' : ''}" id="mem-${lesson.id}"
              onclick="toggleMemorize('${lesson.id}')">
        ${isMemorized ? '⭐ 已记住！' : '☆ 标记记住'}
      </button>
    </div>
  </div>`;
}

function escapeStr(s) {
  return s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ===== AUDIO =====
function playAudio(lessonId, text) {
  if (!window.speechSynthesis) {
    showToast('您的浏览器不支持语音播放 😢');
    return;
  }
  const btn = document.getElementById(`play-${lessonId}`);
  if (speaking && currentUtterance) {
    speechSynthesis.cancel();
    speaking = false;
    document.querySelectorAll('.play-btn').forEach(b => {
      b.classList.remove('playing');
      if (b.innerHTML.includes('朗读日文')) b.innerHTML = '<span class="btn-icon">🔊</span> 朗读日文';
    });
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  utter.rate = 0.85;
  utter.pitch = 1.1;

  // Pick Japanese voice if available
  const voices = speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jpVoice) utter.voice = jpVoice;

  utter.onstart = () => {
    speaking = true;
    currentUtterance = utter;
    btn.classList.add('playing');
    btn.innerHTML = '<span class="btn-icon">⏹️</span> 停止';
  };
  utter.onend = utter.onerror = () => {
    speaking = false;
    currentUtterance = null;
    btn.classList.remove('playing');
    btn.innerHTML = '<span class="btn-icon">🔊</span> 朗读日文';
  };
  speechSynthesis.speak(utter);
}

function playZH(text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = 0.9;
  utter.pitch = 1.1;
  const voices = speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.startsWith('zh'));
  if (zhVoice) utter.voice = zhVoice;
  speechSynthesis.speak(utter);
}

// Wait for voices to load
window.speechSynthesis && speechSynthesis.addEventListener('voiceschanged', () => {});

// ===== MEMORIZE =====
function toggleMemorize(lessonId) {
  const btn = document.getElementById(`mem-${lessonId}`);
  if (memorized[lessonId]) {
    delete memorized[lessonId];
    btn.className = 'memorize-btn';
    btn.textContent = '☆ 标记记住';
    showToast('已取消记住标记');
  } else {
    memorized[lessonId] = true;
    btn.className = 'memorize-btn memorized';
    btn.textContent = '⭐ 已记住！';
    showToast('太棒了！又记住一句！🎉');
    celebrateEffect(btn);
  }
  localStorage.setItem('lunyu_memorized', JSON.stringify(memorized));
  updateProgress();
}

function celebrateEffect(el) {
  const rect = el.getBoundingClientRect();
  const emojis = ['⭐', '🌟', '✨', '🎉', '🎊'];
  for (let i = 0; i < 8; i++) {
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.cssText = `
      position:fixed; left:${rect.left + rect.width/2}px; top:${rect.top}px;
      font-size:1.5rem; pointer-events:none; z-index:9999;
      animation: confetti 1s ease forwards;
      --dx: ${(Math.random()-0.5)*150}px;
      --dy: ${-Math.random()*120-40}px;
    `;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1100);
  }
}

// ===== PROGRESS =====
function updateProgress() {
  const total = lunyuData.chapters.reduce((a, ch) => a + ch.lessons.length, 0);
  const done = Object.keys(memorized).length;
  const pct = total > 0 ? (done / total * 100) : 0;
  const bar = document.getElementById('progressFill');
  const count = document.getElementById('progressCount');
  if (bar) bar.style.width = pct + '%';
  if (count) count.textContent = `${done} / ${total} 句`;
}

// ===== NAV =====
function updateActiveNav(chapterId) {
  document.querySelectorAll('.chapter-btn').forEach(btn => btn.classList.remove('active'));
  if (chapterId) {
    const active = document.getElementById(`nav-${chapterId}`);
    if (active) active.classList.add('active');
  }
}

// ===== MASCOT =====
function setupMascot() {
  const mascot = document.getElementById('mascot');
  const bubble = document.getElementById('mascotBubble');
  let msgIdx = 0;
  const showMsg = () => {
    bubble.textContent = mascotMessages[msgIdx % mascotMessages.length];
    bubble.classList.add('show');
    msgIdx++;
    setTimeout(() => bubble.classList.remove('show'), 3000);
  };
  mascot.addEventListener('click', showMsg);
  // Auto show periodically
  setTimeout(showMsg, 3000);
  setInterval(showMsg, 12000);
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== HOME BUTTON =====
document.addEventListener('DOMContentLoaded', () => {
  const homeBtn = document.getElementById('homeBtn');
  if (homeBtn) homeBtn.addEventListener('click', showHome);
});
