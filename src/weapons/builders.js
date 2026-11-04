import * as THREE from 'three';
import {
  MAT, rb, box, cyl, torus, add, pos, screw, picatinny, mlok, knurl,
  textLabel, glowSprite, curvedMagazine, triggerGuard, safetyLever, qdSlingPoint,
  createMount, lensDisc,
} from './parts.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

function newWeapon() {
  const group = new THREE.Group();
  group.name = 'weapon';
  return group;
}

function ironSights(g, rearZ = 0.06, frontZ = -0.41, y = 0.086, rearY = null) {
  const irons = new THREE.Group();
  // flip-up rear aperture
  const rear = new THREE.Group();
  add(rear, rb(0.026, 0.008, 0.022, 0.002, MAT.gunmetal, 2), 0, 0, 0);
  const ring = torus(0.0085, 0.0018, MAT.gunmetal, 6, 16);
  ring.rotation.y = Math.PI / 2;
  add(rear, ring, 0, 0.016, 0);
  add(rear, box(0.003, 0.025, 0.003, MAT.gunmetal), -0.012, 0.012, 0);
  add(rear, box(0.003, 0.025, 0.003, MAT.gunmetal), 0.012, 0.012, 0);
  add(irons, rear, 0, rearY ?? y + 0.018, rearZ);
  // front post
  const front = new THREE.Group();
  add(front, rb(0.024, 0.008, 0.024, 0.002, MAT.gunmetal, 2), 0, 0, 0);
  add(front, box(0.003, 0.028, 0.004, MAT.gunmetal), 0, 0.016, 0);
  add(front, box(0.014, 0.003, 0.004, MAT.gunmetal), 0, 0.029, 0);
  add(irons, front, 0, y + 0.017, frontZ);
  g.add(irons);
  return irons;
}

function buildAr15Base(g, opts = {}) {
  const fde = opts.fde;
  const receiverMat = fde ? MAT.fdeDark : MAT.gunmetal;
  const handguardMat = fde ? MAT.fde : MAT.gunmetal;

  // ---- lower receiver ----
  add(g, rb(0.043, 0.072, 0.20, 0.006, receiverMat, 4), 0, -0.004, -0.005);
  // magwell flare
  add(g, rb(0.050, 0.075, 0.088, 0.004, receiverMat, 3), 0, -0.068, -0.042);
  // trigger pocket / guard
  const guard = triggerGuard(g, receiverMat);
  guard.position.set(0, -0.018, 0.016);
  // pistol grip
  const grip = rb(0.038, 0.108, 0.056, 0.013, MAT.polymer, 3);
  add(g, grip, 0, -0.092, 0.079, -0.30);
  add(g, rb(0.041, 0.016, 0.058, 0.005, MAT.polymerSoft, 2), 0, -0.145, 0.096, -0.30);
  // grip texture
  for (let i = 0; i < 5; i++) add(g, rb(0.039, 0.004, 0.052, 0.001, MAT.blackOxide, 1), 0, -0.065 - i * 0.016, 0.071 + i * 0.005, -0.30);

  // ---- upper receiver ----
  add(g, rb(0.045, 0.060, 0.265, 0.006, receiverMat, 4), 0, 0.048, -0.058);
  // brass deflector
  const defl = cyl(0.013, 0.02, receiverMat, 10, 'x');
  add(g, defl, 0.025, 0.040, 0.018);
  // ejection port
  add(g, rb(0.004, 0.026, 0.062, 0.002, MAT.blackOxide, 2), 0.0225, 0.050, -0.048);
  add(g, box(0.002, 0.004, 0.058, MAT.darkSteel), 0.0245, 0.065, -0.048);
  // forward assist
  add(g, cyl(0.010, 0.022, MAT.darkSteel, 14, 'x'), 0.030, 0.042, -0.010);
  add(g, cyl(0.006, 0.006, MAT.gunmetal, 12, 'x'), 0.042, 0.042, -0.010);
  // charging handle
  add(g, box(0.035, 0.010, 0.026, MAT.gunmetal), 0, 0.076, 0.068);
  add(g, box(0.055, 0.005, 0.008, MAT.gunmetal), 0, 0.076, 0.080);
  // dust cover
  add(g, rb(0.003, 0.030, 0.066, 0.001, MAT.darkSteel, 1), 0.0242, 0.049, -0.049, 0, 0, 0.1);
  // bolt catch / mag release / safety
  add(g, rb(0.007, 0.016, 0.030, 0.002, MAT.darkSteel, 1), 0.032, -0.003, -0.010);
  add(g, cyl(0.007, 0.008, MAT.darkSteel, 12, 'x'), 0.032, -0.030, 0.030);
  safetyLever(g, 0.030, -0.003, 0.045);

  // ---- top rail ----
  picatinny(g, 0.083, 0.072, -0.205, MAT.gunmetal, 0.022);

  // ---- handguard ----
  const hgStart = -0.195, hgEnd = -0.435;
  const hg = cyl(0.036, hgEnd - hgStart, handguardMat, 10);
  add(g, hg, 0, 0.048, (hgStart + hgEnd) / 2);
  // barrel nut / delta ring
  add(g, cyl(0.040, 0.032, MAT.darkSteel, 16), 0, 0.048, hgStart + 0.006);
  add(g, cyl(0.038, 0.012, receiverMat, 14), 0, 0.048, hgStart - 0.010);
  // top rail continuation
  picatinny(g, 0.083, hgStart + 0.005, hgEnd + 0.008, handguardMat, 0.022);
  // mlok slots on sides and bottom
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const z = -0.25 - i * 0.058;
      add(g, rb(0.004, 0.014, 0.038, 0.002, MAT.blackOxide, 1), side * 0.0345, 0.048, z);
      add(g, rb(0.002, 0.010, 0.030, 0.001, MAT.rubber, 1), side * 0.0370, 0.048, z);
    }
  }
  for (let i = 0; i < 3; i++) {
    const z = -0.245 - i * 0.058;
    add(g, rb(0.024, 0.003, 0.034, 0.001, MAT.blackOxide, 1), 0, 0.015, z);
  }
  // handguard end cap
  add(g, cyl(0.034, 0.010, MAT.darkSteel, 12), 0, 0.048, hgEnd + 0.002);

  // ---- barrel ----
  const barrelLen = opts.barrel || 0.17;
  add(g, cyl(0.0115, barrelLen, MAT.darkSteel, 16), 0, 0.048, hgEnd - barrelLen / 2 + 0.004);
  add(g, cyl(0.014, 0.030, MAT.darkSteel, 16), 0, 0.048, hgEnd - 0.020);
  // low profile gas block + gas tube
  add(g, box(0.030, 0.038, 0.030, MAT.darkSteel), 0, 0.040, hgEnd + 0.034);
  add(g, cyl(0.0045, 0.16, MAT.darkSteel, 8), 0, 0.064, hgEnd + 0.10);

  // ---- buffer tube ----
  add(g, cyl(0.0165, 0.19, MAT.gunmetal, 14), 0, 0.046, 0.170);
  add(g, torus(0.019, 0.003, MAT.darkSteel, 6, 18), 0, 0.046, 0.075);
  // castle nut
  knurl(g, 0.019, 0.083, 3, 0.005, MAT.darkSteel);
  // rear sling point
  add(g, rb(0.010, 0.020, 0.014, 0.002, MAT.darkSteel, 1), 0.026, 0.030, 0.074);
  screw(g, 0.026, 0.030, 0.074, 0.0038);

  // ---- magazine ----
  const mag = curvedMagazine(0.034, 0.155, 0.064, MAT.polymer);
  add(g, mag, 0, -0.083, -0.045);
  // floor plate
  add(g, rb(0.042, 0.012, 0.075, 0.003, MAT.polymerSoft, 2), 0, -0.232, -0.032, 0.08);

  // ---- trigger ----
  const trig = rb(0.005, 0.028, 0.008, 0.002, MAT.darkSteel, 2);
  add(g, trig, 0, -0.045, 0.030, 0.18);
  add(g, rb(0.006, 0.006, 0.010, 0.002, MAT.gunmetal, 1), 0, -0.030, 0.030);

  // ---- stamps ----
  const lab = textLabel('WW-15', { size: 70, w: 0.05, h: 0.0125, color: '#b9b5a8', opacity: 0.7 });
  add(g, lab, -0.0224, 0.008, -0.032, 0, -Math.PI / 2, 0);
  const cal = textLabel('5.56 NATO', { size: 46, w: 0.036, h: 0.009, color: '#9a978d', opacity: 0.65 });
  add(g, cal, -0.0224, 0.030, -0.075, 0, -Math.PI / 2, 0);

  return { guard, grip, mag, trigger: trig, hgEnd };
}

