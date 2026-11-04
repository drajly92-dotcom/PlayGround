import * as THREE from 'three';
import { MAT, rb, box, cyl, torus, add, pos, textLabel, glowSprite } from './weapons/parts.js';
import { buildWeaponModel } from './weapons/builders.js';
import { patchTexture, nameTagTexture } from './lib/textures.js';
import { tacticalGloveHand } from './weapons/parts.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

const GEAR = [
  { key: 'uniform', label: 'Camouflage Combat Uniform', sub: 'Multi-environment pattern · ripstop' },
  { key: 'carrier', label: 'Level III+ Plate Carrier', sub: 'Ceramic plates · cummerbund · drag handle' },
  { key: 'magpouches', label: 'Magazine Pouches ×3', sub: 'Front-mounted · bungee retention' },
  { key: 'helmet', label: 'Ballistic Helmet', sub: 'MICH cut · rails · NVG shroud' },
  { key: 'camera', label: 'Helmet-Mounted Camera', sub: '4K · right-side rail · live feed' },
  { key: 'gloves', label: 'Tactical Gloves', sub: 'FR · cut level 5 · knuckle protection' },
  { key: 'kneepads', label: 'Hard-Shell Knee Pads', sub: 'Impact shell · adjustable straps' },
  { key: 'boots', label: 'Combat Boots', sub: '8 in · composite toe · lug sole' },
  { key: 'eyepro', label: 'Eye Pro / Balaclava', sub: 'ANSI Z87 · flame-resistant face cover' },
];

function limb(parent, a, b, r1, r2, mat = MAT.camo, seg = 12) {
  const va = V(...a), vb = V(...b);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(r2, r1, len, seg, 2);
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(va).add(vb).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize());
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}

function joint(parent, p, r, mat = MAT.camo) {
  const s = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat);
  s.position.set(...p);
  s.castShadow = true; s.receiveShadow = true;
  parent.add(s);
  return s;
}

function patchMesh(size = 0.055) {
  const mat = new THREE.MeshStandardMaterial({ map: patchTexture(), roughness: 0.9, metalness: 0.02 });
  const m = new THREE.Mesh(new THREE.CircleGeometry(size, 24), mat);
  m.castShadow = false;
  return m;
}

