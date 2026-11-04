import * as THREE from 'three';

let _aniso = 8;
export function setAnisotropy(v) { _aniso = v; }

function canvas(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')];
}

function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function tex(c, repeat = 1, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = _aniso;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function camoTexture(seed = 7, palette = ['#5c6047', '#454a36', '#7a7053', '#32362a', '#8b7f60'], repeat = 2) {
  const [c, g] = canvas(512);
  const r = rng(seed);
  g.fillStyle = palette[0];
  g.fillRect(0, 0, 512, 512);
  const blobs = 190;
  for (let i = 0; i < blobs; i++) {
    const col = palette[1 + Math.floor(r() * (palette.length - 1))];
    g.fillStyle = col;
    const x = r() * 512, y = r() * 512;
    const w = 22 + r() * 95, h = 14 + r() * 46;
    const rot = r() * Math.PI;
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    g.beginPath();
    const pts = 7 + Math.floor(r() * 4);
    for (let p = 0; p < pts; p++) {
      const a = (p / pts) * Math.PI * 2;
      const rr = 0.55 + r() * 0.55;
      const px = Math.cos(a) * w * rr, py = Math.sin(a) * h * rr;
      p ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.closePath();
    g.fill();
    g.restore();
    // wrap edges for seamless tiling
    for (const [ox, oy] of [[512, 0], [-512, 0], [0, 512], [0, -512]]) {
      g.save();
      g.translate(ox, oy);
      g.translate(x, y);
      g.rotate(rot);
      g.fillStyle = col;
      g.beginPath();
      g.ellipse(0, 0, w * 0.7, h * 0.7, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
  // fine speckle / weave
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.035)';
    g.fillRect(r() * 512, r() * 512, 1.5, 1.5);
  }
  return tex(c, repeat);
}

export function fabricTexture(base = '#4b4d3d', repeat = 4, seed = 3) {
  const [c, g] = canvas(256);
  const r = rng(seed);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 13000; i++) {
    const v = r();
    g.fillStyle = v > 0.5 ? `rgba(255,255,255,${0.02 + r() * 0.05})` : `rgba(0,0,0,${0.03 + r() * 0.07})`;
    g.fillRect(r() * 256, r() * 256, 1, 1);
  }
  for (let y = 0; y < 256; y += 3) {
    g.fillStyle = 'rgba(0,0,0,0.05)';
    g.fillRect(0, y, 256, 1);
  }
  return tex(c, repeat);
}

export function groundTexture(seed = 11) {
  const [c, g] = canvas(512);
  const r = rng(seed);
  g.fillStyle = '#7b6a51';
  g.fillRect(0, 0, 512, 512);
  // broad tonal patches
  for (let i = 0; i < 80; i++) {
    g.fillStyle = ['rgba(96,82,60,0.4)', 'rgba(139,122,92,0.35)', 'rgba(67,62,47,0.3)', 'rgba(157,139,105,0.22)'][Math.floor(r() * 4)];
    g.beginPath();
    g.ellipse(r() * 512, r() * 512, 20 + r() * 100, 12 + r() * 70, r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  // gravel
  for (let i = 0; i < 4200; i++) {
    const x = r() * 512, y = r() * 512, s = 0.7 + r() * 2.4;
    g.fillStyle = r() > 0.55 ? `rgba(${120 + r() * 60 | 0},${105 + r() * 50 | 0},${80 + r() * 40 | 0},0.55)` : 'rgba(45,40,32,0.4)';
    g.beginPath();
    g.ellipse(x, y, s, s * (0.5 + r() * 0.7), r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  // tyre / drag marks
  g.strokeStyle = 'rgba(55,48,38,0.28)';
  for (let i = 0; i < 7; i++) {
    g.lineWidth = 3 + r() * 5;
    g.beginPath();
    const x = r() * 512;
    g.moveTo(x, 0);
    g.bezierCurveTo(x + 20, 170, x - 30, 330, x + 12, 512);
    g.stroke();
  }
  return tex(c, 26);
}

export function concreteTexture(seed = 5) {
  const [c, g] = canvas(512);
  const r = rng(seed);
  g.fillStyle = '#8d8b81';
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.065)';
    g.fillRect(r() * 512, r() * 512, 1 + r() * 2, 1 + r() * 2);
  }
  for (let i = 0; i < 20; i++) {
    g.strokeStyle = `rgba(45,44,40,${0.1 + r() * 0.16})`;
    g.lineWidth = 0.5 + r() * 1.2;
    g.beginPath();
    let x = r() * 512, y = r() * 512;
    g.moveTo(x, y);
    for (let s = 0; s < 5; s++) { x += (r() - 0.5) * 90; y += (r() - 0.5) * 90; g.lineTo(x, y); }
    g.stroke();
  }
  // expansion joints
  g.strokeStyle = 'rgba(35,34,30,0.35)';
  g.lineWidth = 2;
  g.strokeRect(4, 4, 256, 256); g.strokeRect(260, 260, 248, 248);
  return tex(c, 5);
}

export function woodTexture(seed = 4, light = false) {
  const [c, g] = canvas(512);
  const r = rng(seed);
  const base = light ? '#8a5e37' : '#59351f';
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) {
    const y = r() * 512;
    g.strokeStyle = r() > 0.5 ? `rgba(${light ? 190 : 120},${light ? 140 : 80},${light ? 90 : 48},${0.12 + r() * 0.18})` : `rgba(30,16,8,${0.12 + r() * 0.2})`;
    g.lineWidth = 1 + r() * 4;
    g.beginPath();
    for (let x = 0; x <= 512; x += 16) {
      const yy = y + Math.sin(x * 0.018 + i) * (4 + r() * 8) + Math.sin(x * 0.06 + i * 2) * 1.5;
      x ? g.lineTo(x, yy) : g.moveTo(x, yy);
    }
    g.stroke();
  }
  // knots
  for (let i = 0; i < 5; i++) {
    const x = r() * 512, y = r() * 512;
    for (let k = 0; k < 7; k++) {
      g.strokeStyle = `rgba(35,20,10,${0.25 - k * 0.025})`;
      g.lineWidth = 1.5;
      g.beginPath();
      g.ellipse(x, y, 4 + k * 3.5, 8 + k * 6, 0.3, 0, Math.PI * 2);
      g.stroke();
    }
  }
  return tex(c, 1);
}

export function laminateTexture(seed = 12) {
  const [c, g] = canvas(512);
  const r = rng(seed);
  g.fillStyle = '#6d6a61';
  g.fillRect(0, 0, 512, 512);
  // layered laminate strips
  for (let i = 0; i < 34; i++) {
    const x = (i / 34) * 512 + (r() - 0.5) * 8;
    g.fillStyle = ['#4e4c45', '#7d7a6e', '#5d5b52', '#8b8779'][i % 4];
    g.globalAlpha = 0.5 + r() * 0.4;
    g.fillRect(x, 0, 3 + r() * 8, 512);
    g.globalAlpha = 1;
  }
  for (let i = 0; i < 4000; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
    g.fillRect(r() * 512, r() * 512, 1, 2);
  }
  return tex(c, 1);
}

export function targetTexture(kind = 'paper') {
  const [c, g] = canvas(512);
  if (kind === 'paper') {
    g.fillStyle = '#cfc9b6';
    g.fillRect(0, 0, 512, 512);
    // subtle paper grain
    const r = rng(22);
    for (let i = 0; i < 5000; i++) {
      g.fillStyle = r() > 0.5 ? 'rgba(80,72,55,0.04)' : 'rgba(255,255,255,0.05)';
      g.fillRect(r() * 512, r() * 512, 1, 1);
    }
    // scoring rings
    const rings = [[196, 'rgba(45,45,40,0.75)', 2], [158, 'rgba(45,45,40,0.65)', 1.6], [120, 'rgba(45,45,40,0.65)', 1.6], [82, 'rgba(45,45,40,0.6)', 1.6], [44, 'rgba(170,55,40,0.85)', 2.5]];
    for (const [rad, col, w] of rings) {
      g.strokeStyle = col; g.lineWidth = w;
      g.beginPath(); g.arc(256, 256, rad, 0, Math.PI * 2); g.stroke();
    }
    // silhouette
    g.fillStyle = 'rgba(52,54,47,0.78)';
    g.beginPath();
    g.arc(256, 176, 34, 0, Math.PI * 2); g.fill();
    g.beginPath();
    g.moveTo(212, 210); g.quadraticCurveTo(256, 195, 300, 210);
    g.lineTo(322, 300); g.quadraticCurveTo(325, 375, 300, 420);
    g.lineTo(270, 410); g.lineTo(262, 330); g.lineTo(250, 330); g.lineTo(242, 410); g.lineTo(212, 420);
    g.quadraticCurveTo(187, 375, 190, 300); g.closePath(); g.fill();
    // scoring numbers
    g.fillStyle = 'rgba(50,48,40,0.7)';
    g.font = 'bold 20px monospace';
    g.textAlign = 'center';
    g.fillText('8', 256, 96); g.fillText('9', 256, 138); g.fillText('10', 256, 222);
    // target header
    g.fillStyle = 'rgba(60,58,48,0.75)';
    g.font = 'bold 17px monospace';
    g.fillText('KESTREL / 100 M', 256, 470);
    g.font = '11px monospace';
    g.fillText('TYPE 4 · PAPER · 1:1', 256, 490);
    // corner marks
    g.strokeStyle = 'rgba(50,48,40,0.55)'; g.lineWidth = 2;
    for (const [x, y, sx, sy] of [[32,32,1,1],[480,32,-1,1],[32,480,1,-1],[480,480,-1,-1]]) {
      g.beginPath(); g.moveTo(x, y + 16 * sy); g.lineTo(x, y); g.lineTo(x + 16 * sx, y); g.stroke();
    }
  } else {
    // steel silhouette face — orange / white respray
    g.fillStyle = '#b9b4a5';
    g.fillRect(0, 0, 512, 512);
    const r = rng(9);
    for (let i = 0; i < 120; i++) {
      g.fillStyle = `rgba(90,84,66,${r() * 0.15})`;
      g.beginPath(); g.arc(r() * 512, r() * 512, 3 + r() * 20, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#cc5a33';
    g.font = 'bold 30px monospace';
    g.textAlign = 'center';
    g.fillText('STEEL', 256, 80);
    g.font = '16px monospace';
    g.fillText('KESTREL RIDGE', 256, 450);
  }
  return tex(c, 1);
}

export function signTexture(title, sub = '', opts = {}) {
  const [c, g] = canvas(512);
  const bg = opts.bg || '#c9a43a';
  const fg = opts.fg || '#1a1810';
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = opts.border || fg;
  g.lineWidth = 14;
  g.strokeRect(22, 22, 468, 468);
  if (opts.danger) {
    g.fillStyle = '#b53a2a';
    g.beginPath();
    g.moveTo(256, 60); g.lineTo(430, 420); g.lineTo(82, 420); g.closePath(); g.fill();
    g.fillStyle = '#f2ead6';
    g.font = 'bold 190px serif';
    g.textAlign = 'center';
    g.fillText('!', 256, 350);
    g.font = 'bold 42px sans-serif';
    g.fillText(title, 256, 478);
    return tex(c, 1);
  }
  g.fillStyle = fg;
  g.font = 'bold 54px monospace';
  g.textAlign = 'center';
  const words = title.split('\n');
  words.forEach((w, i) => g.fillText(w, 256, 200 + i * 62));
  if (sub) {
    g.font = '22px monospace';
    g.globalAlpha = 0.7;
    const subs = sub.split('\n');
    subs.forEach((w, i) => g.fillText(w, 256, 330 + i * 28));
  }
  return tex(c, 1);
}

export function reticleTexture(kind = 'holo', color = '#ff3b20') {
  const [c, g] = canvas(256);
  g.clearRect(0, 0, 256, 256);
  g.strokeStyle = color;
  g.fillStyle = color;
  g.shadowColor = color;
  g.shadowBlur = 14;
  g.lineWidth = 3;
  g.strokeStyle = color;
  if (kind === 'holo') {
    g.beginPath(); g.arc(128, 128, 66, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2;
    g.beginPath(); g.arc(128, 128, 5, 0, Math.PI * 2); g.fillStyle = color; g.fill();
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      g.beginPath();
      g.moveTo(128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70);
      g.lineTo(128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92);
      g.stroke();
    }
    g.beginPath();
    g.moveTo(128, 128 - 34); g.lineTo(128, 128 - 22);
    g.moveTo(128, 128 + 22); g.lineTo(128, 128 + 34);
    g.stroke();
  } else if (kind === 'dot') {
    g.beginPath(); g.arc(128, 128, 7, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 0.35; g.beginPath(); g.arc(128, 128, 20, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
  } else {
    g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(128, 20); g.lineTo(128, 112); g.moveTo(128, 144); g.lineTo(128, 236); g.stroke();
    g.beginPath(); g.moveTo(20, 128); g.lineTo(112, 128); g.moveTo(144, 128); g.lineTo(236, 128); g.stroke();
    g.beginPath(); g.arc(128, 128, 2.5, 0, Math.PI * 2); g.fill();
  }
  return tex(c, 1);
}

export function flashTexture() {
  const [c, g] = canvas(256);
  g.clearRect(0, 0, 256, 256);
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,255,235,1)');
  grad.addColorStop(0.16, 'rgba(255,220,140,0.95)');
  grad.addColorStop(0.42, 'rgba(255,140,40,0.45)');
  grad.addColorStop(1, 'rgba(255,80,10,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.2;
    g.save();
    g.translate(128, 128);
    g.rotate(a);
    const lg = g.createLinearGradient(0, 0, 0, 110);
    lg.addColorStop(0, 'rgba(255,250,220,0.9)');
    lg.addColorStop(1, 'rgba(255,120,20,0)');
    g.fillStyle = lg;
    g.beginPath(); g.moveTo(-5, 0); g.lineTo(0, 40 + Math.random() * 70); g.lineTo(5, 0); g.closePath(); g.fill();
    g.restore();
  }
  return tex(c, 1);
}

export function smokeTexture() {
  const [c, g] = canvas(128);
  g.clearRect(0, 0, 128, 128);
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,0.45)');
  grad.addColorStop(0.35, 'rgba(230,228,220,0.22)');
  grad.addColorStop(1, 'rgba(210,210,205,0)');
  g.fillStyle = grad;
  g.beginPath(); g.arc(64, 64, 64, 0, Math.PI * 2); g.fill();
  return tex(c, 1);
}

export function grassTexture() {
  const [c, g] = canvas(256);
  g.clearRect(0, 0, 256, 256);
  const r = rng(44);
  for (let i = 0; i < 42; i++) {
    const x = 20 + r() * 216;
    const h = 60 + r() * 140;
    const lean = (r() - 0.5) * 50;
    g.strokeStyle = `rgba(${130 + r() * 50 | 0},${125 + r() * 45 | 0},${75 + r() * 35 | 0},0.85)`;
    g.lineWidth = 1.4 + r() * 2.2;
    g.beginPath();
    g.moveTo(x, 256);
    g.quadraticCurveTo(x + lean * 0.3, 256 - h * 0.5, x + lean, 256 - h);
    g.stroke();
  }
  return tex(c, 1);
}

export function patchTexture() {
  const [c, g] = canvas(256);
  g.fillStyle = '#3d4534';
  g.beginPath(); g.arc(128, 128, 124, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#c7c2ac';
  g.lineWidth = 5;
  g.beginPath(); g.arc(128, 128, 110, 0, Math.PI * 2); g.stroke();
  g.fillStyle = '#c7c2ac';
  g.font = 'bold 30px monospace';
  g.textAlign = 'center';
  g.fillText('KESTREL', 128, 105);
  g.font = 'bold 46px serif';
  g.fillText('1', 128, 158);
  g.font = 'bold 15px monospace';
  g.fillText('RANGE SAFETY', 128, 190);
  // lightning bolt
  g.beginPath();
  g.moveTo(128, 115); g.lineTo(112, 140); g.lineTo(128, 140); g.lineTo(120, 168); g.lineTo(146, 134); g.lineTo(130, 134); g.lineTo(140, 115); g.closePath();
  g.fillStyle = '#f0a23c'; g.globalAlpha = 0.7; g.fill(); g.globalAlpha = 1;
  return tex(c, 1);
}

export function nameTagTexture(text = 'KESTREL-1') {
  const [c, g] = canvas(256);
  g.fillStyle = '#34382d';
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#d6d0bb';
  g.font = 'bold 25px monospace';
  g.textAlign = 'center';
  g.fillText(text, 128, 110);
  g.fillStyle = '#f0a23c';
  g.fillRect(58, 130, 140, 3);
  g.fillStyle = '#a7b18d';
  g.font = '14px monospace';
  g.fillText('RANGE SAFETY', 128, 162);
  return tex(c, 1);
}

export function scopeLensTexture() {
  const [c, g] = canvas(256);
  const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, '#2a4d63');
  grad.addColorStop(0.55, '#162d3e');
  grad.addColorStop(0.9, '#0a1620');
  grad.addColorStop(1, '#050a0e');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(140,190,220,0.25)';
  g.lineWidth = 3;
  g.beginPath(); g.arc(128, 128, 118, 0, Math.PI * 2); g.stroke();
  return tex(c, 1);
}