function stockAR(g, type = 'adjustable') {
  const stock = new THREE.Group();
  // main body skeleton
  add(stock, rb(0.044, 0.070, 0.120, 0.014, MAT.polymer, 4), 0, 0.000, 0.145);
  add(stock, rb(0.048, 0.100, 0.028, 0.010, MAT.polymerSoft, 3), 0, -0.005, 0.206);
  // cheek rest
  add(stock, rb(0.040, 0.026, 0.090, 0.008, MAT.polymerSoft, 2), 0, 0.038, 0.145);
  // adjustment lever
  add(stock, box(0.014, 0.012, 0.040, MAT.darkSteel), 0.024, -0.020, 0.150);
  add(stock, cyl(0.006, 0.014, MAT.darkSteel, 10, 'x'), 0.030, -0.024, 0.160);
  // QD sling slot
  add(stock, rb(0.016, 0.008, 0.024, 0.003, MAT.rubber, 1), -0.018, 0.020, 0.168);
  // buttpad
  add(stock, rb(0.047, 0.104, 0.012, 0.005, MAT.rubber, 3), 0, -0.004, 0.215);
  // ribs
  for (let i = 0; i < 3; i++) add(stock, box(0.030, 0.002, 0.06, MAT.blackOxide), 0, 0.042 - i * 0.02, 0.120);
  g.add(stock);
  return stock;
}

/* ============================================================
   WINDHAM WEAPONRY WW-15
   holo sight · modified trigger · muzzle brake · foregrip · buttstock
   ============================================================ */
function buildWW15() {
  const g = newWeapon();
  const meta = { parts: {}, group: g };
  buildAr15Base(g, { barrel: 0.18 });

  // stock
  const stock = stockAR(g);
  meta.parts.stock = stock;

  // ---- muzzle brake ----
  const brake = new THREE.Group();
  add(brake, cyl(0.016, 0.058, MAT.darkSteel, 18), 0, 0, 0);
  add(brake, cyl(0.018, 0.008, MAT.gunmetal, 18), 0, 0, -0.028);
  for (let i = 0; i < 3; i++) {
    for (const side of [-1, 1]) {
      add(brake, rb(0.004, 0.010, 0.007, 0.001, MAT.blackOxide, 1), side * 0.015, 0.001, -0.016 + i * 0.016);
    }
  }
  add(brake, cyl(0.012, 0.006, MAT.blackOxide, 16), 0, 0, 0.030);
  add(brake, cyl(0.0105, 0.004, MAT.blackOxide, 16), 0, 0, -0.031);
  add(g, brake, 0, 0.048, -0.626);
  meta.parts.brake = brake;
  // thread detail when brake removed
  const threads = new THREE.Group();
  for (let i = 0; i < 5; i++) add(threads, torus(0.0108, 0.0009, MAT.darkSteel, 4, 14), 0, 0.048, -0.612 - i * 0.003);
  threads.visible = false;
  g.add(threads);
  meta.parts.threads = threads;

  // ---- foregrip ----
  const fg = new THREE.Group();
  add(fg, rb(0.032, 0.095, 0.040, 0.010, MAT.polymer, 3), 0, -0.070, 0);
  add(fg, rb(0.036, 0.012, 0.044, 0.004, MAT.polymerSoft, 2), 0, -0.118, 0);
  add(fg, rb(0.030, 0.012, 0.038, 0.004, MAT.polymerSoft, 2), 0, -0.030, 0);
  for (let i = 0; i < 4; i++) add(fg, box(0.034, 0.0025, 0.036, MAT.blackOxide), 0, -0.050 - i * 0.014, 0);
  add(fg, cyl(0.005, 0.012, MAT.darkSteel, 10, 'z'), 0, -0.006, -0.006);
  add(g, fg, 0, -0.033, -0.305);
  meta.parts.foregrip = fg;

  // ---- holographic sight ----
  const holo = new THREE.Group();
  add(holo, rb(0.052, 0.014, 0.075, 0.003, MAT.gunmetal, 3), 0, 0.009, 0);
  add(holo, rb(0.020, 0.014, 0.030, 0.002, MAT.darkSteel, 2), 0, 0.001, 0.010);
  // hood side walls
  add(holo, rb(0.007, 0.052, 0.062, 0.003, MAT.gunmetal, 2), -0.023, 0.040, 0);
  add(holo, rb(0.007, 0.052, 0.062, 0.003, MAT.gunmetal, 2), 0.023, 0.040, 0);
  add(holo, rb(0.053, 0.008, 0.062, 0.002, MAT.gunmetal, 2), 0, 0.068, 0);
  // angled front hood
  add(holo, rb(0.050, 0.007, 0.012, 0.002, MAT.gunmetal, 2), 0, 0.064, -0.032, 0.32);
  // rear window frame
  add(holo, rb(0.050, 0.005, 0.036, 0.0015, MAT.gunmetal, 1), 0, 0.021, 0.028);
  // glass and reticle
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.039, 0.042), MAT.glass);
  add(holo, glass, 0, 0.044, 0.010);
  const ret = new THREE.Mesh(new THREE.PlaneGeometry(0.037, 0.037), MAT.reticleRed);
  ret.material = MAT.reticleRed.clone();
  ret.material.opacity = 0.95;
  add(holo, ret, 0, 0.044, 0.012);
  // buttons / adjustment
  add(holo, cyl(0.006, 0.012, MAT.rubber, 12, 'x'), 0.030, 0.030, 0.010);
  add(holo, cyl(0.005, 0.008, MAT.darkSteel, 10, 'y'), 0, 0.016, -0.030);
  add(holo, box(0.010, 0.006, 0.018, MAT.darkSteel), 0.020, 0.010, 0.030);
  const glow = glowSprite(0xff2a14, 0.007, 0.5);
  add(glow, 0.0, 0, 0);
  holo.add(glow);
  glow.position.set(0, 0.044, 0.0125);
  add(g, holo, 0, 0.086, -0.055);
  meta.parts.holo = holo;

  // iron sights (folded under optic)
  const irons = ironSights(g, 0.064, -0.430, 0.084, 0.096);
  meta.parts.irons = irons;
  irons.visible = false;

  // ---- modified trigger (red shoe) ----
  const shoe = new THREE.Group();
  add(shoe, rb(0.007, 0.026, 0.010, 0.003, MAT.red, 2), 0, -0.045, 0.031, 0.18);
  add(shoe, rb(0.006, 0.005, 0.012, 0.002, MAT.red, 1), 0, -0.058, 0.034, 0.18);
  add(g, shoe, 0, 0, 0);
  meta.parts.triggerShoe = shoe;

  // ejection port brass deflector, qd points
  qdSlingPoint(g, -0.023, 0.025, -0.16);
  add(g, rb(0.020, 0.010, 0.045, 0.003, MAT.rubber, 2), 0, 0.010, 0.084);

  meta.ads = { y: 0.130, z: -0.055 };
  meta.ironAds = { y: 0.104, z: 0.064 };
  meta.muzzle = V(0, 0.048, -0.658);
  meta.eject = V(0.026, 0.06, -0.045);
  meta.attachments = [
    { key: 'holo', label: 'Holographic Sight', sub: '1× · 68 MOA ring / 1 MOA dot', object: holo, ironsWhenOff: irons },
    { key: 'triggerShoe', label: 'Modified Trigger', sub: 'Flat-face · 3.5 lb pull', object: shoe },
    { key: 'brake', label: 'Muzzle Brake', sub: '3-port · recoil reduction', object: brake, reveal: threads },
    { key: 'foregrip', label: 'Vertical Foregrip', sub: 'M-LOK · polymer', object: fg },
    { key: 'stock', label: 'Buttstock', sub: '6-position collapsible', object: stock },
  ];
  meta.sightType = 'holo';
  meta.weaponClass = 'CARBINE';
  meta.hands = {
    right: { pos: [0, -0.080, 0.090], rot: [-0.30, 0.03, 0.0], scale: 1.0 },
    left: { pos: [0.002, -0.095, -0.305], rot: [-0.20, 0, 0], scale: 0.96 },
    elbowR: [0.115, -0.30, 0.30],
    elbowL: [-0.105, -0.33, 0.10],
  };
  return meta;
}