function plateCarrier(parent) {
  const g = new THREE.Group();
  const coyote = MAT.coyote;
  // front and back plates
  const front = rb(0.345, 0.355, 0.075, 0.035, coyote, 4);
  add(g, front, 0, 1.255, -0.135);
  const back = rb(0.335, 0.350, 0.065, 0.032, coyote, 4);
  add(g, back, 0, 1.255, 0.135);
  // cummerbund sides
  add(g, rb(0.075, 0.195, 0.245, 0.022, coyote, 3), -0.185, 1.215, 0);
  add(g, rb(0.075, 0.195, 0.245, 0.022, coyote, 3), 0.185, 1.215, 0);
  // shoulder straps
  for (const s of [-1, 1]) {
    add(g, rb(0.075, 0.035, 0.115, 0.012, coyote, 3), s * 0.125, 1.425, -0.110, 0, 0, s * -0.18);
    add(g, rb(0.078, 0.30, 0.030, 0.012, coyote, 2), s * 0.130, 1.300, 0.112, 0.10, 0, s * 0.05);
    // shoulder buckle
    add(g, box(0.040, 0.030, 0.018, MAT.blackOxide), s * 0.125, 1.385, -0.165);
    add(g, box(0.034, 0.010, 0.010, MAT.darkSteel), s * 0.125, 1.395, -0.172);
  }
  // plate seams
  add(g, rb(0.300, 0.006, 0.004, 0.001, MAT.fdeDark, 1), 0, 1.405, -0.177);
  add(g, rb(0.300, 0.006, 0.004, 0.001, MAT.fdeDark, 1), 0, 1.105, -0.177);
  // MOLLE webbing rows
  for (let r = 0; r < 4; r++) {
    add(g, rb(0.295, 0.012, 0.010, 0.002, MAT.fdeDark, 1), 0, 1.328 - r * 0.037, -0.176);
    for (let c = 0; c < 8; c++) {
      add(g, box(0.008, 0.020, 0.006, MAT.fdeDark), -0.130 + c * 0.037, 1.318 - r * 0.037, -0.179);
    }
  }
  // magazine pouches (3)
  for (let i = 0; i < 3; i++) {
    const x = -0.095 + i * 0.095;
    add(g, rb(0.085, 0.120, 0.055, 0.010, coyote, 3), x, 1.205, -0.195);
    add(g, rb(0.088, 0.038, 0.060, 0.009, MAT.fdeDark, 2), x, 1.262, -0.197);
    add(g, box(0.070, 0.006, 0.006, MAT.fdeDark), x, 1.240, -0.225);
    // snap flap
    add(g, cyl(0.008, 0.008, MAT.darkSteel, 10, 'z'), x, 1.230, -0.226);
    // mag base sticking out
    add(g, rb(0.068, 0.020, 0.040, 0.004, MAT.polymer, 2), x, 1.148, -0.200);
  }
  // admin pouch
  add(g, rb(0.130, 0.070, 0.035, 0.008, coyote, 3), -0.075, 1.355, -0.188);
  add(g, rb(0.132, 0.020, 0.038, 0.005, MAT.fdeDark, 2), -0.075, 1.383, -0.190);
  // radio pouch / antenna (left)
  add(g, rb(0.070, 0.150, 0.050, 0.010, coyote, 3), -0.168, 1.300, -0.155);
  add(g, rb(0.052, 0.100, 0.040, 0.008, MAT.olive, 2), -0.168, 1.305, -0.182);
  add(g, cyl(0.006, 0.130, MAT.blackOxide, 8, 'y'), -0.168, 1.410, -0.182);
  add(g, cyl(0.003, 0.040, MAT.darkSteel, 8, 'y'), -0.168, 1.495, -0.182);
  // IFAK pouch (right)
  add(g, rb(0.090, 0.100, 0.055, 0.010, coyote, 3), 0.160, 1.160, -0.155);
  add(g, box(0.060, 0.008, 0.010, MAT.red), 0.160, 1.190, -0.186);
  // tourniquet
  add(g, torus(0.022, 0.007, MAT.red, 6, 14), 0.090, 1.375, -0.195, 0.3, 0, 0);
  // carabiner
  add(g, torus(0.015, 0.003, MAT.darkSteel, 6, 12), 0.190, 1.115, -0.130, 0, Math.PI / 2, 0);
  // drag handle
  add(g, rb(0.110, 0.030, 0.018, 0.006, MAT.fdeDark, 2), 0, 1.445, 0.170);
  // name tape
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.048), new THREE.MeshStandardMaterial({ map: nameTagTexture('KESTREL 1'), roughness: 0.9 }));
  add(tag, 0, 0, 0, 0, Math.PI, 0);
  tag.position.set(0.005, 1.395, -0.188);
  g.add(tag);
  // shoulder patches
  const p1 = patchMesh(0.050);
  p1.position.set(-0.202, 1.355, -0.055); p1.rotation.y = -Math.PI / 2 - 0.25;
  g.add(p1);
  const p2 = patchMesh(0.050);
  p2.position.set(0.202, 1.355, -0.055); p2.rotation.y = Math.PI / 2 + 0.25;
  g.add(p2);
  // small IR patch
  const ir = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.028), new THREE.MeshStandardMaterial({ color: 0x4d5344, roughness: 0.8 }));
  ir.position.set(-0.178, 1.330, -0.176); ir.rotation.y = 0;
  g.add(ir);
  parent.add(g);
  return g;
}

