// Graveyard atmospheric canvas: deep teal fog, drifting embers, gravestone silhouettes,
// distant lantern glow, and a slow camera-drift ambience. Reacts to mouse for parallax.
(function () {
  const canvas = document.getElementById('scene-graveyard');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mouseX = 0, mouseY = 0;
  let running = true;

  function resize() {
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });
  resize();

  // Embers (drifting upward dust/ash) - reduced on mobile
  const isMobile = window.innerWidth <= 768;
  const emberCount = isMobile ? 40 : 80;
  const embers = Array.from({ length: emberCount }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 0.6 + Math.random() * 1.6,
    vy: -0.15 - Math.random() * 0.4,
    vx: (Math.random() - 0.5) * 0.15,
    a: 0.2 + Math.random() * 0.5,
    h: Math.random() < 0.15 ? 'ember' : 'ash',
  }));

  // Gravestones (silhouette positions)
  const stones = [];
  for (let i = 0; i < 14; i++) {
    stones.push({
      x: (i / 14) * 1.4 - 0.2 + (Math.random() - 0.5) * 0.04,
      depth: 0.55 + Math.random() * 0.4,
      type: Math.floor(Math.random() * 3),
      h: 60 + Math.random() * 90,
      tilt: (Math.random() - 0.5) * 0.15,
    });
  }

  // Dead trees (a couple of branchy silhouettes)
  const trees = [
    { x: 0.12, scale: 1.0, depth: 0.4 },
    { x: 0.86, scale: 1.2, depth: 0.45 },
    { x: 0.55, scale: 0.7, depth: 0.7 },
  ];

  // Distant lanterns (red/orange glow points)
  const lanterns = [
    { x: 0.22, y: 0.62, r: 22, color: 'rgba(255,90,40,0.6)' },
    { x: 0.78, y: 0.66, r: 18, color: 'rgba(255,120,50,0.5)' },
    { x: 0.5, y: 0.58, r: 30, color: 'rgba(120,40,40,0.4)' },
  ];

  function drawSky() {
    // deep night sky with subtle teal moonlight
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#05080a');
    g.addColorStop(0.45, '#0a1418');
    g.addColorStop(0.7, '#0d1a1d');
    g.addColorStop(1, '#04070a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // moon
    const mx = W * (0.72 + mouseX * 0.02);
    const my = H * (0.22 + mouseY * 0.01);
    const mr = Math.min(W, H) * 0.06;
    const moonG = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 6);
    moonG.addColorStop(0, 'rgba(200,220,225,0.55)');
    moonG.addColorStop(0.2, 'rgba(120,170,180,0.18)');
    moonG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = moonG;
    ctx.fillRect(0, 0, W, H);

    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(220,225,220,0.85)';
    ctx.fill();
  }

  function drawFog(t) {
    // Layered teal fog bands
    const bands = 5;
    for (let i = 0; i < bands; i++) {
      const y = H * (0.45 + i * 0.10);
      const alpha = 0.10 + i * 0.04;
      const drift = (t * 0.00002 * (i + 1)) % 1;
      const grd = ctx.createLinearGradient(0, y - 60, 0, y + 120);
      grd.addColorStop(0, `rgba(40,90,100,0)`);
      grd.addColorStop(0.5, `rgba(40,90,100,${alpha})`);
      grd.addColorStop(1, `rgba(8,14,16,0)`);
      ctx.fillStyle = grd;
      ctx.save();
      ctx.translate(-W * drift, 0);
      ctx.fillRect(0, y - 80, W * 2, 200);
      ctx.restore();
    }
  }

  function drawTree(tx, ty, scale) {
    ctx.strokeStyle = 'rgba(0,0,0,0.95)';
    ctx.fillStyle = 'rgba(0,0,0,0.95)';
    ctx.lineWidth = 4 * scale;
    ctx.lineCap = 'round';

    function branch(x, y, len, angle, depth) {
      if (depth <= 0) return;
      const x2 = x + Math.cos(angle) * len;
      const y2 = y + Math.sin(angle) * len;
      ctx.lineWidth = Math.max(0.6, depth * 1.6 * scale);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const branches = 2 + Math.floor(Math.random() * 1.5);
      for (let i = 0; i < branches; i++) {
        const a = angle + (Math.random() - 0.5) * 1.0;
        branch(x2, y2, len * (0.65 + Math.random() * 0.15), a, depth - 1);
      }
    }
    // fixed seed-ish using deterministic noise via Math.sin
    const trunkLen = 120 * scale;
    branch(tx, ty, trunkLen, -Math.PI / 2 + 0.05, 6);
  }

  // Cache trees on offscreen canvas
  const treeCanvas = document.createElement('canvas');
  treeCanvas.width = W * dpr; treeCanvas.height = H * dpr;
  let treesCached = false;
  let cachedTreeCanvasWidth = W * dpr;

  function ensureTrees() {
    if (treesCached && cachedTreeCanvasWidth === W * dpr) return;
    treeCanvas.width = W * dpr;
    treeCanvas.height = H * dpr;
    cachedTreeCanvasWidth = W * dpr;
    const tctx = treeCanvas.getContext('2d');
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.clearRect(0, 0, W, H);

    function seededRandom(seed) {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }

    function localBranch(x, y, len, angle, depth, scale, seed) {
      if (depth <= 0) return;
      const x2 = x + Math.cos(angle) * len;
      const y2 = y + Math.sin(angle) * len;
      tctx.lineWidth = Math.max(0.6, depth * 1.6 * scale);
      tctx.beginPath();
      tctx.moveTo(x, y);
      tctx.lineTo(x2, y2);
      tctx.stroke();
      const branches = 2 + Math.floor(seededRandom(seed + depth) * 1.5);
      for (let i = 0; i < branches; i++) {
        const a = angle + (seededRandom(seed + depth + i) - 0.5) * 1.0;
        localBranch(x2, y2, len * (0.65 + seededRandom(seed + depth + i * 0.1) * 0.15), a, depth - 1, scale, seed);
      }
    }

    tctx.strokeStyle = '#000';
    tctx.lineCap = 'round';
    trees.forEach((tr, treeIdx) => {
      const tx = W * tr.x;
      const ty = H * 0.86;
      const treeSeed = treeIdx + 1000;
      localBranch(tx, ty, 130 * tr.scale, -Math.PI / 2 + (seededRandom(treeSeed) - 0.5) * 0.1, 6, tr.scale, treeSeed);
    });
    treesCached = true;
  }

  function drawGround() {
    // Ground silhouette
    ctx.fillStyle = '#03050a';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    let x = 0;
    while (x < W) {
      const y = H * 0.78 + Math.sin(x * 0.012) * 6 + Math.sin(x * 0.04) * 3;
      ctx.lineTo(x, y);
      x += 8;
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawGravestones() {
    stones.forEach((s, i) => {
      const baseY = H * (0.74 + s.depth * 0.04);
      const x = W * s.x + mouseX * (10 - s.depth * 8);
      const sh = s.h * (0.7 + s.depth * 0.6);
      const sw = sh * 0.45;
      const alpha = 0.6 + s.depth * 0.35;
      ctx.save();
      ctx.translate(x, baseY);
      ctx.rotate(s.tilt);
      ctx.fillStyle = `rgba(8,10,14,${alpha})`;
      ctx.strokeStyle = `rgba(20,30,32,${alpha})`;
      // shape varies
      if (s.type === 0) {
        // arched headstone
        ctx.beginPath();
        ctx.moveTo(-sw/2, 0);
        ctx.lineTo(-sw/2, -sh*0.65);
        ctx.quadraticCurveTo(0, -sh, sw/2, -sh*0.65);
        ctx.lineTo(sw/2, 0);
        ctx.closePath();
        ctx.fill();
      } else if (s.type === 1) {
        // cross
        ctx.fillRect(-sw*0.10, -sh, sw*0.20, sh);
        ctx.fillRect(-sw*0.45, -sh*0.7, sw*0.90, sw*0.18);
      } else {
        // broken slab
        ctx.beginPath();
        ctx.moveTo(-sw/2, 0);
        ctx.lineTo(-sw/2, -sh*0.7);
        ctx.lineTo(-sw*0.1, -sh*0.55);
        ctx.lineTo(sw*0.2, -sh*0.8);
        ctx.lineTo(sw/2, -sh*0.6);
        ctx.lineTo(sw/2, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawLanterns(t) {
    lanterns.forEach((l, i) => {
      const x = W * l.x;
      const y = H * l.y;
      const flick = 0.85 + Math.sin(t * 0.005 + i) * 0.1 + Math.random() * 0.05;
      const g = ctx.createRadialGradient(x, y, 0, x, y, l.r * 8);
      g.addColorStop(0, l.color);
      g.addColorStop(0.3, l.color.replace(/[\d.]+\)$/, '0.15)'));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = flick;
      ctx.fillStyle = g;
      ctx.fillRect(x - l.r * 8, y - l.r * 8, l.r * 16, l.r * 16);
      // small core
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,180,120,0.95)';
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function drawEmbers(dt) {
    embers.forEach(e => {
      e.x += e.vx + Math.sin((e.y + performance.now() * 0.001) * 0.02) * 0.2;
      e.y += e.vy;
      if (e.y < -10) { e.y = H + 10; e.x = Math.random() * W; }
      if (e.h === 'ember') {
        ctx.fillStyle = `rgba(255,140,80,${e.a})`;
        ctx.shadowColor = 'rgba(255,140,80,0.9)';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(180,200,210,${e.a * 0.4})`;
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function frame(t) {
    if (!running) return;
    if (canvas.style.display === 'none') { requestAnimationFrame(frame); return; }
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawFog(t);
    drawLanterns(t);
    ensureTrees();
    ctx.drawImage(treeCanvas, 0, 0, W, H);
    drawGround();
    drawGravestones();
    drawFog(t + 5000); // foreground fog
    drawEmbers();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.__graveyardScene = {
    setVisible(v) { canvas.style.display = v ? 'block' : 'none'; }
  };
})();
