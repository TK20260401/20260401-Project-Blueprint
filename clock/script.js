(function () {
  const canvas = document.getElementById('clock-canvas');
  const ctx = canvas.getContext('2d');
  const digitalEl = document.getElementById('digital-time');
  const dateEl = document.getElementById('date-display');
  const weatherEl = document.getElementById('weather');
  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H / 2;
  const R = W / 2 - 20;

  const DAYS = ['日', '月', '火', '水', '木', '金', '土'];

  function drawClock() {
    const now = new Date();
    ctx.clearRect(0, 0, W, H);

    // 目盛り
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isMajor = i % 5 === 0;
      const outerR = R;
      const innerR = isMajor ? R - 22 : R - 12;
      ctx.beginPath();
      ctx.moveTo(CX + outerR * Math.cos(angle), CY + outerR * Math.sin(angle));
      ctx.lineTo(CX + innerR * Math.cos(angle), CY + innerR * Math.sin(angle));
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isMajor ? 4 : 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // 数字（12, 3, 6, 9）
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 36px "Helvetica Neue", Arial, sans-serif';
    const numR = R - 42;
    [12, 3, 6, 9].forEach((n) => {
      const angle = (n * 30 - 90) * (Math.PI / 180);
      ctx.fillText(String(n), CX + numR * Math.cos(angle), CY + numR * Math.sin(angle));
    });

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    // 時針
    const hourAngle = ((h % 12) * 30 + m * 0.5 - 90) * (Math.PI / 180);
    drawHand(hourAngle, R * 0.48, 7, '#ffffff');

    // 分針
    const minAngle = (m * 6 + s * 0.1 - 90) * (Math.PI / 180);
    drawHand(minAngle, R * 0.7, 4.5, '#ffffff');

    // 秒針
    const secAngle = (s * 6 - 90) * (Math.PI / 180);
    drawHand(secAngle, R * 0.8, 1.8, '#cc3333');
    // 秒針の尻尾
    const tailAngle = secAngle + Math.PI;
    drawHand(tailAngle, R * 0.15, 1.8, '#cc3333');

    // 中心の丸
    ctx.beginPath();
    ctx.arc(CX, CY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#cc3333';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CX, CY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // デジタル
    const pad = (n) => String(n).padStart(2, '0');
    digitalEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;

    // 日付
    const y = now.getFullYear();
    const mo = now.getMonth() + 1;
    const d = now.getDate();
    const day = DAYS[now.getDay()];
    dateEl.textContent = `${y}/${pad(mo)}/${pad(d)}(${day})`;
  }

  function drawHand(angle, length, width, color) {
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX + length * Math.cos(angle), CY + length * Math.sin(angle));
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // --- 天気 ---
  const CITIES = [
    { name: '札幌', lat: 43.0621, lon: 141.3544 },
    { name: '仙台', lat: 38.2682, lon: 140.8694 },
    { name: '東京', lat: 35.6895, lon: 139.6917 },
    { name: '名古屋', lat: 35.1815, lon: 136.9066 },
    { name: '大阪', lat: 34.6937, lon: 135.5023 },
    { name: '広島', lat: 34.3853, lon: 132.4553 },
    { name: '福岡', lat: 33.5904, lon: 130.4017 },
    { name: '那覇', lat: 26.2124, lon: 127.6809 },
  ];
  let currentCityIdx = 2; // 東京

  async function fetchWeather() {
    const city = CITIES[currentCityIdx];
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&timezone=Asia%2FTokyo`
      );
      const data = await res.json();
      const temp = Math.round(data.current.temperature_2m);
      const code = data.current.weather_code;
      const desc = weatherDescription(code);
      weatherEl.textContent = `${city.name}  ${desc}  ${temp}℃`;
    } catch (e) {
      console.error('Weather fetch error:', e);
      weatherEl.textContent = '天気を取得できませんでした';
    }
  }

  function weatherDescription(code) {
    if (code === 0) return '☀ 快晴';
    if (code <= 3) return '🌤 晴れ';
    if (code <= 49) return '☁ くもり';
    if (code <= 59) return '🌧 霧雨';
    if (code <= 69) return '🌧 雨';
    if (code <= 79) return '🌨 雪';
    if (code <= 82) return '🌧 にわか雨';
    if (code <= 86) return '🌨 にわか雪';
    if (code >= 95) return '⛈ 雷雨';
    return '🌥 くもり';
  }

  function weatherIcon(code) {
    if (code === 0) return '☀';
    if (code <= 3) return '🌤';
    if (code <= 49) return '☁';
    if (code <= 59) return '🌧';
    if (code <= 69) return '🌧';
    if (code <= 79) return '🌨';
    if (code <= 82) return '🌧';
    if (code <= 86) return '🌨';
    if (code >= 95) return '⛈';
    return '🌥';
  }

  function weatherShort(code) {
    if (code === 0) return '快晴';
    if (code <= 3) return '晴れ';
    if (code <= 49) return 'くもり';
    if (code <= 59) return '霧雨';
    if (code <= 69) return '雨';
    if (code <= 79) return '雪';
    if (code <= 82) return 'にわか雨';
    if (code <= 86) return 'にわか雪';
    if (code >= 95) return '雷雨';
    return 'くもり';
  }

  // --- 天気詳細パネル ---
  const weatherPanel = document.getElementById('weather-panel');
  const weatherContent = document.getElementById('weather-content');
  const weatherCloseBtn = document.getElementById('weather-close');
  const citySelect = document.getElementById('city-select');
  let forecastData = null;
  let currentWeatherTab = 'hourly';

  // 初期非表示
  weatherPanel.style.display = 'none';

  // 都市セレクト初期化
  CITIES.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = c.name;
    if (i === currentCityIdx) opt.selected = true;
    citySelect.appendChild(opt);
  });

  citySelect.addEventListener('change', () => {
    currentCityIdx = parseInt(citySelect.value, 10);
    forecastData = null;
    fetchWeather();
    loadForecast();
  });

  weatherEl.addEventListener('click', () => {
    const hidden = weatherPanel.style.display === 'none';
    weatherPanel.style.display = hidden ? '' : 'none';
    if (hidden) loadForecast();
  });

  weatherCloseBtn.addEventListener('click', () => {
    weatherPanel.style.display = 'none';
  });

  document.querySelectorAll('.weather-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.weather-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentWeatherTab = tab.dataset.tab;
      renderForecast();
    });
  });

  async function loadForecast() {
    weatherContent.textContent = '読み込み中...';
    const city = CITIES[currentCityIdx];
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=Asia%2FTokyo&forecast_days=16`
      );
      forecastData = await res.json();
      renderForecast();
    } catch (e) {
      console.error('Forecast fetch error:', e);
      weatherContent.textContent = '予報を取得できませんでした';
    }
  }

  function renderForecast() {
    if (!forecastData) { weatherContent.textContent = 'データなし'; return; }

    if (currentWeatherTab === 'hourly') {
      renderHourly();
    } else {
      renderDaily();
    }
  }

  function renderHourly() {
    const hourly = forecastData.hourly;
    if (!hourly) { weatherContent.textContent = 'データなし'; return; }
    const now = new Date();
    const currentHour = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + 'T' +
      String(now.getHours()).padStart(2, '0') + ':00';
    let startIdx = hourly.time.indexOf(currentHour);
    if (startIdx < 0) startIdx = 0;
    const endIdx = Math.min(startIdx + 24, hourly.time.length);

    let html = '';
    for (let i = startIdx; i < endIdx; i++) {
      const t = new Date(hourly.time[i]);
      const timeStr = `${String(t.getHours()).padStart(2, '0')}:00`;
      const dateStr = `${t.getMonth() + 1}/${t.getDate()}`;
      const code = hourly.weather_code[i];
      const icon = weatherIcon(code);
      const desc = weatherShort(code);
      const temp = Math.round(hourly.temperature_2m[i]);
      html += `<div class="weather-day-row">
        <span class="weather-day-date">${dateStr} ${timeStr}</span>
        <span class="weather-day-icon">${icon}</span>
        <span class="weather-day-desc">${desc}</span>
        <span class="weather-day-temp">${temp}℃</span>
      </div>`;
    }
    weatherContent.innerHTML = html;
  }

  function renderDaily() {
    const daily = forecastData.daily;
    if (!daily) { weatherContent.textContent = 'データなし'; return; }
    const today = new Date().toISOString().slice(0, 10);
    const todayIdx = daily.time.indexOf(today);
    let startIdx, endIdx;

    if (currentWeatherTab === 'tomorrow') {
      startIdx = todayIdx >= 0 ? todayIdx + 1 : 1;
      endIdx = startIdx + 1;
    } else if (currentWeatherTab === 'week') {
      startIdx = todayIdx >= 0 ? todayIdx + 1 : 1;
      endIdx = startIdx + 7;
    } else {
      startIdx = todayIdx >= 0 ? todayIdx + 1 : 1;
      endIdx = daily.time.length;
    }

    endIdx = Math.min(endIdx, daily.time.length);
    if (startIdx >= daily.time.length) {
      weatherContent.textContent = '予報データがありません';
      return;
    }

    let html = '';
    for (let i = startIdx; i < endIdx; i++) {
      const date = new Date(daily.time[i]);
      const dayName = DAYS[date.getDay()];
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}(${dayName})`;
      const code = daily.weather_code[i];
      const icon = weatherIcon(code);
      const desc = weatherShort(code);
      const tMax = Math.round(daily.temperature_2m_max[i]);
      const tMin = Math.round(daily.temperature_2m_min[i]);
      html += `<div class="weather-day-row">
        <span class="weather-day-date">${dateStr}</span>
        <span class="weather-day-icon">${icon}</span>
        <span class="weather-day-desc">${desc}</span>
        <span class="weather-day-temp">${tMax}℃ / ${tMin}℃</span>
      </div>`;
    }
    weatherContent.innerHTML = html;
  }

  // --- タイマー ---
  const timerDisplayEl = document.getElementById('timer-display');
  const timerBar = document.getElementById('timer-bar');
  const presetsEl = document.getElementById('timer-presets');
  const startBtn = document.getElementById('timer-start');
  const stopBtn = document.getElementById('timer-stop');
  const resetBtn = document.getElementById('timer-reset');
  const presetBtns = document.querySelectorAll('.timer-preset-btn');
  const modeDownBtn = document.getElementById('mode-down');
  const modeUpBtn = document.getElementById('mode-up');

  let mode = 'down'; // 'down' or 'up'
  let timerTotal = 0;
  let timerElapsed = 0;
  let timerInterval = null;
  let timerAudio = null;
  const slider = document.getElementById('timer-slider');
  let sliderDragging = false;

  // 画面フラッシュ用オーバーレイ
  const flashOverlay = document.createElement('div');
  flashOverlay.id = 'screen-flash';
  document.body.appendChild(flashOverlay);

  function startFlash() { flashOverlay.classList.add('screen-flash'); }
  function stopFlash() { flashOverlay.classList.remove('screen-flash'); }

  function formatTimer(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const millis = Math.floor((ms % 1000) / 10);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(millis)}`;
  }

  function updateTimerUI() {
    if (mode === 'down') {
      const remain = Math.max(0, timerTotal - timerElapsed);
      timerDisplayEl.textContent = formatTimer(remain);
      const pct = timerTotal > 0 ? (remain / timerTotal) * 100 : 0;
      timerBar.style.width = pct + '%';
      timerBar.className = 'timer-bar countdown';
      if (timerTotal > 0 && pct <= 10) timerBar.classList.add('danger');
      else if (timerTotal > 0 && pct <= 30) timerBar.classList.add('warning');
    } else {
      timerDisplayEl.textContent = formatTimer(timerElapsed);
      const maxMs = timerTotal > 0 ? timerTotal : 3600000;
      const pct = Math.min((timerElapsed / maxMs) * 100, 100);
      timerBar.style.width = pct + '%';
      timerBar.className = 'timer-bar countup';
    }
    if (!sliderDragging) syncSlider();
  }

  // モード切替
  modeDownBtn.addEventListener('click', () => {
    if (timerInterval) return;
    mode = 'down';
    modeDownBtn.classList.add('active');
    modeUpBtn.classList.remove('active');
    presetsEl.style.display = '';
    timerElapsed = 0;
    updateTimerUI();
    timerDisplayEl.classList.remove('running', 'finished');
    stopAlarm();
  });

  modeUpBtn.addEventListener('click', () => {
    if (timerInterval) return;
    mode = 'up';
    modeUpBtn.classList.add('active');
    modeDownBtn.classList.remove('active');
    presetsEl.style.display = '';
    timerTotal = 0;
    timerElapsed = 0;
    presetBtns.forEach((b) => b.classList.remove('active'));
    updateTimerUI();
    timerDisplayEl.classList.remove('running', 'finished');
    stopAlarm();
  });

  // プリセット
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (timerInterval) return;
      const mins = parseInt(btn.dataset.minutes, 10);
      timerTotal = mins * 60 * 1000;
      timerElapsed = 0;
      updateTimerUI();
      timerDisplayEl.classList.remove('running', 'finished');
      presetBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      stopAlarm();
    });
  });

  // スタート
  startBtn.addEventListener('click', () => {
    if (timerInterval) return;
    if (mode === 'down' && timerTotal <= 0) return;
    stopAlarm();
    timerDisplayEl.classList.add('running');
    timerDisplayEl.classList.remove('finished');
    startBtn.disabled = true;
    stopBtn.disabled = false;

    let lastTick = Date.now();
    timerInterval = setInterval(() => {
      const now = Date.now();
      timerElapsed += now - lastTick;
      lastTick = now;
      updateTimerUI();

      if (mode === 'down' && timerElapsed >= timerTotal) {
        timerElapsed = timerTotal;
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplayEl.classList.remove('running');
        timerDisplayEl.classList.add('finished');
        startBtn.disabled = false;
        stopBtn.disabled = true;
        playAlarm();
      }

      if (mode === 'up' && timerTotal > 0 && timerElapsed >= timerTotal) {
        timerElapsed = timerTotal;
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplayEl.classList.remove('running');
        timerDisplayEl.classList.add('finished');
        startBtn.disabled = false;
        stopBtn.disabled = true;
        playAlarm();
      }
    }, 10);
  });

  // ストップ
  stopBtn.addEventListener('click', () => {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
    timerDisplayEl.classList.remove('running');
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // リセット
  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerElapsed = 0;
    updateTimerUI();
    timerDisplayEl.classList.remove('running', 'finished');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    stopAlarm();
  });

  function playAlarm() {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (time) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(time);
        osc.stop(time + 0.3);
      };
      for (let i = 0; i < 6; i++) {
        playBeep(ac.currentTime + i * 0.5);
      }
      timerAudio = ac;
    } catch {
      // Web Audio API not available
    }
    startFlash();
  }

  function stopAlarm() {
    if (timerAudio) {
      timerAudio.close();
      timerAudio = null;
    }
    stopFlash();
  }

  // --- スライダー ---
  slider.addEventListener('mousedown', () => { sliderDragging = true; });
  slider.addEventListener('touchstart', () => { sliderDragging = true; }, { passive: true });
  window.addEventListener('mouseup', () => { sliderDragging = false; });
  window.addEventListener('touchend', () => { sliderDragging = false; });

  slider.addEventListener('input', () => {
    if (timerInterval) return;
    if (timerTotal <= 0) return;
    sliderDragging = true;
    const ratio = parseInt(slider.value, 10) / 1000;
    if (mode === 'down') {
      timerElapsed = Math.round(timerTotal * (1 - ratio));
    } else {
      timerElapsed = Math.round(timerTotal * ratio);
    }
    updateTimerUI();
    timerDisplayEl.classList.remove('finished');
    stopAlarm();
  });

  // スライダー位置をタイマー状態に同期
  function syncSlider() {
    if (timerTotal <= 0) { slider.value = 0; return; }
    if (mode === 'down') {
      const remain = Math.max(0, timerTotal - timerElapsed);
      slider.value = Math.round((remain / timerTotal) * 1000);
    } else {
      slider.value = Math.round((timerElapsed / timerTotal) * 1000);
    }
  }

  // 起動
  drawClock();
  setInterval(drawClock, 1000);
  fetchWeather();
  setInterval(fetchWeather, 600000); // 10分毎に更新
})();