function helmet(parent) {
  const head = new THREE.Group();
  // neck / balaclava head
  add(head, cyl(0.055, 0.09, MAT.camoDark, 14), 0, 1.545, 0.005);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.108, 22, 18), MAT.gloveDark);
  skull.scale.set(0.92, 1.06, 1.0);
  skull.position.set(0, 1.655, 0.000);
  skull.castShadow = true;
  head.add(skull);
  // face lower mask
  add(head, rb(0.115, 0.075, 0.055, 0.025, MAT.camoDark, 3), 0, 1.590, -0.070);
  // eye protection
  add(head, rb(0.150, 0.038, 0.030, 0.010, MAT.blackOxide, 3), 0, 1.665, -0.095);
  const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.135, 0.026), new THREE.MeshStandardMaterial({ color: 0x8b7440, metalness: 0.6, roughness: 0.15, transparent: true, opacity: 0.75 }));
  lens.position.set(0, 1.665, -0.111);
  lens.rotation.y = Math.PI;
  head.add(lens);
  // helmet shell
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.129, 26, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), MAT.olive);
  shell.scale.set(1.02, 0.96, 1.08);
  shell.position.set(0, 1.675, 0.005);
  shell.castShadow = true;
  head.add(shell);
  // rim
  add(head, torus(0.126, 0.009, MAT.fdeDark, 6, 28), 0, 1.688, 0.005, Math.PI / 2, 0, 0);
  add(head, rb(0.220, 0.022, 0.035, 0.008, MAT.fdeDark, 2), 0, 1.690, -0.100, -0.08);
  // helmet cover straps
  for (const s of [-1, 1]) {
    add(head, box(0.012, 0.006, 0.17, MAT.fdeDark), s * 0.055, 1.773, 0.010);
    add(head, box(0.010, 0.080, 0.012, MAT.fdeDark), s * 0.120, 1.700, 0.010);
  }
  // side rails
  for (const s of [-1, 1]) {
    add(head, rb(0.018, 0.030, 0.160, 0.005, MAT.blackOxide, 2), s * 0.126, 1.700, 0.010);
    add(head, box(0.012, 0.014, 0.056, MAT.darkSteel), s * 0.138, 1.700, -0.020);
  }
  // NVG shroud at front
  add(head, rb(0.052, 0.040, 0.034, 0.008, MAT.darkSteel, 2), 0, 1.735, -0.125);
  add(head, cyl(0.011, 0.018, MAT.gunmetal, 12, 'z'), 0, 1.735, -0.146);
  add(head, box(0.024, 0.010, 0.010, MAT.blackOxide), 0, 1.752, -0.127);
  // helmet camera (right rail)
  const cam = new THREE.Group();
  add(cam, rb(0.030, 0.030, 0.050, 0.006, MAT.polymer, 2), 0, 0, 0);
  add(cam, cyl(0.012, 0.018, MAT.gunmetal, 14, 'z'), 0, 0, -0.032);
  add(cam, cyl(0.0085, 0.006, MAT.glassDark, 12, 'z'), 0, 0, -0.042);
  add(cam, box(0.020, 0.005, 0.020, MAT.darkSteel), 0, 0.018, 0.008);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.0025, 8, 6), MAT.redGlow);
  led.position.set(0.010, 0.011, -0.030);
  cam.add(led);
  add(cam, cyl(0.002, 0.042, MAT.blackOxide, 6, 'y'), 0.012, 0.035, 0.020);
  add(head, cam, 0.132, 1.720, -0.045, 0, -0.15, 0);
  // headset ear cups
  for (const s of [-1, 1]) {
    const cup = cyl(0.036, 0.030, MAT.blackOxide, 16, 'x');
    add(head, cup, s * 0.115, 1.625, 0.005);
    add(head, torus(0.027, 0.008, MAT.rubber, 6, 18), s * 0.131, 1.625, 0.005, 0, Math.PI / 2, 0);
  }
  // boom mic
  const micCurve = new THREE.CatmullRomCurve3([V(0.118, 1.612, -0.020), V(0.095, 1.585, -0.070), V(0.060, 1.575, -0.085)]);
  const mic = new THREE.Mesh(new THREE.TubeGeometry(micCurve, 12, 0.0035, 6, false), MAT.blackOxide);
  head.add(mic);
  add(head, cyl(0.008, 0.012, MAT.rubber, 8), 0.058, 1.575, -0.086);
  // helmet band + counterweight pouch
  add(head, torus(0.125, 0.006, MAT.fdeDark, 4, 24), 0, 1.702, 0.010, Math.PI / 2, 0, 0);
  add(head, rb(0.085, 0.055, 0.040, 0.010, MAT.coyote, 3), 0, 1.710, 0.130);
  parent.add(head);
  return { group: head, camera: cam, led, shell };
}

function kneePads(parent) {
  for (const s of [-1, 1]) {
    const pad = new THREE.Group();
    add(pad, rb(0.125, 0.140, 0.055, 0.030, MAT.coyote, 4), 0, 0, 0);
    add(pad, rb(0.100, 0.100, 0.018, 0.024, MAT.fde, 4), 0, 0.005, -0.035);
    for (let i = 0; i < 3; i++) add(pad, box(0.082, 0.005, 0.010, MAT.fdeDark), 0, -0.025 + i * 0.024, -0.045);
    // rivet
    add(pad, cyl(0.005, 0.004, MAT.darkSteel, 8, 'z'), 0, 0.045, -0.046);
    add(pad, box(0.135, 0.016, 0.064, MAT.fdeDark), 0, 0.060, 0.004);
    add(pad, box(0.135, 0.016, 0.064, MAT.fdeDark), 0, -0.060, 0.004);
    add(parent, pad, s * 0.105, 0.505, -0.092, -0.06, 0, 0);
  }
}