/* ============================================================
   RUGER AR-556
   red-dot sight · strobe light · buttstock
   ============================================================ */
function buildRuger() {
  const g = newWeapon();
  const meta = { parts: {}, group: g };
  buildAr15Base(g, { fde: true, barrel: 0.15 });

  const stock = stockAR(g);
  meta.parts.stock = stock;

  // birdcage flash hider
  const fh = new THREE.Group();
  add(fh, cyl(0.014, 0.045, MAT.darkSteel, 16), 0, 0, 0);
  for (let i = 0; i < 4; i++) {
    add(fh, rb(0.005, 0.012, 0.004, 0.001, MAT.blackOxide, 1), 0.012, 0, -0.012 + i * 0.010);
  }
  add(g, fh, 0, 0.048, -0.596);

  // ---- red dot sight (micro) ----
  const rd = new THREE.Group();
  add(rd, rb(0.042, 0.011, 0.062, 0.003, MAT.gunmetal, 3), 0, 0.008, 0);
  add(rd, rb(0.022, 0.016, 0.030, 0.003, MAT.darkSteel, 2), 0, 0.005, 0.005);
  // hood: rounded tube with cutout
  add(rd, rb(0.030, 0.040, 0.052, 0.006, MAT.polymer, 3), 0, 0.036, 0);
  add(rd, cyl(0.016, 0.012, MAT.polymer, 18), 0, 0.040, -0.026);
  const rdGlass = new THREE.Mesh(new THREE.CircleGeometry(0.0145, 22), MAT.glassDark);
  add(rd, rdGlass, 0, 0.040, -0.030);
  const rdRet = new THREE.Mesh(new THREE.PlaneGeometry(0.030, 0.030), MAT.reticleDot);
  add(rd, rdRet, 0, 0.040, -0.0315);
  add(rd, cyl(0.008, 0.010, MAT.rubber, 12, 'x'), 0.020, 0.040, 0.006);
  add(rd, cyl(0.005, 0.009, MAT.darkSteel, 10, 'y'), 0, 0.060, 0.003);
  const rdGlow = glowSprite(0xff2a14, 0.005, 0.55);
  rdGlow.position.set(0, 0.040, -0.0318);
  rd.add(rdGlow);
  add(g, rd, 0, 0.086, -0.075);
  meta.parts.reddot = rd;
  meta.parts.rdGlow = rdGlow;

  const irons = ironSights(g, 0.060, -0.430, 0.084, 0.096);
  meta.parts.irons = irons;
  irons.visible = false;

  // ---- strobe light ----
  const strobe = new THREE.Group();
  add(strobe, cyl(0.011, 0.075, MAT.polymer, 16), 0, 0, 0);
  add(strobe, cyl(0.0125, 0.012, MAT.gunmetal, 16), 0, 0, -0.040);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.0105, 18), MAT.amberGlow);
  add(lens, 0, 0, 0);
  lens.position.set(0, 0, -0.0465);
  lens.rotation.y = Math.PI;
  strobe.add(lens);
  add(strobe, cyl(0.009, 0.008, MAT.rubber, 12), 0, 0, 0.040);
  add(strobe, rb(0.020, 0.008, 0.030, 0.002, MAT.darkSteel, 1), 0, 0.012, 0.006);
  // offset side mount
  const mount = rb(0.016, 0.034, 0.026, 0.003, MAT.gunmetal, 2);
  add(strobe, mount, 0.018, 0, 0);
  add(strobe, cyl(0.006, 0.024, MAT.darkSteel, 10, 'x'), 0.020, 0, 0);
  const strobeGlow = glowSprite(0xffb040, 0.045, 0.9);
  strobeGlow.position.set(0, 0, -0.048);
  strobe.add(strobeGlow);
  add(strobe, cyl(0.003, 0.016, MAT.darkSteel, 8, 'y'), 0, -0.012, 0.022);
  add(g, strobe, 0.043, 0.060, -0.270, 0, 0, 0);
  meta.parts.strobe = strobe;
  meta.parts.strobeGlow = strobeGlow;
  meta.parts.strobeLens = lens;

  // standard trigger
  const shoe = new THREE.Group();
  add(shoe, rb(0.006, 0.024, 0.009, 0.002, MAT.darkSteel, 2), 0, -0.045, 0.031, 0.18);
  g.add(shoe);
  meta.parts.triggerShoe = shoe;

  qdSlingPoint(g, -0.023, 0.025, -0.165);
  // magpul-style foregrip ledge
  add(g, rb(0.038, 0.012, 0.050, 0.004, MAT.polymer, 2), 0, 0.014, -0.285);

  meta.ads = { y: 0.126, z: -0.075 };
  meta.ironAds = { y: 0.104, z: 0.060 };
  meta.muzzle = V(0, 0.048, -0.620);
  meta.eject = V(0.026, 0.06, -0.045);
  meta.attachments = [
    { key: 'reddot', label: 'Red-Dot Sight', sub: '2 MOA · micro reflex', object: rd, ironsWhenOff: irons },
    { key: 'strobe', label: 'Strobe Light', sub: '1,000 lumen · offset mount', object: strobe },
    { key: 'stock', label: 'Buttstock', sub: 'Collapsible M4 pattern', object: stock },
  ];
  meta.sightType = 'reddot';
  meta.weaponClass = 'CARBINE';
  meta.hands = {
    right: { pos: [0, -0.080, 0.090], rot: [-0.30, 0.03, 0], scale: 1.0 },
    left: { pos: [0, -0.045, -0.300], rot: [-0.05, 0, 0], scale: 0.95 },
    elbowR: [0.115, -0.30, 0.30],
    elbowL: [-0.095, -0.32, 0.13],
  };
  return meta;
}

/* ============================================================
   MOSSBERG 930
   Bushnell red-dot sight
   ============================================================ */
