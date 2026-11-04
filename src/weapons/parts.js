import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  camoTexture, fabricTexture, woodTexture, laminateTexture,
  scopeLensTexture, reticleTexture,
} from '../lib/textures.js';

const T = {
  camo: camoTexture(17, undefined, 1.4),
  fabric: fabricTexture('#4b4d3d', 3, 5),
  wood: woodTexture(8),
  laminate: laminateTexture(12),
  lens: scopeLensTexture(),
  holo: reticleTexture('holo', '#ff321f'),
  dot: reticleTexture('dot', '#ff2a18'),
  scopeReticle: reticleTexture('mil', '#12140f'),
};

export const MAT = {
  gunmetal: new THREE.MeshStandardMaterial({ color: 0x24262a, metalness: 0.88, roughness: 0.34, envMapIntensity: 1.05 }),
  blackOxide: new THREE.MeshStandardMaterial({ color: 0x141619, metalness: 0.78, roughness: 0.46, envMapIntensity: 0.9 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: 0x373b3e, metalness: 0.92, roughness: 0.26, envMapIntensity: 1.2 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x9ba0a2, metalness: 0.96, roughness: 0.22, envMapIntensity: 1.35 }),
  stainless: new THREE.MeshStandardMaterial({ color: 0xb9b8ae, metalness: 1.0, roughness: 0.18, envMapIntensity: 1.4 }),
  polymer: new THREE.MeshStandardMaterial({ color: 0x181a1a, metalness: 0.08, roughness: 0.72, envMapIntensity: 0.7 }),
  polymerSoft: new THREE.MeshStandardMaterial({ color: 0x202322, metalness: 0.04, roughness: 0.88, envMapIntensity: 0.55 }),
  fde: new THREE.MeshStandardMaterial({ color: 0x7c6c50, metalness: 0.1, roughness: 0.78, envMapIntensity: 0.7 }),
  fdeDark: new THREE.MeshStandardMaterial({ color: 0x554b39, metalness: 0.12, roughness: 0.8, envMapIntensity: 0.7 }),
  olive: new THREE.MeshStandardMaterial({ color: 0x4a4f37, metalness: 0.06, roughness: 0.85, envMapIntensity: 0.6 }),
  coyote: new THREE.MeshStandardMaterial({ color: 0x6d6047, metalness: 0.05, roughness: 0.9, envMapIntensity: 0.55 }),
  tan: new THREE.MeshStandardMaterial({ color: 0xa08a64, metalness: 0.05, roughness: 0.86, envMapIntensity: 0.55 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x0d0e0e, metalness: 0.02, roughness: 0.96, envMapIntensity: 0.35 }),
  red: new THREE.MeshStandardMaterial({ color: 0xb63727, metalness: 0.35, roughness: 0.38, envMapIntensity: 0.9 }),
  redGlow: new THREE.MeshStandardMaterial({ color: 0x3a0905, emissive: 0xff2a12, emissiveIntensity: 2.4, roughness: 0.3, metalness: 0 }),
  amberGlow: new THREE.MeshStandardMaterial({ color: 0x3b2506, emissive: 0xffa22e, emissiveIntensity: 1.8, roughness: 0.3, metalness: 0 }),
  white: new THREE.MeshStandardMaterial({ color: 0xd8d5c8, metalness: 0.25, roughness: 0.5 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xd06a30, metalness: 0.3, roughness: 0.5 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xb98d43, metalness: 0.95, roughness: 0.28, envMapIntensity: 1.3 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x9fc2cf, metalness: 0.15, roughness: 0.04, transparent: true, opacity: 0.22, transmission: 0.65, thickness: 0.004, ior: 1.5, envMapIntensity: 1.5, side: THREE.DoubleSide }),
  glassDark: new THREE.MeshPhysicalMaterial({ color: 0x2d4e5f, metalness: 0.4, roughness: 0.06, transparent: true, opacity: 0.55, transmission: 0.4, thickness: 0.006, ior: 1.5, envMapIntensity: 1.7, side: THREE.DoubleSide }),
  lens: new THREE.MeshStandardMaterial({ map: T.lens, color: 0x8fb6c9, metalness: 0.65, roughness: 0.08, envMapIntensity: 1.8 }),
  reticleRed: new THREE.MeshBasicMaterial({ map: T.holo, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, opacity: 0.95 }),
  reticleDot: new THREE.MeshBasicMaterial({ map: T.dot, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, opacity: 0.95 }),
  scopeReticle: new THREE.MeshBasicMaterial({ map: T.scopeReticle, transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0.9 }),
  camo: new THREE.MeshStandardMaterial({ map: T.camo, color: 0xbfb9a6, metalness: 0.02, roughness: 0.94, envMapIntensity: 0.45 }),
  camoDark: new THREE.MeshStandardMaterial({ map: camoTexture(31, ['#494d3d', '#363a2e', '#5d5744', '#282b22', '#6c624b'], 1.4), color: 0xa9a493, metalness: 0.02, roughness: 0.95, envMapIntensity: 0.4 }),
  fabric: new THREE.MeshStandardMaterial({ map: T.fabric, color: 0xaead9e, metalness: 0.02, roughness: 0.97, envMapIntensity: 0.35 }),
  wood: new THREE.MeshStandardMaterial({ map: T.wood, color: 0xb08a68, metalness: 0.02, roughness: 0.62, envMapIntensity: 0.6 }),
  laminate: new THREE.MeshStandardMaterial({ map: T.laminate, color: 0xa5a194, metalness: 0.02, roughness: 0.64, envMapIntensity: 0.55 }),
  glove: new THREE.MeshStandardMaterial({ color: 0x695e49, metalness: 0.03, roughness: 0.92, envMapIntensity: 0.4 }),
  gloveDark: new THREE.MeshStandardMaterial({ color: 0x2e2f28, metalness: 0.04, roughness: 0.93, envMapIntensity: 0.4 }),
};