function boots(parent) {
  for (const s of [-1, 1]) {
    const boot = new THREE.Group();
    add(boot, rb(0.105, 0.115, 0.150, 0.024, MAT.blackOxide, 4), 0, 0.155, 0.002);
    add(boot, rb(0.110, 0.035, 0.275, 0.012, MAT.rubber, 4), 0, 0.035, -0.045);
    add(boot, rb(0.100, 0.075, 0.110, 0.028, MAT.blackOxide, 3), 0, 0.080, -0.135);
    add(boot, rb(0.110, 0.060, 0.290, 0.020, MAT.gunmetal, 3), 0, 0.050, -0.045);
    // laces
    for (let i = 0; i < 4; i++) add(boot, box(0.080, 0.003, 0.006, MAT.camoDark), 0, 0.140 + i * 0.024, -0.145 + i * 0.008);
    add(boot, box(0.012, 0.075, 0.010, MAT.rubber), 0, 0.120, -0.105);
    add(parent, boot, s * 0.105, 0.0, 0.005);
  }
}

function patrolCapHead() {}

export function createOperator(opts = {}) {
  const root = new THREE.Group();
  const gear = {};

  // ---------- legs ----------
  const legs = new THREE.Group();
  for (const s of [-1, 1]) {
    // thigh
    limb(legs, [s * 0.105, 0.910, 0.005], [s * 0.108, 0.535, -0.005], 0.092, 0.078, MAT.camo);
    // shin
    limb(legs, [s * 0.108, 0.535, -0.005], [s * 0.105, 0.155, 0.005], 0.070, 0.058, MAT.camo);
    joint(legs, [s * 0.105, 0.910, 0.005], 0.094, MAT.camo);
    joint(legs, [s * 0.108, 0.535, -0.005], 0.078, MAT.camo);
    // cargo pocket
    add(legs, rb(0.080, 0.120, 0.045, 0.014, MAT.camo, 3), s * 0.170, 0.720, -0.010, 0, 0, s * 0.06);
    add(legs, box(0.080, 0.012, 0.048, MAT.camoDark), s * 0.172, 0.770, -0.014, 0, 0, s * 0.06);
    // knee pad straps
    add(legs, box(0.150, 0.020, 0.170, MAT.fdeDark), s * 0.105, 0.520, -0.020);
  }
  root.add(legs); gear.legs = legs;

  kneePads(root); gear.kneepads = [];
  root.children.filter(o => o.type === 'Group').slice(-2).forEach(k => gear.kneepads.push(k));

  boots(root); gear.boots = root.children.slice(-2);

  // pelvis / belt
  const pelvis = new THREE.Group();
  add(pelvis, rb(0.300, 0.160, 0.210, 0.050, MAT.camo, 4), 0, 0.985, 0.005);
  add(pelvis, rb(0.320, 0.040, 0.230, 0.014, MAT.fdeDark, 3), 0, 1.040, 0.005);
  // belt pouches
  add(pelvis, rb(0.070, 0.085, 0.045, 0.010, MAT.coyote, 3), -0.155, 1.010, -0.120);
  add(pelvis, rb(0.070, 0.085, 0.045, 0.010, MAT.coyote, 3), 0.155, 1.010, -0.120);
  add(pelvis, rb(0.100, 0.070, 0.040, 0.010, MAT.coyote, 3), 0.0, 1.000, 0.120);
  add(pelvis, box(0.050, 0.030, 0.012, MAT.darkSteel), 0.0, 1.035, -0.112);
  // thigh holster (right)
  add(pelvis, rb(0.070, 0.160, 0.055, 0.012, MAT.blackOxide, 3), 0.205, 0.815, -0.040, 0, 0, 0.06);
  add(pelvis, rb(0.055, 0.060, 0.040, 0.008, MAT.coyote, 2), 0.216, 0.900, -0.030);
  root.add(pelvis); gear.belt = pelvis;

  // ---------- torso ----------
  const torso = new THREE.Group();
  add(torso, rb(0.345, 0.255, 0.205, 0.050, MAT.camo, 4), 0, 1.155, 0.005);
  add(torso, rb(0.390, 0.290, 0.225, 0.060, MAT.camo, 4), 0, 1.330, 0.000);
  add(torso, rb(0.320, 0.110, 0.200, 0.035, MAT.camo, 3), 0, 1.470, 0.015);
  // chest seam / zip
  add(torso, box(0.008, 0.230, 0.006, MAT.camoDark), 0.005, 1.300, -0.117);
  // neck gaiter
  add(torso, cyl(0.070, 0.085, MAT.camoDark, 16), 0, 1.525, 0.005);
  // shoulder pads
  for (const s of [-1, 1]) {
    add(torso, rb(0.120, 0.075, 0.155, 0.024, MAT.camo, 3), s * 0.205, 1.420, 0.000, 0, 0, s * 0.15);
    add(torso, box(0.095, 0.012, 0.100, MAT.camoDark), s * 0.205, 1.462, 0.000, 0, 0, s * 0.15);
  }
  root.add(torso); gear.torso = torso;

  const carrier = plateCarrier(root); gear.carrier = carrier;

  // head / helmet
  const h = helmet(root); gear.helmet = h.shell; gear.head = h.group; gear.camera = h.camera;
  gear.eyepro = h.group;

  // ---------- weapon at low ready ----------
  const weaponMeta = buildWeaponModel('ww15');
  const weapon = weaponMeta.group;
  weapon.position.set(0.115, 1.055, -0.215);
  weapon.rotation.set(-0.30, 0.20, 0.03);
  root.add(weapon);
  root.updateMatrixWorld(true);

  // hands follow the weapon anchors
  const hands = new THREE.Group();
  const rh = tacticalGloveHand('right', 1.0, MAT.glove);
  rh.position.set(...weaponMeta.hands.right.pos);
  rh.rotation.set(...weaponMeta.hands.right.rot);
  weapon.add(rh);
  const lh = tacticalGloveHand('left', 0.97, MAT.glove);
  lh.position.set(...weaponMeta.hands.left.pos);
  lh.rotation.set(...weaponMeta.hands.left.rot);
  weapon.add(lh);
  root.updateMatrixWorld(true);

  const handR = rh.getWorldPosition(new THREE.Vector3());
  const handL = lh.getWorldPosition(new THREE.Vector3());

  // sleeves + elbow pads, connecting shoulders to hands
  const shoulderR = V(0.205, 1.405, -0.010);
  const shoulderL = V(-0.205, 1.405, -0.010);
  const elbowR = V(0.300, 1.170, -0.115);
  const elbowL = V(-0.235, 1.155, -0.255);

  const arms = new THREE.Group();
  limb(arms, shoulderR.toArray(), elbowR.toArray(), 0.075, 0.062, MAT.camo);
  limb(arms, elbowR.toArray(), handR.toArray(), 0.060, 0.044, MAT.camo);
  limb(arms, shoulderL.toArray(), elbowL.toArray(), 0.073, 0.060, MAT.camo);
  limb(arms, elbowL.toArray(), handL.toArray(), 0.058, 0.042, MAT.camo);
  joint(arms, elbowR.toArray(), 0.061, MAT.camo);
  joint(arms, elbowL.toArray(), 0.060, MAT.camo);
  // elbow pads
  for (const e of [elbowR, elbowL]) {
    add(arms, rb(0.095, 0.100, 0.045, 0.020, MAT.coyote, 3), e.x, e.y, e.z - 0.020, 0, 0, e.x > 0 ? -0.25 : 0.25);
    add(arms, box(0.080, 0.012, 0.060, MAT.fdeDark), e.x, e.y + 0.045, e.z - 0.010);
  }
  // cuff rings
  for (const p of [handR, handL]) {
    add(arms, torus(0.042, 0.006, MAT.gloveDark, 5, 14), p.x, p.y + 0.030, p.z + 0.010, Math.PI / 2, 0, 0);
  }
  root.add(arms);
  gear.arms = arms;
  gear.gloves = [rh, lh];

  // sling
  const slingCurve = new THREE.CatmullRomCurve3([
    V(0.135, 1.420, 0.105), V(0.30, 1.25, -0.02), V(0.18, 1.03, -0.30), V(-0.02, 0.98, -0.46),
  ]);
  const sling = new THREE.Mesh(new THREE.TubeGeometry(slingCurve, 24, 0.012, 5, false), MAT.coyote);
  sling.castShadow = true;
  root.add(sling);

  // ---------- overall finish ----------
  root.traverse(o => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });
  root.userData.gear = gear;
  root.userData.weapon = weaponMeta;
  root.userData.hands = { rh, lh, weapon };
  return { group: root, gear, weapon, meta: weaponMeta };
}

export { GEAR };