function buildMossberg930() {
  const g = newWeapon();
  const meta = { parts: {}, group: g };
  const steel = MAT.gunmetal;

  // receiver
  add(g, rb(0.052, 0.090, 0.205, 0.012, steel, 4), 0, 0.028, -0.005);
  add(g, rb(0.055, 0.030, 0.120, 0.008, MAT.polymer, 3), 0, 0.018, 0.070);
  // ejection port
  add(g, rb(0.004, 0.036, 0.075, 0.002, MAT.blackOxide, 2), 0.027, 0.045, -0.030);
  add(g, cyl(0.012, 0.016, MAT.darkSteel, 12, 'x'), 0.035, 0.030, 0.000);
  // shell lifter / loading port
  add(g, rb(0.035, 0.006, 0.060, 0.002, MAT.darkSteel, 1), 0, -0.015, 0.050);
  // safety button
  add(g, cyl(0.006, 0.006, MAT.red, 12, 'y'), 0, 0.075, 0.060);

  // trigger group
  const guard = triggerGuard(g, MAT.polymer);
  guard.position.set(0, -0.015, 0.010);
  add(g, rb(0.006, 0.030, 0.010, 0.002, MAT.darkSteel, 2), 0, -0.052, 0.020, 0.15);
  // pistol-grip style stock
  const stock = new THREE.Group();
  add(stock, rb(0.048, 0.085, 0.185, 0.018, MAT.polymer, 4), 0, -0.008, 0.230);
  add(stock, rb(0.046, 0.120, 0.060, 0.014, MAT.polymer, 3), 0, -0.045, 0.330);
  add(stock, rb(0.050, 0.028, 0.105, 0.008, MAT.polymerSoft, 2), 0, 0.043, 0.245);
  add(stock, rb(0.052, 0.126, 0.014, 0.006, MAT.rubber, 3), 0, -0.032, 0.370);
  // grip texture
  for (let i = 0; i < 5; i++) add(stock, box(0.044, 0.003, 0.05, MAT.blackOxide), 0, -0.015 - i * 0.014, 0.225);
  // sling stud
  add(stock, cyl(0.005, 0.012, MAT.darkSteel, 8, 'y'), 0, -0.080, 0.320);
  add(stock, torus(0.009, 0.002, MAT.darkSteel, 6, 12), 0, -0.088, 0.320, Math.PI / 2, 0, 0);
  g.add(stock);
  meta.parts.stock = stock;

  // barrel + vent rib
  add(g, cyl(0.017, 0.54, MAT.darkSteel, 20), 0, 0.062, -0.340);
  add(g, cyl(0.019, 0.045, MAT.gunmetal, 20), 0, 0.062, -0.610);
  add(g, rb(0.013, 0.005, 0.470, 0.002, MAT.gunmetal, 2), 0, 0.080, -0.330);
  for (let i = 0; i < 13; i++) add(g, box(0.010, 0.009, 0.007, MAT.gunmetal), 0, 0.074, -0.115 - i * 0.036);
  // front bead
  add(g, cyl(0.0035, 0.006, MAT.amberGlow, 8, 'y'), 0, 0.086, -0.585);
  // magazine tube
  add(g, cyl(0.014, 0.415, MAT.darkSteel, 16), 0, 0.012, -0.300);
  add(g, cyl(0.016, 0.018, MAT.gunmetal, 16), 0, 0.012, -0.510);
  add(g, cyl(0.004, 0.012, MAT.darkSteel, 8, 'y'), 0, 0.024, -0.480);
  // barrel clamp
  add(g, rb(0.035, 0.045, 0.022, 0.004, MAT.gunmetal, 2), 0, 0.038, -0.340);

  // forend
  const forend = new THREE.Group();
  add(forend, rb(0.058, 0.060, 0.170, 0.020, MAT.polymer, 4), 0, 0.012, -0.270);
  for (let i = 0; i < 5; i++) {
    add(forend, rb(0.060, 0.008, 0.020, 0.003, MAT.polymerSoft, 1), 0, 0.042, -0.335 + i * 0.032);
    add(forend, rb(0.060, 0.008, 0.020, 0.003, MAT.polymerSoft, 1), 0, -0.018, -0.335 + i * 0.032);
  }
  add(forend, rb(0.040, 0.012, 0.090, 0.004, MAT.blackOxide, 2), 0, 0.044, -0.270);
  g.add(forend);
  meta.parts.forend = forend;

  // shell carrier on receiver left side
  const saddle = new THREE.Group();
  add(saddle, rb(0.008, 0.052, 0.130, 0.003, MAT.rubber, 2), 0, 0.020, 0.045);
  for (let i = 0; i < 4; i++) {
    const shell = cyl(0.0095, 0.058, MAT.red, 12, 'z');
    add(saddle, shell, 0, 0.040, 0.008 + i * 0.030);
    add(saddle, cyl(0.0105, 0.010, MAT.brass, 12, 'z'), 0, 0.040, -0.032 + i * 0.030);
  }
  add(g, saddle, -0.031, 0.012, 0.012);

  // Bushnell red dot
  const rd = new THREE.Group();
  add(rd, rb(0.046, 0.011, 0.075, 0.003, MAT.gunmetal, 3), 0, 0.008, 0);
  add(rd, rb(0.024, 0.017, 0.034, 0.003, MAT.darkSteel, 2), 0, 0.005, 0);
  // tube
  add(rd, cyl(0.020, 0.085, MAT.polymer, 22), 0, 0.042, -0.005);
  add(rd, cyl(0.022, 0.014, MAT.gunmetal, 22), 0, 0.042, -0.045);
  add(rd, cyl(0.021, 0.012, MAT.gunmetal, 22), 0, 0.042, 0.035);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.0185, 24), MAT.glassDark);
  add(rd, lens, 0, 0.042, -0.0515, 0, Math.PI, 0);
  const ret = new THREE.Mesh(new THREE.PlaneGeometry(0.032, 0.032), MAT.reticleDot);
  add(rd, ret, 0, 0.042, -0.053, 0, Math.PI, 0);
  add(rd, cyl(0.007, 0.008, MAT.rubber, 12, 'x'), 0.022, 0.042, 0.000);
  add(rd, cyl(0.005, 0.009, MAT.darkSteel, 10, 'y'), 0, 0.064, 0.000);
  add(rd, box(0.028, 0.005, 0.032, MAT.darkSteel), 0, 0.009, 0.034);
  const glow = glowSprite(0xff2a14, 0.006, 0.5);
  glow.position.set(0, 0.042, -0.054);
  rd.add(glow);
  const brand = textLabel('BUSHNELL', { size: 46, w: 0.033, h: 0.008, color: '#c6c2b4', opacity: 0.75 });
  add(rd, brand, 0, 0.064, -0.006, -Math.PI / 2, 0, 0);
  add(g, rd, 0, 0.084, -0.010);
  meta.parts.reddot = rd;

  meta.ads = { y: 0.128, z: -0.010 };
  meta.muzzle = V(0, 0.062, -0.634);
  meta.eject = V(0.030, 0.046, -0.025);
  meta.attachments = [
    { key: 'reddot', label: 'Bushnell Red-Dot', sub: '1× · 4 MOA · 12-hour runtime', object: rd },
  ];
  meta.sightType = 'reddot';
  meta.weaponClass = 'SHOTGUN';
  meta.hands = {
    right: { pos: [0, -0.055, 0.095], rot: [-0.22, 0.03, 0], scale: 1.0 },
    left: { pos: [0, 0.010, -0.265], rot: [-0.02, 0, 0], scale: 0.97 },
    elbowR: [0.12, -0.30, 0.30],
    elbowL: [-0.10, -0.30, 0.12],
  };
  return meta;
}