export function rb(w, h, d, r, mat, seg = 3) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, Math.min(r, Math.min(w, h, d) * 0.48)), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function box(w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function cyl(r, len, mat, seg = 20, axis = 'z', r2 = null) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r2 ?? r, r, len, seg), mat);
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  else if (axis === 'x') m.rotation.z = Math.PI / 2;
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function torus(radius, tube, mat, radial = 10, tubular = 24) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radial, tubular), mat);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function pos(obj, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  obj.position.set(x, y, z);
  obj.rotation.set(rx, ry, rz);
  return obj;
}

export function add(parent, obj, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  pos(obj, x, y, z, rx, ry, rz);
  parent.add(obj);
  return obj;
}

export function screw(parent, x, y, z, r = 0.0035, mat = MAT.darkSteel, axis = 'x') {
  const m = cyl(r, 0.003, mat, 8, axis);
  add(parent, m, x, y, z);
  return m;
}

export function picatinny(parent, y, zStart, zEnd, mat = MAT.gunmetal, width = 0.022) {
  const len = Math.abs(zEnd - zStart);
  const zc = (zStart + zEnd) / 2;
  add(parent, box(width, 0.006, len, mat), 0, y, zc);
  const teeth = Math.floor(len / 0.0105);
  const geo = new THREE.BoxGeometry(width * 0.92, 0.0034, 0.0054);
  const inst = new THREE.InstancedMesh(geo, mat, teeth);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < teeth; i++) {
    dummy.position.set(0, y + 0.0045, zStart - Math.sign(zStart - zEnd) * (0.008 + i * 0.0105));
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }
  inst.castShadow = true; inst.receiveShadow = true;
  parent.add(inst);
  return inst;
}

export function mlok(parent, x, y, z, side = 1, n = 3, spacing = 0.055, mat = MAT.rubber) {
  for (let i = 0; i < n; i++) {
    const m = rb(0.004, 0.008, 0.03, 0.001, mat, 1);
    add(parent, m, x + side * 0.001, y, z + (i - (n - 1) / 2) * spacing);
  }
}

export function knurl(parent, r, z, count, width, mat = MAT.darkSteel, axis = 'z') {
  for (let i = 0; i < count; i++) {
    const t = torus(r + 0.0007, 0.0011, mat, 4, 18);
    if (axis === 'z') t.rotation.x = 0; else t.rotation.y = Math.PI / 2;
    add(parent, t, 0, 0, z + (i - (count - 1) / 2) * width);
  }
}

export function textLabel(text, opts = {}) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  if (opts.bg) { g.fillStyle = opts.bg; g.fillRect(0, 0, 512, 128); }
  else g.clearRect(0, 0, 512, 128);
  g.fillStyle = opts.color || '#d6d2c2';
  g.font = `${opts.weight || 'bold'} ${opts.size || 52}px ${opts.font || 'monospace'}`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 256, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: opts.opacity ?? 0.9 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(opts.w || 0.05, opts.h || 0.0125), mat);
  return m;
}

export function glowSprite(color = 0xffa030, size = 0.12, opacity = 0.8) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.25, `rgba(${(color >> 16) & 255},${(color >> 8) & 255},${color & 255},0.75)`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity }));
  m.scale.setScalar(size);
  return m;
}

export function curvedMagazine(width = 0.033, height = 0.16, depth = 0.062, mat = MAT.polymer) {
  const g = new THREE.Group();
  const segs = 3;
  let curX = 0, curY = 0, curAng = 0;
  for (let i = 0; i < segs; i++) {
    const segH = height / segs;
    curAng += 0.15;
    const seg = rb(width, segH * 1.15, depth, 0.006, mat, 2);
    seg.position.set(0, -segH * (i + 0.5) * 0.94, -Math.sin(curAng) * segH * i * 0.8);
    seg.rotation.x = -curAng * 0.8;
    g.add(seg);
    curY -= segH;
  }
  // ribs
  for (let i = 0; i < 4; i++) {
    const rib = rb(width + 0.002, 0.006, depth * 0.9, 0.002, MAT.blackOxide, 1);
    rib.position.set(0, -0.02 - i * 0.042, 0);
    g.add(rib);
  }
  const base = rb(width + 0.008, 0.012, depth + 0.01, 0.003, MAT.polymerSoft, 2);
  base.position.set(0, -height + 0.002, -0.008);
  g.add(base);
  return g;
}

