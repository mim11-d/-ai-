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
      palette: { h: [200, 320], s: [35, 60], l: [72, 88], count: 4, order: "light" },
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
      palette: { h: [15, 50], s: [45, 78], l: [42, 70], count: 4, order: "hue" },
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
      palette: { h: [60, 140], s: [25, 50], l: [40, 70], count: 4, order: "hue" },
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

  // w: 키워드,  ko: "짧은 뜻 · 디자인 관점의 해석"
  // tone: 사진 기반 생성 시 색감(warm/cool/bright/dark/soft/bold)과 매칭하는 태그. 선택 사항.
  var KEYWORDS = [
    { w: "Flow",       ko: "흐름 · 자연스럽게 이어지는 움직임", tone: ["soft"] },
    { w: "Reflection", ko: "반영 · 비추고 되돌아보는", tone: ["cool"] },
    { w: "Archive",    ko: "기록 · 모아 쌓인 자료" },
    { w: "Contrast",   ko: "대비 · 강하게 부딪히는 차이", tone: ["bold"] },
    { w: "Layer",      ko: "겹 · 층층이 쌓인 깊이" },
    { w: "Rhythm",     ko: "리듬 · 반복되는 규칙적 흐름", tone: ["bold"] },
    { w: "Memory",     ko: "기억 · 남아 맴도는 잔상", tone: ["soft"] },
    { w: "Grid",       ko: "격자 · 질서를 잡는 틀" },
    { w: "Bubble",     ko: "거품 · 가볍게 떠오르는 형태", tone: ["bright", "soft"] },
    { w: "Noise",      ko: "노이즈 · 거칠고 불규칙한 질감", tone: ["bold"] },
    { w: "Fragment",   ko: "조각 · 흩어진 파편" },
    { w: "Echo",       ko: "울림 · 되돌아오는 여운", tone: ["cool", "soft"] },
    { w: "Texture",    ko: "질감 · 만져지는 표면감" },
    { w: "Drift",      ko: "표류 · 정처 없이 흐르는", tone: ["cool", "soft"] },
    { w: "Pulse",      ko: "맥박 · 뛰는 듯한 박동", tone: ["bold"] },
    { w: "Margin",     ko: "여백 · 비워둔 공간" },
    { w: "Loop",       ko: "순환 · 되풀이되는 고리" },
    { w: "Trace",      ko: "흔적 · 지나간 자국", tone: ["soft"] },
    { w: "Bloom",      ko: "개화 · 번지듯 피어나는", tone: ["warm", "bright"] },
    { w: "Static",     ko: "정적 · 멈춰 있는 고요", tone: ["dark"] },
    { w: "Mirror",     ko: "거울 · 마주보는 반사", tone: ["cool", "bright"] },
    { w: "Tension",    ko: "긴장 · 팽팽하게 당겨진", tone: ["bold"] },
    { w: "Silence",    ko: "침묵 · 소리 없는 고요", tone: ["dark", "soft"] },
    { w: "Spectrum",   ko: "스펙트럼 · 펼쳐지는 색의 띠", tone: ["bright", "bold"] },
    { w: "Threshold",  ko: "문턱 · 안과 밖의 경계", tone: ["dark"] },
    { w: "Overlay",    ko: "중첩 · 겹쳐 덮이는 층" },
    { w: "Pause",      ko: "멈춤 · 잠시 숨을 고르는", tone: ["soft"] },
    { w: "Signal",     ko: "신호 · 전해지는 메시지", tone: ["bold"] },
    { w: "Weight",     ko: "무게 · 묵직하게 눌린 힘", tone: ["dark"] },
    { w: "Glitch",     ko: "글리치 · 어긋나 튀는 오류", tone: ["bold", "dark"] },
    // 구체적인 명사 — 자연·사물 이미지
    { w: "Sea",        ko: "바다 · 넓게 펼쳐진 물", tone: ["cool"] },
    { w: "Sky",        ko: "하늘 · 트여 있는 공간", tone: ["cool", "bright"] },
    { w: "Forest",     ko: "숲 · 우거진 나무들", tone: ["cool", "dark"] },
    { w: "Tree",       ko: "나무 · 뿌리내린 생명" },
    { w: "Mountain",   ko: "산 · 우뚝 솟은 능선", tone: ["cool", "dark"] },
    { w: "River",      ko: "강 · 굽이쳐 흐르는 물길", tone: ["cool", "soft"] },
    { w: "Cloud",      ko: "구름 · 떠다니는 덩어리", tone: ["bright", "soft"] },
    { w: "Stone",      ko: "돌 · 단단한 질감", tone: ["dark"] },
    { w: "Wave",       ko: "파도 · 밀려오는 물결", tone: ["cool", "bold"] },
    { w: "Leaf",       ko: "잎 · 가볍게 흔들리는", tone: ["cool"] },
    { w: "Moon",       ko: "달 · 은은하게 빛나는", tone: ["cool", "dark"] },
    { w: "Horizon",    ko: "수평선 · 하늘과 땅의 경계", tone: ["soft"] },
    { w: "Sand",       ko: "모래 · 곱게 흩어지는 알갱이", tone: ["warm", "bright"] },
    { w: "Petal",      ko: "꽃잎 · 여리게 피어난 조각", tone: ["warm", "bright", "soft"] },
    { w: "Tide",       ko: "조수 · 차오르고 빠지는", tone: ["cool"] },
    { w: "Ember",      ko: "잔불 · 은은히 타는 온기", tone: ["warm", "dark"] },
    { w: "Moss",       ko: "이끼 · 낮게 번지는 초록", tone: ["cool", "dark"] },
    { w: "Frost",      ko: "서리 · 차갑게 맺힌 결", tone: ["cool", "bright"] },
    { w: "Mist",       ko: "안개 · 뿌옇게 감싸는", tone: ["cool", "soft"] },
    { w: "Shadow",     ko: "그림자 · 드리워진 어둠", tone: ["dark"] },
    // 원소·날씨
    { w: "Sun",        ko: "태양 · 뜨겁게 내리쬐는 빛", tone: ["warm", "bright"] },
    { w: "Rain",       ko: "비 · 두드리며 내리는 물방울", tone: ["cool", "dark"] },
    { w: "Snow",       ko: "눈 · 소리 없이 쌓이는 흰빛", tone: ["cool", "bright", "soft"] },
    { w: "Wind",       ko: "바람 · 스치고 지나가는 흐름", tone: ["cool", "soft"] },
    { w: "Fire",       ko: "불 · 일렁이며 타오르는", tone: ["warm", "bold"] },
    { w: "Ice",        ko: "얼음 · 투명하게 굳은 결정", tone: ["cool", "bright"] },
    { w: "Root",       ko: "뿌리 · 깊이 박힌 근원", tone: ["dark"] },
    { w: "Flower",     ko: "꽃 · 화려하게 피어난 순간", tone: ["warm", "bright"] },
    { w: "Feather",    ko: "깃털 · 가볍게 흩날리는", tone: ["bright", "soft"] },
    { w: "Shell",      ko: "조개껍질 · 파도가 남긴 형태", tone: ["warm", "soft"] },
    { w: "Pearl",      ko: "진주 · 은은하게 감싸인 광택", tone: ["bright", "soft"] },
    { w: "Crystal",    ko: "수정 · 맑게 각진 결정체", tone: ["cool", "bright"] },
    // 재질·질감
    { w: "Metal",      ko: "금속 · 차갑고 단단한 표면", tone: ["dark", "bold"] },
    { w: "Glass",      ko: "유리 · 투명하게 비치는 경계", tone: ["cool", "bright"] },
    { w: "Paper",      ko: "종이 · 얇고 가벼운 질감", tone: ["bright", "soft"] },
    { w: "Thread",     ko: "실 · 가늘게 이어진 연결", tone: ["soft"] },
    { w: "Velvet",     ko: "벨벳 · 부드럽게 감기는 촉감", tone: ["dark", "soft"] },
    { w: "Rust",       ko: "녹 · 시간이 남긴 붉은 자국", tone: ["warm", "dark"] },
    { w: "Ash",        ko: "재 · 타고 남은 희미한 흔적", tone: ["dark", "soft"] },
    { w: "Smoke",      ko: "연기 · 흩어지며 퍼지는", tone: ["dark", "soft"] },
    // 빛·공간
    { w: "Glow",       ko: "은은한 빛 · 스며 나오는 밝기", tone: ["warm", "bright"] },
    { w: "Halo",       ko: "달무리 · 빛 주위를 감싸는 테", tone: ["bright", "soft"] },
    { w: "Void",       ko: "공백 · 텅 비어 있는 공간", tone: ["dark"] },
    { w: "Depth",      ko: "깊이 · 아래로 가라앉는 층위", tone: ["dark", "cool"] },
    { w: "Edge",       ko: "경계 · 날카롭게 갈라지는 선", tone: ["bold"] },
    { w: "Prism",      ko: "프리즘 · 빛이 갈라지는 순간", tone: ["bright", "bold"] },
    // 소리·정서
    { w: "Whisper",    ko: "속삭임 · 낮고 가까운 소리", tone: ["soft"] },
    { w: "Harmony",    ko: "조화 · 서로 어우러지는 균형", tone: ["soft"] },
    { w: "Chaos",      ko: "혼돈 · 뒤엉켜 흐트러진", tone: ["bold", "dark"] },
    // 여정·상징
    { w: "Ritual",     ko: "의식 · 반복되는 상징적 행위", tone: ["dark"] },
    { w: "Myth",       ko: "신화 · 오래 전해 내려온 이야기", tone: ["dark", "soft"] },
    { w: "Wander",     ko: "방랑 · 정처 없이 떠도는", tone: ["soft"] },
    { w: "Anchor",     ko: "닻 · 흔들림을 붙잡는 중심", tone: ["dark", "cool"] },
    { w: "Compass",    ko: "나침반 · 방향을 가리키는" },
    { w: "Lantern",    ko: "등불 · 어둠 속 작은 빛", tone: ["warm", "bright"] }
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

  /* ---------- RGB -> HSL / HEX (used by photo color extraction) ---------- */
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s = 0, l = (max + min) / 2;
    var d = max - min;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * ((b - r) / d + 2);
      else h = 60 * ((r - g) / d + 4);
    }
    if (h < 0) h += 360;
    return { h: h, s: s * 100, l: l * 100 };
  }

  function rgbToHex(r, g, b) {
    function to2(v) {
      var hex = Math.round(Math.max(0, Math.min(255, v))).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }
    return ("#" + to2(r) + to2(g) + to2(b)).toUpperCase();
  }

  function circularDist(a, b) {
    var d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  // Order a palette so mood visuals that rely on a light/dark anchor look right.
  function sortPalette(colors, order) {
    var c = colors.slice();
    if (order === "lightness" || order === "light") {
      c.sort(function (a, b) { return lightnessOf(b) - lightnessOf(a); });
    } else if (order === "dark") {
      c.sort(function (a, b) { return lightnessOf(a) - lightnessOf(b); });
    }
    return c;
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
    return sortPalette(colors, cfg.order);
  }

  /* ============================================================
     Photo-based generation — extract the dominant colors of an
     uploaded image (client-side, via <canvas>) and match them to
     the closest mood + a handful of tone-appropriate keywords.
     This is a color-science match, not object recognition: it
     reads the photo's hue/saturation/lightness, not "what's in it".
     ============================================================ */

  // Downscale to a small canvas, bucket pixels by quantized color, and
  // return up to 5 visually distinct dominant colors plus the image's
  // overall hue/saturation/lightness (weighted across all sampled pixels).
  function extractColorsFromImage(img) {
    var MAX_DIM = 100;
    var scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
    var w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
    var h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    var data;
    try {
      data = ctx.getImageData(0, 0, w, h).data;
    } catch (e) {
      return null; // e.g. tainted canvas on some browsers/local file edge cases
    }

    var BUCKET = 24;
    var buckets = {};
    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 40) continue; // skip near-transparent pixels
      var r = data[i], g = data[i + 1], b = data[i + 2];
      var key = Math.round(r / BUCKET) + "," + Math.round(g / BUCKET) + "," + Math.round(b / BUCKET);
      var bucket = buckets[key];
      if (!bucket) { bucket = { r: 0, g: 0, b: 0, count: 0 }; buckets[key] = bucket; }
      bucket.r += r; bucket.g += g; bucket.b += b; bucket.count++;
    }

    var list = keys(buckets).map(function (key) {
      var bkt = buckets[key];
      return { r: bkt.r / bkt.count, g: bkt.g / bkt.count, b: bkt.b / bkt.count, count: bkt.count };
    });
    if (!list.length) return null;
    list.sort(function (a, b) { return b.count - a.count; });

    // Pick up to 5 dominant colors that are visually distinct from each other.
    var picked = [];
    var MIN_DIST = 40;
    list.forEach(function (cand) {
      if (picked.length >= 5) return;
      var tooClose = picked.some(function (p) {
        var dr = p.r - cand.r, dg = p.g - cand.g, db = p.b - cand.b;
        return Math.sqrt(dr * dr + dg * dg + db * db) < MIN_DIST;
      });
      if (!tooClose) picked.push(cand);
    });
    for (var k = 0; picked.length < 5 && k < list.length; k++) {
      picked.push(list[k]); // flat/near-monochrome image: relax distinctness to fill 5
    }

    // Overall tone, weighted by how much of the image each bucket covers.
    // Hue uses a circular (vector) mean, weighted extra by saturation so
    // near-gray pixels don't skew the average hue toward an arbitrary value.
    var sumS = 0, sumL = 0, sumCosH = 0, sumSinH = 0, hueWeightTotal = 0, totalWeight = 0;
    list.forEach(function (c) {
      var hsl = rgbToHsl(c.r, c.g, c.b);
      totalWeight += c.count;
      sumS += hsl.s * c.count;
      sumL += hsl.l * c.count;
      var hueWeight = c.count * (hsl.s / 100);
      sumCosH += Math.cos(hsl.h * Math.PI / 180) * hueWeight;
      sumSinH += Math.sin(hsl.h * Math.PI / 180) * hueWeight;
      hueWeightTotal += hueWeight;
    });

    var colors = picked.map(function (c) { return rgbToHex(c.r, c.g, c.b); });
    while (colors.length < 5) colors.push(colors[colors.length % picked.length] || "#888888");

    return {
      colors: colors.slice(0, 5),
      avgH: hueWeightTotal > 0.0001 ? (Math.atan2(sumSinH, sumCosH) * 180 / Math.PI + 360) % 360 : 0,
      avgS: totalWeight ? sumS / totalWeight : 40,
      avgL: totalWeight ? sumL / totalWeight : 50
    };
  }

  // Match the photo's overall tone to whichever mood's own h/s/l ranges
  // (already defined above for random generation) it sits closest to.
  function matchMoodToTone(avgH, avgS, avgL) {
    var bestName = null, bestScore = Infinity;
    keys(MOODS).forEach(function (name) {
      var p = MOODS[name].palette;
      var sCenter = (p.s[0] + p.s[1]) / 2;
      var lCenter = (p.l[0] + p.l[1]) / 2;
      var fullHueRange = (p.h[1] - p.h[0]) >= 359;
      var hueDist = fullHueRange ? 0 : circularDist(avgH, (p.h[0] + p.h[1]) / 2) / 180;
      var score = hueDist + Math.abs(avgS - sCenter) / 100 * 1.3 + Math.abs(avgL - lCenter) / 100 * 1.3;
      if (score < bestScore) { bestScore = score; bestName = name; }
    });
    return bestName;
  }

  function toneTagsForImage(avgH, avgS, avgL) {
    var tags = [];
    if (avgH <= 70 || avgH >= 300) tags.push("warm");
    else if (avgH >= 150 && avgH <= 260) tags.push("cool");
    if (avgL >= 65) tags.push("bright");
    else if (avgL <= 35) tags.push("dark");
    if (avgS <= 32) tags.push("soft");
    else if (avgS >= 65) tags.push("bold");
    return tags;
  }

  // Prefer keywords tagged with a matching tone; top up with a random
  // sample from the rest of the pool if too few tagged matches exist.
  function pickKeywordsForTone(tags) {
    if (!tags.length) return sample(KEYWORDS, 3);
    var matches = KEYWORDS.filter(function (k) {
      return k.tone && k.tone.some(function (t) { return tags.indexOf(t) !== -1; });
    });
    if (matches.length >= 3) return sample(matches, 3);
    var rest = KEYWORDS.filter(function (k) { return matches.indexOf(k) === -1; });
    return shuffle(matches.concat(sample(rest, 3 - matches.length)));
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

  function pickOtherMood(cur) {
    var pool = keys(MOODS).filter(function (m) { return m !== cur; });
    return pick(pool);
  }

  /* Modes:
       "new"     — fresh mood + color + keyword (main button)
       "mood"    — new mood only (keep colors + keywords; palette re-anchored)
       "palette" — new colors only, same mood family (keep mood + keywords)
       "keyword" — new keywords only (keep mood + colors)
     Any partial re-roll bumps the variation counter (Set NN · vK). */
  function generate(mode) {
    if (!current) mode = "new";

    var moodName, mood, palette, words, wordFonts;

    if (mode === "new") {
      moodName = pick(keys(MOODS));
      mood = MOODS[moodName];
      palette = makePalette(mood.palette);
      words = sample(KEYWORDS, 3);
      wordFonts = pickWordFonts(mood.type);
      baseCount++;
      varCount = 0;
    } else {
      // start from the current set, then re-roll one dimension
      moodName = current.moodName;
      mood = current.mood;
      palette = current.palette;
      words = current.words;
      wordFonts = current.wordFonts;

      if (mode === "mood") {
        moodName = pickOtherMood(current.moodName);
        mood = MOODS[moodName];
        // keep the same colors, but re-anchor their order to the new mood's visual
        palette = sortPalette(current.palette, mood.palette.order);
      } else if (mode === "palette") {
        palette = makePalette(mood.palette);
      } else if (mode === "keyword") {
        words = sample(KEYWORDS, 3);
        wordFonts = pickWordFonts(mood.type);
      }
      varCount++;
    }

    var label = "Set " + String(baseCount).padStart(2, "0") +
      (varCount ? " · v" + varCount : "");
    var shown = palette.slice(0, mood.palette.count); // swatches/brief

    current = {
      moodName: moodName, mood: mood, palette: palette, shown: shown,
      words: words, wordFonts: wordFonts, label: label
    };
    render(current);
    pushHistory(current);
  }

  // Build a set from an uploaded photo: real extracted colors for the
  // palette, the closest-matching mood, and tone-appropriate keywords.
  function generateFromPhoto(file) {
    if (!file || file.type.indexOf("image/") !== 0) {
      showToast("이미지 파일만 사용할 수 있어요");
      return;
    }
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var tone = extractColorsFromImage(img);
      URL.revokeObjectURL(url);
      if (!tone) {
        showToast("이미지를 분석하지 못했어요");
        return;
      }
      var moodName = matchMoodToTone(tone.avgH, tone.avgS, tone.avgL);
      var mood = MOODS[moodName];
      var palette = sortPalette(tone.colors, mood.palette.order);
      var words = pickKeywordsForTone(toneTagsForImage(tone.avgH, tone.avgS, tone.avgL));
      var wordFonts = pickWordFonts(mood.type);

      baseCount++;
      varCount = 0;
      current = {
        moodName: moodName, mood: mood, palette: palette,
        shown: palette.slice(0, mood.palette.count),
        words: words, wordFonts: wordFonts,
        label: "Set " + String(baseCount).padStart(2, "0") + " · photo"
      };
      render(current);
      pushHistory(current);
      showToast("사진에서 " + moodName + " 무드를 뽑았습니다");
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      showToast("이미지를 불러오지 못했어요");
    };
    img.src = url;
  }

  /* ---------- Render ---------- */
  var el = {
    result: document.getElementById("result"),
    index: document.getElementById("resultIndex"),
    moodVisual: document.getElementById("moodVisual"),
    moodName: document.getElementById("moodName"),
    moodDesc: document.getElementById("moodDesc"),
    swatches: document.getElementById("swatches"),
    keywords: document.getElementById("keywords"),
    savedToggle: document.getElementById("openSaved"),
    savedCount: document.getElementById("savedCount"),
    savedOverlay: document.getElementById("savedOverlay"),
    savedPanel: document.getElementById("savedPanel"),
    savedList: document.getElementById("savedList"),
    savedEmpty: document.getElementById("savedEmpty"),
    historyList: document.getElementById("historyList"),
    historyEmpty: document.getElementById("historyEmpty"),
    tabSaved: document.getElementById("tabSaved"),
    tabHistory: document.getElementById("tabHistory"),
    clearHistory: document.getElementById("clearHistory")
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

    // --- Keywords (each in its own mixed font, with its meaning) ---
    el.keywords.innerHTML = "";
    state.words.forEach(function (kw, i) {
      var li = document.createElement("li");

      var num = document.createElement("span");
      num.className = "num";
      num.textContent = "0" + (i + 1);

      var body = document.createElement("div");
      body.className = "kw-body";

      var label = document.createElement("span");
      label.className = "kw";
      label.textContent = kw.w;
      var fs = state.wordFonts[i] || state.mood.type;
      label.style.fontFamily = fs.font;
      label.style.fontWeight = fs.weight;
      label.style.fontStyle = fs.style;
      label.style.letterSpacing = fs.tracking;
      label.style.textTransform = fs.transform;
      label.style.fontSize = (1.2 * (fs.size || 1)) + "rem";

      var meaning = document.createElement("span");
      meaning.className = "kw-meaning";
      meaning.textContent = kw.ko;

      body.appendChild(label);
      body.appendChild(meaning);
      li.appendChild(num);
      li.appendChild(body);
      el.keywords.appendChild(li);
    });
  }

  /* ---------- Brief text (used by Copy on saved items) ---------- */
  function briefText(headerLabel, moodName, moodDesc, shown, words) {
    return [
      "MuseBoard — " + headerLabel,
      "",
      "MOOD:    " + moodName + (moodDesc ? " (" + moodDesc + ")" : ""),
      "COLOR:   " + shown.join("  "),
      "KEYWORD: " + words.map(function (k) {
        return k.w + " (" + k.ko.split(" · ")[0] + ")";
      }).join(", ")
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

  /* ============================================================
     Saved sets & History — both persisted in localStorage so they
     survive a reload. No server involved; everything stays on this
     device. Saved = explicit favorites (Save button, kept forever).
     History = automatic trail of the last MAX_HISTORY generations
     (any Generate / per-card reroll), so a good result you forgot
     to save isn't lost the moment you reroll past it.
     ============================================================ */
  var SAVE_KEY = "museboard.saved.v1";
  var HISTORY_KEY = "museboard.history.v1";
  var MAX_HISTORY = 10;

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }

  function loadList(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function persistList(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) {}
  }

  var savedList = loadList(SAVE_KEY);
  var historyList = loadList(HISTORY_KEY);
  var activeTab = "saved";

  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function formatSavedDate(ts) {
    var d = new Date(ts);
    return pad2(d.getMonth() + 1) + "." + pad2(d.getDate()) + " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }

  function snapshotOf(state) {
    return {
      id: uid(),
      savedAt: Date.now(),
      moodName: state.moodName,
      palette: state.palette,
      shown: state.shown,
      words: state.words,
      wordFonts: state.wordFonts
    };
  }

  function findItem(list, id) {
    return list.filter(function (it) { return it.id === id; })[0];
  }

  function restoreFromItem(item, labelSuffix) {
    var moodName = MOODS[item.moodName] ? item.moodName : keys(MOODS)[0];
    baseCount++;
    varCount = 0;
    current = {
      moodName: moodName,
      mood: MOODS[moodName],
      palette: item.palette,
      shown: item.shown,
      words: item.words,
      wordFonts: item.wordFonts,
      label: "Set " + String(baseCount).padStart(2, "0") + " · " + labelSuffix
    };
    render(current);
  }

  /* ---- Saved (explicit favorites) ---- */
  function saveCurrentSet() {
    if (!current) return;
    savedList.unshift(snapshotOf(current));
    persistList(SAVE_KEY, savedList);
    renderSavedBadge();
    renderSavedList();
    showToast("조합을 저장했습니다");
  }

  function deleteSavedSet(id) {
    savedList = savedList.filter(function (it) { return it.id !== id; });
    persistList(SAVE_KEY, savedList);
    renderSavedBadge();
    renderSavedList();
  }

  function loadSavedSet(id) {
    var item = findItem(savedList, id);
    if (!item) return;
    restoreFromItem(item, "saved");
    closeSavedPanel();
    showToast("저장된 조합을 불러왔습니다");
  }

  function copySavedSet(id) {
    var item = findItem(savedList, id);
    if (!item) return;
    var mood = MOODS[item.moodName];
    var text = briefText("Saved " + formatSavedDate(item.savedAt), item.moodName, mood && mood.desc, item.shown, item.words);
    copyText(text, "저장된 브리프가 복사되었습니다");
  }

  /* ---- History (automatic trail, last MAX_HISTORY generations) ---- */
  function pushHistory(state) {
    historyList.unshift(snapshotOf(state));
    if (historyList.length > MAX_HISTORY) historyList.length = MAX_HISTORY;
    persistList(HISTORY_KEY, historyList);
    renderHistoryList();
  }

  function clearHistoryAll() {
    historyList = [];
    persistList(HISTORY_KEY, historyList);
    renderHistoryList();
    showToast("기록을 지웠습니다");
  }

  function loadHistoryItem(id) {
    var item = findItem(historyList, id);
    if (!item) return;
    restoreFromItem(item, "history");
    closeSavedPanel();
    showToast("이전 기록을 불러왔습니다");
  }

  function copyHistoryItem(id) {
    var item = findItem(historyList, id);
    if (!item) return;
    var mood = MOODS[item.moodName];
    var text = briefText("History " + formatSavedDate(item.savedAt), item.moodName, mood && mood.desc, item.shown, item.words);
    copyText(text, "브리프가 복사되었습니다");
  }

  function promoteHistoryToSaved(id) {
    var item = findItem(historyList, id);
    if (!item) return;
    savedList.unshift(snapshotOf(item));
    persistList(SAVE_KEY, savedList);
    renderSavedBadge();
    renderSavedList();
    showToast("Saved에 저장했습니다");
  }

  /* ---- Shared row rendering ---- */
  var SAVED_ACTIONS = [
    { action: "copy", icon: "ico-copy", aria: "복사", title: "이 조합 복사" },
    { action: "delete", icon: "ico-trash", aria: "삭제", title: "삭제", danger: true }
  ];
  var HISTORY_ACTIONS = [
    { action: "save", icon: "ico-bookmark", aria: "저장", title: "Saved에 저장" },
    { action: "copy", icon: "ico-copy", aria: "복사", title: "이 조합 복사" }
  ];

  function buildItemRow(item, actionsConfig) {
    var row = document.createElement("div");
    row.className = "saved-item";
    row.dataset.id = item.id;

    var strip = document.createElement("div");
    strip.className = "saved-item__strip";
    item.shown.forEach(function (hex) {
      var s = document.createElement("span");
      s.style.background = hex;
      strip.appendChild(s);
    });

    var body = document.createElement("div");
    body.className = "saved-item__body";

    var top = document.createElement("div");
    top.className = "saved-item__top";
    var moodTag = document.createElement("span");
    moodTag.className = "saved-item__mood";
    moodTag.textContent = item.moodName;
    var time = document.createElement("span");
    time.className = "saved-item__time";
    time.textContent = formatSavedDate(item.savedAt);
    top.appendChild(moodTag);
    top.appendChild(time);

    var kw = document.createElement("div");
    kw.className = "saved-item__kw";
    kw.textContent = item.words.map(function (w) { return w.w; }).join(" · ");

    body.appendChild(top);
    body.appendChild(kw);

    var actions = document.createElement("div");
    actions.className = "saved-item__actions";
    actionsConfig.forEach(function (cfg) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "saved-item__action" + (cfg.danger ? " saved-item__action--danger" : "");
      btn.dataset.action = cfg.action;
      btn.setAttribute("aria-label", cfg.aria);
      btn.title = cfg.title;
      btn.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#' + cfg.icon + '"></use></svg>';
      actions.appendChild(btn);
    });

    row.appendChild(strip);
    row.appendChild(body);
    row.appendChild(actions);
    return row;
  }

  function renderSavedBadge() {
    el.savedCount.textContent = savedList.length;
    el.savedCount.hidden = savedList.length === 0;
  }

  function renderSavedList() {
    el.savedList.innerHTML = "";
    savedList.forEach(function (item) { el.savedList.appendChild(buildItemRow(item, SAVED_ACTIONS)); });
    updatePanelView();
  }

  function renderHistoryList() {
    el.historyList.innerHTML = "";
    historyList.forEach(function (item) { el.historyList.appendChild(buildItemRow(item, HISTORY_ACTIONS)); });
    updatePanelView();
  }

  /* ---- Panel: tabs, open/close ---- */
  function updatePanelView() {
    var onSaved = activeTab === "saved";
    el.savedList.hidden = !onSaved || savedList.length === 0;
    el.savedEmpty.hidden = !onSaved || savedList.length > 0;
    el.historyList.hidden = onSaved || historyList.length === 0;
    el.historyEmpty.hidden = onSaved || historyList.length > 0;
    el.tabSaved.classList.toggle("is-active", onSaved);
    el.tabSaved.setAttribute("aria-selected", String(onSaved));
    el.tabHistory.classList.toggle("is-active", !onSaved);
    el.tabHistory.setAttribute("aria-selected", String(!onSaved));
    el.clearHistory.hidden = onSaved || historyList.length === 0;
  }

  function switchTab(tab) {
    activeTab = tab;
    updatePanelView();
  }

  function escToClose(e) { if (e.key === "Escape") closeSavedPanel(); }

  function openSavedPanel() {
    el.savedOverlay.hidden = false;
    el.savedPanel.hidden = false;
    // Force a layout flush so the panel starts from translateX(100%)
    // before the "show" class animates it in (avoids relying on rAF timing).
    void el.savedPanel.offsetWidth;
    el.savedOverlay.classList.add("show");
    el.savedPanel.classList.add("show");
    document.addEventListener("keydown", escToClose);
  }

  function closeSavedPanel() {
    el.savedOverlay.classList.remove("show");
    el.savedPanel.classList.remove("show");
    setTimeout(function () {
      el.savedOverlay.hidden = true;
      el.savedPanel.hidden = true;
    }, 250);
    document.removeEventListener("keydown", escToClose);
  }

  renderSavedBadge();
  renderSavedList();
  renderHistoryList();

  /* ---------- Events ---------- */
  document.getElementById("generate").addEventListener("click", function () { generate("new"); });
  document.getElementById("rerollMood").addEventListener("click", function () { generate("mood"); });
  document.getElementById("rerollColor").addEventListener("click", function () { generate("palette"); });
  document.getElementById("rerollKeyword").addEventListener("click", function () { generate("keyword"); });
  document.getElementById("save").addEventListener("click", saveCurrentSet);

  var photoInput = document.getElementById("photoInput");
  document.getElementById("uploadPhotoBtn").addEventListener("click", function () { photoInput.click(); });
  photoInput.addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (file) generateFromPhoto(file);
    e.target.value = ""; // allow re-selecting the same file next time
  });

  el.savedToggle.addEventListener("click", openSavedPanel);
  document.getElementById("closeSaved").addEventListener("click", closeSavedPanel);
  el.savedOverlay.addEventListener("click", closeSavedPanel);
  el.tabSaved.addEventListener("click", function () { switchTab("saved"); });
  el.tabHistory.addEventListener("click", function () { switchTab("history"); });
  el.clearHistory.addEventListener("click", clearHistoryAll);

  el.savedList.addEventListener("click", function (e) {
    var row = e.target.closest(".saved-item");
    if (!row) return;
    var id = row.dataset.id;
    var actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      e.stopPropagation();
      if (actionBtn.dataset.action === "copy") copySavedSet(id);
      else if (actionBtn.dataset.action === "delete") deleteSavedSet(id);
    } else {
      loadSavedSet(id);
    }
  });

  el.historyList.addEventListener("click", function (e) {
    var row = e.target.closest(".saved-item");
    if (!row) return;
    var id = row.dataset.id;
    var actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      e.stopPropagation();
      if (actionBtn.dataset.action === "save") promoteHistoryToSaved(id);
      else if (actionBtn.dataset.action === "copy") copyHistoryItem(id);
    } else {
      loadHistoryItem(id);
    }
  });

  // keyboard: spacebar = new set (when not focused on a button)
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      generate("new");
    }
  });
})();