/* ============================================================
   RANGER 870
   screw-in barrel choke
   ============================================================ */
function buildRanger870() {
  const g = newWeapon();
  const meta = { parts: {}, group: g };
  const blue = MAT.blackOxide;

  // receiver
  add(g, rb(0.050, 0.085, 0.185, 0.010, blue, 4), 0, 0.024, -0.005);
  add(g, rb(0.052, 0.020, 0.090, 0.006, blue, 3), 0, 0.064, 0.000);
  add(g, rb(0.004, 0.034, 0.068, 0.002, MAT.blackOxide, 2), 0.026, 0.040, -0.030);
  // ejection port
  add(g, rb(0.003, 0.030, 0.060, 0.001, MAT.rubber, 1), 0.027, 0.040, -0.035);
  // loading port
  add(g, rb(0.030, 0.005, 0.052, 0.002, MAT.darkSteel, 1), 0, -0.010, 0.050);
  // cross-bolt safety
  add(g, cyl(0.0055, 0.054, MAT.darkSteel, 10, 'x'), 0, 0.010, 0.058);
  add(g, cyl(0.008, 0.006, MAT.red, 12, 'x'), 0.030, 0.010, 0.058);

  // trigger guard
  const guard = triggerGuard(g, blue);
  guard.position.set(0, -0.014, 0.020);
  add(g, rb(0.006, 0.028, 0.010, 0.002, MAT.darkSteel, 2), 0, -0.050, 0.030, 0.16);

  // walnut stock
  const stock = new THREE.Group();
  add(stock, rb(0.048, 0.090, 0.185, 0.020, MAT.wood, 4), 0, -0.005, 0.215, 0.08);
  add(stock, rb(0.045, 0.120, 0.060, 0.016, MAT.wood, 3), 0, -0.048, 0.315, -0.10);
  add(stock, rb(0.050, 0.026, 0.125, 0.009, MAT.wood, 2), 0, 0.045, 0.230, 0.05);
  add(stock, rb(0.052, 0.130, 0.016, 0.006, MAT.rubber, 3), 0, -0.035, 0.360, -0.05);
  // checkering panels
  for (let i = 0; i < 7; i++) {
    add(stock, box(0.043, 0.0015, 0.004, MAT.wood), 0, 0.020, 0.190 + i * 0.009);
    add(stock, box(0.043, 0.0015, 0.004, MAT.wood), 0, -0.035, 0.285 + i * 0.007);
  }
  // grip cap + sling stud
  add(stock, rb(0.046, 0.020, 0.020, 0.006, MAT.wood, 2), 0, -0.112, 0.330, -0.1);
  add(stock, cyl(0.004, 0.010, MAT.darkSteel, 8, 'y'), 0, -0.088, 0.300);
  g.add(stock);
  meta.parts.stock = stock;

  // barrel
  add(g, cyl(0.016, 0.56, blue, 20), 0, 0.060, -0.345);
  // magazine tube
  add(g, cyl(0.0145, 0.43, blue, 16), 0, 0.010, -0.295);
  add(g, cyl(0.0165, 0.014, MAT.gunmetal, 16), 0, 0.010, -0.505);
  // barrel band
  add(g, rb(0.034, 0.055, 0.022, 0.004, blue, 2), 0, 0.038, -0.505);
  // bead sight
  add(g, cyl(0.0036, 0.005, MAT.brass, 10, 'y'), 0, 0.080, -0.600);

  // choke (attachment)
  const choke = new THREE.Group();
  add(choke, cyl(0.0155, 0.055, MAT.darkSteel, 20), 0, 0, 0);
  add(choke, cyl(0.018, 0.010, MAT.gunmetal, 20), 0, 0, -0.025);
  knurl(choke, 0.0175, -0.025, 4, 0.0025, MAT.darkSteel);
  add(choke, cyl(0.0105, 0.004, MAT.blackOxide, 16), 0, 0, -0.030);
  const chokeLab = textLabel('MOD', { size: 48, w: 0.015, h: 0.004, color: '#c8c4b6', opacity: 0.85 });
  add(choke, chokeLab, 0, 0.016, -0.010, -Math.PI / 2, 0, 0);
  add(g, choke, 0, 0.060, -0.645);
  meta.parts.choke = choke;
  // bare muzzle crown if removed
  const crown = new THREE.Group();
  add(crown, cyl(0.0165, 0.008, MAT.darkSteel, 18), 0, 0.060, -0.620);
  crown.visible = false;
  g.add(crown);
  meta.parts.crown = crown;

  // pump forend
  const pump = new THREE.Group();
  add(pump, rb(0.058, 0.058, 0.180, 0.020, MAT.wood, 4), 0, 0.020, -0.280);
  for (let i = 0; i < 8; i++) {
    add(pump, rb(0.060, 0.045, 0.006, 0.002, MAT.wood, 1), 0, 0.020, -0.355 + i * 0.021);
  }
  add(pump, rb(0.048, 0.010, 0.120, 0.004, MAT.blackOxide, 2), 0, -0.010, -0.280);
  g.add(pump);
  meta.parts.pump = pump;
  meta.parts.pumpRest = pump.position.z;

  // shell side saddle? classic: brass follower visible in loading port
  add(g, cyl(0.008, 0.008, MAT.brass, 12, 'z'), 0, 0.000, 0.035);

  meta.ads = { y: 0.082, z: 0.000 };
  meta.muzzle = V(0, 0.060, -0.678);
  meta.eject = V(0.029, 0.046, -0.020);
  meta.attachments = [
    { key: 'choke', label: 'Screw-In Barrel Choke', sub: '12 Ga · modified constriction', object: choke, reveal: crown },
  ];
  meta.sightType = 'iron';
  meta.weaponClass = 'PUMP SHOTGUN';
  meta.hands = {
    right: { pos: [0, -0.052, 0.090], rot: [-0.22, 0.03, 0], scale: 1.0 },
    left: { pos: [0, 0.002, -0.280], rot: [0.0, 0, 0], scale: 0.98 },
    elbowR: [0.12, -0.30, 0.30],
    elbowL: [-0.10, -0.30, 0.12],
  };
  return meta;
}

/* ============================================================
   UBERTI .357 MAGNUM
   adjustable open sights
   ============================================================ */
