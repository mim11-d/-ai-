/* ============================================================
   Moodboard — Design Inspiration Generator
   Vanilla JS. No dependencies.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mood definitions ----------
     Each mood has:
     - desc: short brief line
     - layers: inner DOM pieces for the CSS visual
     - palette: HSL ranges that give the mood its character
       h: [min,max] hue,  s: [min,max] saturation%,  l: [min,max] lightness%
       count: how many swatches, order: how to sort for nice contrast
  */
  /* `type` shapes the mood title + keyword typography to match the vibe:
     font (family), weight, tracking (letter-spacing), transform, style (normal/italic). */
  var MOODS = {
    dreamy: {
      desc: "흐릿하고 몽환적인 파스텔. 부드럽게 번지는 빛.",
      layers: ["b1", "b2", "b3"],
      palette: { h: [200, 320], s: [35, 60], l: [72, 88], count: 5, order: "light" },
      type: { font: "'Quicksand', sans-serif", weight: 600, tracking: "0.01em", transform: "capitalize", style: "normal" }
    },
    minimal: {
      desc: "여백 중심의 절제. 하나의 선, 하나의 점.",
      layers: ["frame", "line", "dot"],
      palette: { h: [0, 360], s: [3, 12], l: [40, 94], count: 4, order: "lightness" },
      type: { font: "'Inter', sans-serif", weight: 300, tracking: "0.22em", transform: "uppercase", style: "normal" }
    },
    retro: {
      desc: "따뜻한 노을빛 밴드. 살짝 바랜 질감.",
      layers: ["sun", "stripes"],
      palette: { h: [15, 50], s: [45, 78], l: [42, 70], count: 5, order: "hue" },
      type: { font: "'Righteous', sans-serif", weight: 400, tracking: "0.01em", transform: "none", style: "normal" }
    },
    bold: {
      desc: "강한 대비와 단단한 도형. 망설임 없는 컬러.",
      layers: ["sq", "ci", "tri"],
      palette: { h: [0, 360], s: [70, 95], l: [42, 60], count: 4, order: "shuffle" },
      type: { font: "'Anton', sans-serif", weight: 400, tracking: "0.02em", transform: "uppercase", style: "normal" }
    },
    organic: {
      desc: "흐르는 곡선과 흙빛. 자연에서 온 색.",
      layers: ["o1", "o2", "o3"],
      palette: { h: [60, 140], s: [25, 50], l: [40, 70], count: 5, order: "hue" },
      type: { font: "'Fraunces', serif", weight: 500, tracking: "0", transform: "none", style: "italic" }
    },
    futuristic: {
      desc: "어두운 배경 위 네온 그리드. 차갑고 선명한 빛.",
      layers: ["grid-l", "glow", "scan"],
      palette: { h: [180, 280], s: [60, 92], l: [20, 66], count: 4, order: "dark" },
      type: { font: "'Orbitron', sans-serif", weight: 700, tracking: "0.08em", transform: "uppercase", style: "normal" }
    },
    calm: {
      desc: "잔잔한 지평선 그라데이션. 낮은 채도의 평온.",
      layers: ["orb", "horizon"],
      palette: { h: [170, 230], s: [18, 42], l: [55, 86], count: 4, order: "light" },
      type: { font: "'Cormorant Garamond', serif", weight: 600, tracking: "0.03em", transform: "none", style: "normal" }
    }
  };

  /* Display fonts mixed across the three keywords for a "type specimen" feel.
     size = optical scale factor so different fonts read at a balanced weight. */
  var FONT_STYLES = [
    { font: "'Quicksand', sans-serif",        weight: 600, tracking: "0.01em",  transform: "capitalize", style: "normal", size: 1.0 },
    { font: "'Inter', sans-serif",            weight: 300, tracking: "0.18em",  transform: "uppercase",  style: "normal", size: 0.92 },
    { font: "'Righteous', sans-serif",        weight: 400, tracking: "0.01em",  transform: "none",       style: "normal", size: 1.0 },
    { font: "'Anton', sans-serif",            weight: 400, tracking: "0.03em",  transform: "uppercase",  style: "normal", size: 1.02 },
    { font: "'Fraunces', serif",              weight: 500, tracking: "0",        transform: "none",       style: "italic", size: 1.12 },
    { font: "'Orbitron', sans-serif",         weight: 700, tracking: "0.05em",  transform: "uppercase",  style: "normal", size: 0.9 },
    { font: "'Cormorant Garamond', serif",    weight: 600, tracking: "0.02em",  transform: "none",       style: "normal", size: 1.28 },
    { font: "'Space Grotesk', sans-serif",    weight: 600, tracking: "-0.01em", transform: "none",       style: "normal", size: 1.0 }
  ];

  var KEYWORDS = [
    "Flow", "Reflection", "Archive", "Contrast", "Layer", "Rhythm",
    "Memory", "Grid", "Bubble", "Noise", "Fragment", "Echo",
    "Texture", "Drift", "Pulse", "Margin", "Loop", "Trace",
    "Bloom", "Static", "Mirror", "Tension", "Silence", "Spectrum",
    "Threshold", "Overlay", "Pause", "Signal", "Weight", "Glitch"
  ];

  /* ---------- Helpers ---------- */
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
  function keys(obj) { return Object.keys(obj); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randInt(0, i);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // pick n unique items
  function sample(arr, n) { return shuffle(arr).slice(0, n); }

  /* ---------- HSL -> HEX ---------- */
  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    function to2(v) {
      var hex = Math.round((v + m) * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }
    return ("#" + to2(r) + to2(g) + to2(b)).toUpperCase();
  }

  function lightnessOf(hex) {
    var r = parseInt(hex.substr(1, 2), 16) / 255;
    var g = parseInt(hex.substr(3, 2), 16) / 255;
    var b = parseInt(hex.substr(5, 2), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  /* ---------- Palette generation (mood-aware, harmonic) ---------- */
  function makePalette(cfg) {
    var base = rand(cfg.h[0], cfg.h[1]);
    // harmonic schemes keep palettes pleasant, not arbitrary
    var schemes = [
      [0, 20, 40, -20, -40],        // analogous
      [0, 180, 30, 210, -30],       // complementary spread
      [0, 120, 240, 60, 300],       // triadic-ish
      [0, 30, -30, 60, -60]         // tight analogous
    ];
    var scheme = pick(schemes);
    // Always build 5 colors so the mood visual's CSS vars (--c1..--c5) are
    // fully defined; the swatch display later slices to cfg.count.
    var colors = [];
    for (var i = 0; i < 5; i++) {
      var hue = base + scheme[i % scheme.length];
      var sat = rand(cfg.s[0], cfg.s[1]);
      var lit = rand(cfg.l[0], cfg.l[1]);
      // gentle stagger in lightness for depth
      lit += (i - 2.5) * 4;
      lit = Math.max(8, Math.min(95, lit));
      colors.push(hslToHex(hue, sat, lit));
    }

    if (cfg.order === "lightness" || cfg.order === "light") {
      colors.sort(function (a, b) { return lightnessOf(b) - lightnessOf(a); });
    } else if (cfg.order === "dark") {
      colors.sort(function (a, b) { return lightnessOf(a) - lightnessOf(b); });
    }
    return colors;
  }

  /* ---------- State ---------- */
  var current = null;
  var baseCount = 0; // counts full new sets
  var varCount = 0;  // counts recolor variations within a set

  // Choose 3 distinct keyword fonts; guarantee the current mood's own font is
  // among them so the mix still nods to the mood, then shuffle their order.
  function pickWordFonts(moodType) {
    var pool = FONT_STYLES.filter(function (f) { return f.font !== moodType.font; });
    var others = sample(pool, 2);
    return shuffle([moodType].concat(others));
  }

  /* mode: "new" = fresh mood/color/keyword; "recolor" = keep mood + keywords,
     re-roll only the palette within the same mood family. */
  function generate(mode) {
    var moodName, mood, words, wordFonts, label;

    if (mode === "recolor" && current) {
      moodName = current.moodName;
      mood = current.mood;
      words = current.words;          // keep the keywords the user liked
      wordFonts = current.wordFonts;  // ...and their fonts
      varCount++;
      label = "Set " + String(baseCount).padStart(2, "0") + " · v" + varCount;
    } else {
      moodName = pick(keys(MOODS));
      mood = MOODS[moodName];
      words = sample(KEYWORDS, 3);
      wordFonts = pickWordFonts(mood.type);
      baseCount++;
      varCount = 0;
      label = "Set " + String(baseCount).padStart(2, "0");
    }

    var palette = makePalette(mood.palette);          // full 5 — drives the visual
    var shown = palette.slice(0, mood.palette.count);  // 3–5 — swatches/brief

    current = {
      moodName: moodName, mood: mood, palette: palette, shown: shown,
      words: words, wordFonts: wordFonts, label: label
    };
    render(current);
  }

  /* ---------- Render ---------- */
  var el = {
    result: document.getElementById("result"),
    index: document.getElementById("resultIndex"),
    moodVisual: document.getElementById("moodVisual"),
    moodName: document.getElementById("moodName"),
    moodDesc: document.getElementById("moodDesc"),
    swatches: document.getElementById("swatches"),
    keywords: document.getElementById("keywords")
  };

  function render(state) {
    el.result.hidden = false;
    el.index.textContent = state.label;

    // --- Mood-driven typography (mood title only) ---
    var t = state.mood.type;
    el.result.style.setProperty("--mood-font", t.font);
    el.result.style.setProperty("--mood-weight", t.weight);
    el.result.style.setProperty("--mood-tracking", t.tracking);
    el.result.style.setProperty("--mood-transform", t.transform);
    el.result.style.setProperty("--mood-style", t.style);

    // --- Mood visual ---
    var v = el.moodVisual;
    v.className = "mood mood--" + state.moodName;
    // palette -> CSS vars so the mood card uses the same colors
    state.palette.forEach(function (hex, i) {
      v.style.setProperty("--c" + (i + 1), hex);
    });
    // rebuild layers
    v.innerHTML = "";
    state.mood.layers.forEach(function (cls) {
      var d = document.createElement("div");
      d.className = "l " + cls;
      v.appendChild(d);
    });
    var grain = document.createElement("div");
    grain.className = "mood__grain";
    v.appendChild(grain);

    el.moodName.textContent = state.moodName;
    el.moodDesc.textContent = state.mood.desc;

    // --- Swatches ---
    el.swatches.innerHTML = "";
    state.shown.forEach(function (hex) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "swatch";
      b.style.background = hex;
      b.style.color = lightnessOf(hex) > 0.62 ? "#1a1a1d" : "#fff";
      var span = document.createElement("span");
      span.className = "swatch__hex";
      span.textContent = hex;
      b.appendChild(span);
      b.addEventListener("click", function () { copyText(hex, hex + " 복사됨"); });
      el.swatches.appendChild(b);
    });

    // --- Keywords (each in its own mixed font) ---
    el.keywords.innerHTML = "";
    state.words.forEach(function (w, i) {
      var li = document.createElement("li");
      var num = document.createElement("span");
      num.className = "num";
      num.textContent = "0" + (i + 1);
      var label = document.createElement("span");
      label.className = "kw";
      label.textContent = w;
      var fs = state.wordFonts[i] || state.mood.type;
      label.style.fontFamily = fs.font;
      label.style.fontWeight = fs.weight;
      label.style.fontStyle = fs.style;
      label.style.letterSpacing = fs.tracking;
      label.style.textTransform = fs.transform;
      label.style.fontSize = (1.2 * (fs.size || 1)) + "rem";
      li.appendChild(num);
      li.appendChild(label);
      el.keywords.appendChild(li);
    });
  }

  /* ---------- Copy ---------- */
  function briefText(state) {
    return [
      "MuseBoard — Inspiration Set " + String(state.index).padStart(2, "0"),
      "",
      "MOOD:    " + state.moodName + " (" + state.mood.desc + ")",
      "COLOR:   " + state.shown.join("  "),
      "KEYWORD: " + state.words.join(", ")
    ].join("\n");
  }

  function copyText(text, message) {
    function done() { showToast(message || "복사됨"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    if (cb) cb();
  }

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1600);
  }

  /* ---------- Events ---------- */
  document.getElementById("generate").addEventListener("click", function () { generate("new"); });
  document.getElementById("regenerate").addEventListener("click", function () { generate("new"); });
  document.getElementById("recolor").addEventListener("click", function () { generate("recolor"); });
  document.getElementById("copy").addEventListener("click", function () {
    if (current) copyText(briefText(current), "브리프가 복사되었습니다");
  });

  // keyboard: spacebar = new set (when not focused on a button)
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      generate("new");
    }
  });
})();