export function bulletTip(parent, x, y, z, scale = 1, axis = 'z') {
  const b = cyl(0.004 * scale, 0.018 * scale, MAT.brass, 10, axis, 0.0012 * scale);
  add(parent, b, x, y, z);
  return b;
}

export function triggerGuard(parent, mat = MAT.gunmetal) {
  // flattened torus segment approximated with a thin rounded box loop
  const g = new THREE.Group();
  add(g, rb(0.045, 0.006, 0.008, 0.002, mat, 1), 0, -0.042, 0.0);
  add(g, rb(0.006, 0.036, 0.008, 0.002, mat, 1), -0.0195, -0.024, 0.0);
  add(g, rb(0.006, 0.030, 0.008, 0.002, mat, 1), 0.0195, -0.027, 0.0);
  parent.add(g);
  return g;
}

export function safetyLever(parent, x = 0.031, y = -0.005, z = 0.02, mat = MAT.gunmetal) {
  add(parent, rb(0.004, 0.018, 0.03, 0.002, mat, 1), x, y, z);
  add(parent, cyl(0.006, 0.004, mat, 12, 'x'), x + 0.003, y, z);
}

export function qdSlingPoint(parent, x, y, z, mat = MAT.darkSteel) {
  const t = torus(0.008, 0.0022, mat, 6, 14);
  t.rotation.y = Math.PI / 2;
  add(parent, t, x, y, z);
}

export function createMount(parent, y, z, height = 0.024, width = 0.026, mat = MAT.gunmetal) {
  add(parent, rb(width, height, 0.03, 0.003, mat, 2), 0, y + height / 2, z);
  for (const s of [-1, 1]) {
    add(parent, cyl(0.003, 0.004, MAT.darkSteel, 6, 'x'), s * (width / 2 + 0.001), y + height * 0.6, z);
  }
}

export function lensDisc(radius, mat = MAT.lens) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(radius, 28), mat);
  m.rotation.y = Math.PI;
  return m;
}

export function tacticalGloveHand(side = 'right', scale = 1, mat = MAT.glove) {
  const g = new THREE.Group();
  const palm = rb(0.052, 0.072, 0.07, 0.015, mat, 3);
  g.add(palm);
  // knuckle pads
  for (let i = 0; i < 4; i++) {
    const k = rb(0.011, 0.012, 0.018, 0.004, MAT.gloveDark, 2);
    k.position.set(-0.019 + i * 0.0125, 0.035, -0.031);
    g.add(k);
  }
  // fingers curling around the front
  for (let i = 0; i < 4; i++) {
    const x = -0.019 + i * 0.0125;
    const f1 = rb(0.0105, 0.034, 0.012, 0.0045, mat, 2);
    f1.position.set(x, 0.006, -0.040);
    f1.rotation.x = 0.2;
    g.add(f1);
    const f2 = rb(0.0098, 0.009, 0.025, 0.004, mat, 2);
    f2.position.set(x, -0.018, -0.027);
    f2.rotation.x = -0.85;
    g.add(f2);
  }
  // thumb
  const th = rb(0.013, 0.048, 0.016, 0.006, mat, 2);
  th.position.set(side === 'right' ? 0.031 : -0.031, 0.008, -0.012);
  th.rotation.z = side === 'right' ? -0.55 : 0.55;
  th.rotation.x = -0.15;
  g.add(th);
  // wrist cuff
  const cuff = cyl(0.025, 0.03, MAT.gloveDark, 12, 'z');
  cuff.position.set(0, -0.02, 0.045);
  g.add(cuff);
  g.scale.setScalar(scale);
  return g;
}

export function forearm(side, from, to, radius = 0.028) {
  const g = new THREE.Group();
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const dir = b.clone().sub(a);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius * 0.78, radius, len, 12, 1);
  const m = new THREE.Mesh(geo, MAT.camo);
  m.castShadow = true;
  m.position.copy(a.clone().add(b).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  g.add(m);
  // cuff at wrist
  const cuff = cyl(radius * 0.86, 0.035, MAT.gloveDark, 12, 'z');
  const cuffDir = dir.clone().normalize();
  cuff.position.copy(a).add(cuffDir.clone().multiplyScalar(0.018));
  cuff.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), cuffDir);
  g.add(cuff);
  // sleeve wrinkle bands
  for (let i = 0; i < 3; i++) {
    const band = torus(radius * 0.92, 0.0015, MAT.camoDark, 4, 12);
    band.quaternion.copy(m.quaternion);
    band.position.copy(a).lerp(b, 0.3 + i * 0.16);
    band.rotateX(Math.PI / 2);
    g.add(band);
  }
  return g;
}