function buildUberti() {
  const g = newWeapon();
  const meta = { parts: {}, group: g };
  const blue = MAT.blackOxide;
  const frame = MAT.darkSteel;

  // grip frame + wood panels (angled back)
  const grip = new THREE.Group();
  add(grip, rb(0.034, 0.130, 0.062, 0.014, MAT.darkSteel, 3), 0, -0.085, 0.045, -0.32);
  add(grip, rb(0.040, 0.105, 0.058, 0.012, MAT.wood, 3), 0, -0.095, 0.055, -0.32);
  // grip screw
  add(grip, cyl(0.006, 0.046, MAT.darkSteel, 10, 'x'), 0, -0.105, 0.050);
  add(grip, cyl(0.003, 0.004, MAT.steel, 8, 'x'), 0.024, -0.105, 0.050);
  // backstrap
  add(grip, rb(0.030, 0.130, 0.012, 0.006, frame, 2), 0, -0.082, 0.078, -0.32);
  add(g, grip, 0, 0, 0);

  // frame / cylinder window
  add(g, rb(0.038, 0.072, 0.125, 0.008, frame, 3), 0, 0.030, 0.005);
  add(g, rb(0.040, 0.022, 0.120, 0.006, frame, 3), 0, 0.070, 0.005);
  // top strap
  add(g, rb(0.034, 0.012, 0.090, 0.004, frame, 2), 0, 0.083, -0.015);
  // front of frame
  add(g, rb(0.036, 0.065, 0.045, 0.007, frame, 3), 0, 0.033, -0.065);

  // barrel
  add(g, cyl(0.0125, 0.205, blue, 18), 0, 0.052, -0.185);
  add(g, rb(0.014, 0.010, 0.200, 0.003, blue, 2), 0, 0.066, -0.185);
  add(g, cyl(0.0135, 0.008, MAT.darkSteel, 18), 0, 0.052, -0.292);
  // ejector rod + housing
  add(g, cyl(0.0065, 0.185, MAT.darkSteel, 12), 0, 0.030, -0.185);
  add(g, rb(0.012, 0.016, 0.170, 0.003, blue, 2), 0, 0.022, -0.180);
  add(g, cyl(0.008, 0.012, MAT.darkSteel, 10), 0, 0.030, -0.280);
  add(g, cyl(0.006, 0.028, MAT.darkSteel, 10), 0, 0.030, -0.278);

  // cylinder
  const cylinder = new THREE.Group();
  add(cylinder, cyl(0.031, 0.068, MAT.darkSteel, 24), 0, 0, 0);
  // flutes
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const flute = rb(0.007, 0.030, 0.050, 0.003, MAT.blackOxide, 2);
    flute.position.set(Math.cos(a) * 0.0295, Math.sin(a) * 0.0295, 0);
    flute.rotation.z = a;
    cylinder.add(flute);
  }
  // chambers
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.26;
    const chamber = cyl(0.0062, 0.070, MAT.rubber, 10);
    chamber.position.set(Math.cos(a) * 0.018, Math.sin(a) * 0.018, 0);
    cylinder.add(chamber);
    const rim = cyl(0.0072, 0.004, MAT.brass, 10);
    rim.position.set(Math.cos(a) * 0.018, Math.sin(a) * 0.018, 0.036);
    cylinder.add(rim);
  }
  add(g, cylinder, 0, 0.048, -0.035);
  meta.parts.cylinder = cylinder;
  // cylinder pin
  add(g, cyl(0.004, 0.11, MAT.darkSteel, 8), 0, 0.048, -0.100);

  // hammer
  const hammer = new THREE.Group();
  add(hammer, rb(0.012, 0.045, 0.020, 0.004, MAT.darkSteel, 2), 0, 0.028, 0);
  add(hammer, rb(0.014, 0.018, 0.038, 0.004, MAT.gunmetal, 2), 0, 0.052, 0.014);
  for (let i = 0; i < 4; i++) add(hammer, box(0.015, 0.0015, 0.026, MAT.darkSteel), 0, 0.056, 0.006 + i * 0.006);
  add(g, hammer, 0, 0.062, 0.055, 0, 0, 0);
  meta.parts.hammer = hammer;

  // trigger + guard
  add(g, rb(0.006, 0.030, 0.010, 0.002, MAT.darkSteel, 2), 0, -0.020, 0.035, 0.2);
  const guard = triggerGuard(g, frame);
  guard.position.set(0, 0.002, 0.024);
  // loading gate
  add(g, rb(0.004, 0.040, 0.045, 0.002, MAT.darkSteel, 2), 0.021, 0.030, 0.020);
  add(g, cyl(0.006, 0.006, MAT.darkSteel, 8, 'x'), 0.022, 0.025, 0.040);

  // adjustable rear sight (attachment)
  const sight = new THREE.Group();
  add(sight, rb(0.028, 0.006, 0.034, 0.002, MAT.darkSteel, 2), 0, 0, 0);
  add(sight, box(0.004, 0.012, 0.010, MAT.blackOxide), -0.011, 0.008, 0);
  add(sight, box(0.004, 0.012, 0.010, MAT.blackOxide), 0.011, 0.008, 0);
  add(sight, box(0.020, 0.004, 0.006, MAT.blackOxide), 0, 0.012, 0);
  add(sight, cyl(0.004, 0.008, MAT.gunmetal, 8, 'y'), 0, -0.006, 0.012);
  const notch = new THREE.Mesh(new THREE.PlaneGeometry(0.007, 0.006), new THREE.MeshBasicMaterial({ color: 0x050505 }));
  notch.rotation.x = -Math.PI / 2;
  add(sight, notch, 0, 0.0105, 0);
  add(g, sight, 0, 0.090, 0.012);
  meta.parts.rearSight = sight;
  // front ramp sight (fixed)
  const front = new THREE.Group();
  add(front, rb(0.012, 0.008, 0.034, 0.002, MAT.darkSteel, 2), 0, 0, 0);
  add(front, box(0.0035, 0.014, 0.006, MAT.blackOxide), 0, 0.010, 0);
  add(front, box(0.010, 0.004, 0.004, MAT.darkSteel), 0, 0.018, 0);
  add(g, front, 0, 0.073, -0.272);
  meta.parts.frontSight = front;

  // cylinder release / screws
  screw(g, 0.020, 0.050, 0.055, 0.004, MAT.darkSteel);
  screw(g, -0.020, 0.050, 0.055, 0.004, MAT.darkSteel);
  add(g, rb(0.006, 0.020, 0.030, 0.002, MAT.darkSteel, 1), 0.020, 0.030, 0.040);

  // engravings
  const brand = textLabel('UBERTI', { size: 44, w: 0.035, h: 0.009, color: '#b0aa9a', opacity: 0.55 });
  add(g, brand, 0, 0.085, -0.150, -Math.PI / 2, 0, 0);

  meta.ads = { y: 0.090, z: 0.012 };
  meta.muzzle = V(0, 0.052, -0.298);
  meta.eject = V(0.024, 0.048, -0.030);
  meta.attachments = [
    { key: 'rearSight', label: 'Adjustable Open Sights', sub: 'Target rear blade · elevation screw', object: sight },
  ];
  meta.sightType = 'iron';
  meta.weaponClass = 'REVOLVER';
  meta.parts.singleAction = true;
  meta.hands = {
    right: { pos: [0, -0.085, 0.075], rot: [-0.30, 0.04, 0.05], scale: 0.95 },
    left: { pos: [-0.010, -0.125, 0.070], rot: [-0.30, -0.15, -0.25], scale: 0.9 },
    elbowR: [0.11, -0.32, 0.28],
    elbowL: [-0.11, -0.34, 0.24],
  };
  return meta;
}

/* ============================================================
   MOSSBERG MVP PREDATOR
   telescopic sight · bipod
   ============================================================ */
function buildMVP() {
  const g = newWeapon();
  const meta = { parts: {}, group: g };

  // laminate stock
  const stock = new THREE.Group();
  add(stock, rb(0.047, 0.090, 0.220, 0.014, MAT.laminate, 4), 0, -0.012, 0.235);
  add(stock, rb(0.044, 0.125, 0.070, 0.014, MAT.laminate, 3), 0, -0.062, 0.340);
  add(stock, rb(0.048, 0.024, 0.140, 0.006, MAT.laminate, 2), 0, 0.042, 0.260);
  add(stock, rb(0.050, 0.132, 0.015, 0.006, MAT.rubber, 3), 0, -0.045, 0.388);
  // cheek riser
  add(stock, rb(0.040, 0.024, 0.105, 0.007, MAT.laminate, 2), 0, 0.055, 0.280);
  // grip area
  add(stock, rb(0.043, 0.100, 0.060, 0.014, MAT.laminate, 3), 0, -0.060, 0.130, -0.18);
  // checkering / laminate edge lines
  for (let i = 0; i < 6; i++) add(stock, box(0.044, 0.0015, 0.004, MAT.darkSteel), 0, 0.045, 0.110 + i * 0.008);
  add(stock, cyl(0.005, 0.012, MAT.darkSteel, 8, 'y'), 0, -0.125, 0.300);
  g.add(stock);
  meta.parts.stock = stock;

  // fore-end
  add(g, rb(0.045, 0.052, 0.230, 0.013, MAT.laminate, 4), 0, 0.010, -0.275);
  add(g, rb(0.048, 0.020, 0.180, 0.006, MAT.laminate, 2), 0, 0.035, -0.285);
  for (let i = 0; i < 5; i++) add(g, box(0.044, 0.003, 0.012, MAT.darkSteel), 0, 0.040, -0.220 - i * 0.035);

  // receiver
  add(g, rb(0.040, 0.060, 0.190, 0.007, MAT.darkSteel, 4), 0, 0.042, -0.025);
  picatinny(g, 0.074, 0.060, -0.130, MAT.gunmetal, 0.020);
  // action / bolt
  const bolt = new THREE.Group();
  add(bolt, cyl(0.0115, 0.155, MAT.darkSteel, 18), 0, 0.058, 0.020);
  const handle = new THREE.Group();
  add(handle, cyl(0.005, 0.055, MAT.darkSteel, 10, 'x'), 0.040, 0.058, 0.052);
  add(handle, cyl(0.011, 0.020, MAT.gunmetal, 14, 'x'), 0.070, 0.058, 0.052);
  add(handle, cyl(0.013, 0.008, MAT.rubber, 14, 'x'), 0.081, 0.058, 0.052);
  // checkered bolt knob
  for (let i = 0; i < 3; i++) add(handle, torus(0.0105, 0.0012, MAT.darkSteel, 4, 10), 0.072 + i * 0.007, 0.058, 0.052, 0, Math.PI / 2, 0);
  bolt.add(handle);
  g.add(bolt);
  meta.parts.bolt = bolt;
  meta.parts.boltHandle = handle;

  // ejection port
  add(g, rb(0.004, 0.022, 0.055, 0.002, MAT.blackOxide, 2), 0.022, 0.050, 0.005);
  // trigger guard + trigger
  const guard = triggerGuard(g, MAT.darkSteel);
  guard.position.set(0, -0.012, 0.075);
  add(g, rb(0.006, 0.028, 0.010, 0.002, MAT.darkSteel, 2), 0, -0.050, 0.082, 0.15);
  // magazine
  add(g, rb(0.031, 0.075, 0.070, 0.006, MAT.polymer, 3), 0, -0.10, -0.010);
  add(g, rb(0.038, 0.012, 0.078, 0.003, MAT.polymerSoft, 2), 0, -0.140, -0.010);
  add(g, rb(0.034, 0.048, 0.066, 0.004, MAT.polymer, 2), 0, -0.095, -0.012);
  meta.parts.mag = g.children[g.children.length - 3];

  // barrel (fluted)
  add(g, cyl(0.0145, 0.475, MAT.darkSteel, 20), 0, 0.052, -0.345);
  add(g, cyl(0.016, 0.030, MAT.gunmetal, 20), 0, 0.052, -0.585);
  add(g, cyl(0.0125, 0.004, MAT.blackOxide, 16), 0, 0.052, -0.598);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const flute = rb(0.004, 0.004, 0.300, 0.001, MAT.blackOxide, 1);
    flute.position.set(Math.cos(a) * 0.014, 0.052 + Math.sin(a) * 0.014, -0.330);
    flute.rotation.z = a;
    g.add(flute);
  }
  // recoil lug
  add(g, rb(0.050, 0.020, 0.050, 0.004, MAT.darkSteel, 2), 0, 0.040, -0.165);

  // ---- telescopic sight ----
  const scope = new THREE.Group();
  // base rail + rings
  add(scope, rb(0.052, 0.012, 0.165, 0.003, MAT.gunmetal, 3), 0, 0.008, 0);
  for (const z of [-0.055, 0.065]) {
    add(scope, rb(0.028, 0.032, 0.022, 0.005, MAT.darkSteel, 2), 0, 0.036, z);
    add(scope, torus(0.018, 0.004, MAT.darkSteel, 8, 18), 0, 0.056, z, 0, 0, 0);
    add(scope, cyl(0.004, 0.010, MAT.gunmetal, 8, 'x'), 0.019, 0.038, z);
    add(scope, cyl(0.004, 0.010, MAT.gunmetal, 8, 'x'), -0.019, 0.038, z);
  }
  // main tube
  add(scope, cyl(0.0155, 0.255, MAT.blackOxide, 24), 0, 0.062, 0.010);
  // objective bell
  add(scope, cyl(0.026, 0.075, MAT.blackOxide, 24), 0, 0.062, -0.150);
  add(scope, cyl(0.027, 0.012, MAT.gunmetal, 24), 0, 0.062, -0.190);
  add(scope, cyl(0.0245, 0.006, MAT.darkSteel, 24), 0, 0.062, -0.195);
  const objLens = new THREE.Mesh(new THREE.CircleGeometry(0.0235, 26), MAT.lens);
  add(scope, objLens, 0, 0.062, -0.1985, 0, Math.PI, 0);
  // ocular bell
  add(scope, cyl(0.022, 0.068, MAT.blackOxide, 24), 0, 0.062, 0.165);
  add(scope, cyl(0.0235, 0.012, MAT.rubber, 24), 0, 0.062, 0.200);
  const eyeLens = new THREE.Mesh(new THREE.CircleGeometry(0.020, 24), MAT.glassDark);
  add(scope, eyeLens, 0, 0.062, 0.206, 0, 0, 0);
  // turrets
  add(scope, cyl(0.012, 0.020, MAT.darkSteel, 14, 'y'), 0, 0.085, 0.010);
  add(scope, cyl(0.009, 0.006, MAT.gunmetal, 12, 'y'), 0, 0.098, 0.010);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    add(scope, box(0.004, 0.009, 0.004, MAT.darkSteel), Math.cos(a) * 0.012, 0.085, 0.010 + Math.sin(a) * 0.012);
  }
  add(scope, cyl(0.010, 0.018, MAT.darkSteel, 14, 'x'), 0.020, 0.062, 0.010);
  // magnification ring + lever
  add(scope, torus(0.0175, 0.004, MAT.rubber, 8, 20), 0, 0.062, 0.105);
  add(scope, rb(0.008, 0.028, 0.016, 0.003, MAT.gunmetal, 2), 0.022, 0.052, 0.108);
  // brand
  const brand = textLabel('MOSSBERG', { size: 44, w: 0.055, h: 0.010, color: '#b9b5a8', opacity: 0.55 });
  add(scope, brand, 0, 0.078, -0.020, -Math.PI / 2, 0, 0);
  add(scope, rb(0.006, 0.004, 0.035, 0.001, MAT.darkSteel, 1), 0, 0.080, 0.095);
  add(g, scope, 0, 0.080, -0.010);
  meta.parts.scope = scope;

  // ---- bipod ----
  const bipod = new THREE.Group();
  add(bipod, rb(0.030, 0.022, 0.040, 0.004, MAT.darkSteel, 2), 0, 0, 0);
  add(bipod, cyl(0.008, 0.030, MAT.darkSteel, 10, 'x'), 0, -0.004, 0);
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    const legTop = cyl(0.0055, 0.150, MAT.darkSteel, 10);
    add(leg, legTop, 0, -0.075, 0);
    add(leg, cyl(0.004, 0.080, MAT.gunmetal, 10), 0, -0.140, 0);
    // rubber foot
    add(leg, rb(0.012, 0.020, 0.014, 0.004, MAT.rubber, 2), 0, -0.184, 0);
    // spring detail
    for (let i = 0; i < 4; i++) add(leg, torus(0.0062, 0.001, MAT.darkSteel, 4, 10), 0, -0.070 - i * 0.012, 0);
    add(leg, rb(0.008, 0.012, 0.008, 0.002, MAT.gunmetal, 1), 0, -0.150, 0);
    leg.rotation.z = side * 0.38;
    leg.rotation.x = side * 0.10;
    leg.position.set(side * 0.012, -0.018, 0);
    bipod.add(leg);
  }
  add(bipod, cyl(0.004, 0.020, MAT.darkSteel, 8, 'x'), 0, 0, 0.020);
  add(g, bipod, 0, -0.010, -0.360);
  meta.parts.bipod = bipod;
  meta.parts.bipodDeployed = true;

  // sling stud
  add(g, cyl(0.004, 0.010, MAT.darkSteel, 8, 'y'), 0, -0.030, 0.155);

  meta.ads = { y: 0.142, z: -0.005 };
  meta.muzzle = V(0, 0.052, -0.610);
  meta.eject = V(0.024, 0.048, 0.005);
  meta.attachments = [
    { key: 'scope', label: 'Telescopic Sight', sub: '4–16×44 · mil-dot · 30 mm tube', object: scope },
    { key: 'bipod', label: 'Bipod', sub: 'Deployable · 6–9 in · pan/tilt', object: bipod },
  ];
  meta.sightType = 'scope';
  meta.weaponClass = 'BOLT-ACTION RIFLE';
  meta.hands = {
    right: { pos: [0, -0.070, 0.120], rot: [-0.28, 0.02, 0], scale: 1.0 },
    left: { pos: [0, -0.035, -0.250], rot: [-0.05, 0, 0], scale: 0.96 },
    elbowR: [0.115, -0.30, 0.32],
    elbowL: [-0.10, -0.32, 0.16],
  };
  return meta;
}

const BUILDERS = {
  ww15: buildWW15,
  ruger: buildRuger,
  mossberg930: buildMossberg930,
  ranger870: buildRanger870,
  uberti: buildUberti,
  mvp: buildMVP,
};

export const WEAPON_DEFS = [
  {
    id: 'ww15', brand: 'WINDHAM WEAPONRY', name: 'WW-15', short: 'WW-15', category: 'CARBINE',
    caliber: '5.56×45 MM NATO', caliberShort: '5.56×45', mag: 30, reserve: 150, rpm: 720, auto: true,
    damage: 62, control: 74, range: 68, handling: 70, pellets: 1, spread: 0.005, recoil: 0.010,
    reloadTime: 2.0, muzzleVel: 880, sightType: 'holo', serial: 'KR-W15-0041', zoom: 1.15,
    notes: 'Cold-hammer-forged barrel. Tuned trigger. Configured for rapid transition between 25 m paper and 100 m steel.',
  },
  {
    id: 'ruger', brand: 'RUGER', name: 'AR-556', short: 'AR-556', category: 'CARBINE',
    caliber: '5.56×45 MM NATO', caliberShort: '5.56×45', mag: 30, reserve: 120, rpm: 540, auto: false,
    damage: 58, control: 78, range: 62, handling: 76, pellets: 1, spread: 0.0045, recoil: 0.009,
    reloadTime: 1.85, muzzleVel: 850, sightType: 'reddot', serial: 'KR-AR556-0117', zoom: 1.2,
    notes: 'Lightweight 16-inch carbine with offset illumination. Red-dot and strobe co-witnessed for low-light work.',
  },
  {
    id: 'mossberg930', brand: 'MOSSBERG', name: '930', short: 'MOSSBERG 930', category: 'SHOTGUN',
    caliber: '12 GAUGE · 2¾ IN', caliberShort: '12 GA', mag: 7, reserve: 28, rpm: 180, auto: false,
    damage: 88, control: 46, range: 24, handling: 54, pellets: 9, spread: 0.028, recoil: 0.021,
    reloadTime: 0.62, muzzleVel: 400, sightType: 'reddot', serial: 'KR-930-0208', zoom: 1.1,
    shellReload: true, notes: 'Gas-operated semi-auto. Bushnell red-dot for fast close-range accountability. Nine-pellet 00 buck.',
  },
  {
    id: 'ranger870', brand: 'RANGER', name: '870', short: 'RANGER 870', category: 'PUMP',
    caliber: '12 GAUGE · 2¾ IN', caliberShort: '12 GA', mag: 5, reserve: 25, rpm: 90, auto: false,
    damage: 92, control: 42, range: 22, handling: 48, pellets: 9, spread: 0.032, recoil: 0.024,
    reloadTime: 0.60, muzzleVel: 390, sightType: 'iron', serial: 'KR-870-0034', zoom: 1.05,
    shellReload: true, pump: true, notes: 'Classic walnut pump gun. Screw-in modified choke tightens the pattern for 15–30 m work.',
  },
  {
    id: 'uberti', brand: 'UBERTI', name: '.357 MAGNUM', short: 'UBERTI .357', category: 'REVOLVER',
    caliber: '.357 MAGNUM', caliberShort: '.357 MAG', mag: 6, reserve: 36, rpm: 120, auto: false,
    damage: 76, control: 40, range: 35, handling: 66, pellets: 1, spread: 0.008, recoil: 0.020,
    reloadTime: 2.4, muzzleVel: 430, sightType: 'iron', serial: 'KR-U357-0006', zoom: 1.1,
    singleAction: true, notes: 'Single-action sixgun. Adjustable open sights. Every shot is earned — cock, breathe, press.',
  },
  {
    id: 'mvp', brand: 'MOSSBERG', name: 'MVP PREDATOR', short: 'MVP PREDATOR', category: 'BOLT',
    caliber: '6.5 CREEDMOOR', caliberShort: '6.5 CM', mag: 5, reserve: 25, rpm: 45, auto: false,
    damage: 100, control: 62, range: 100, handling: 38, pellets: 1, spread: 0.002, recoil: 0.016,
    reloadTime: 2.6, muzzleVel: 920, sightType: 'scope', serial: 'KR-MVP-0009', zoom: 4.0,
    bolt: true, notes: 'Laminate-stocked predator rifle. 4–16×44 optic on a bipod; built for 100 m groups in the wind.',
  },
];

export function createWeapon(id) {
  const builder = BUILDERS[id];
  if (!builder) throw new Error('Unknown weapon ' + id);
  const meta = builder();
  meta.id = id;
  meta.def = WEAPON_DEFS.find(w => w.id === id);
  return meta;
}

export const buildWeaponModel = createWeapon;

export function collectAttachmentState(meta) {
  const state = {};
  for (const a of meta.attachments || []) state[a.key] = a.object.visible;
  return state;
}

export function applyAttachmentVisibility(meta, state) {
  for (const a of meta.attachments || []) {
    const visible = state[a.key] !== false;
    a.object.visible = visible;
    if (a.reveal) a.reveal.visible = !visible;
    if (a.ironsWhenOff) a.ironsWhenOff.visible = !visible;
    a.object.userData.enabled = visible;
  }
  if (meta.parts?.irons && meta.attachments?.some(a => a.key === 'holo' || a.key === 'reddot')) {
    // handled per attachment
  }
}

export function getADS(meta) {
  const optic = meta.attachments?.find(a => a.object.visible && (a.key === 'holo' || a.key === 'reddot' || a.key === 'scope'));
  if (optic && meta.ads) return meta.ads;
  return meta.ironAds || meta.ads;
}
