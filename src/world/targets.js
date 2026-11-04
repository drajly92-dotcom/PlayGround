import * as THREE from 'three';
import { targetTexture } from '../lib/textures.js';
import { MAT, rb, box, cyl, torus, add } from '../weapons/parts.js';

let holeTexture = null;
function getHoleTexture() {
  if (holeTexture) return holeTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 26);
  grad.addColorStop(0, 'rgba(8,8,7,0.98)');
  grad.addColorStop(0.45, 'rgba(18,17,14,0.9)');
  grad.addColorStop(0.8, 'rgba(55,50,40,0.35)');
  grad.addColorStop(1, 'rgba(70,64,50,0)');
  g.fillStyle = grad;
  g.beginPath();
  // ragged hole edge
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 16 + Math.sin(a * 5) * 2 + Math.random() * 2;
    const x = 32 + Math.cos(a) * r, y = 32 + Math.sin(a) * r;
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  }
  g.closePath(); g.fill();
  holeTexture = new THREE.CanvasTexture(c);
  holeTexture.colorSpace = THREE.SRGBColorSpace;
  return holeTexture;
}

const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b4b30, roughness: 0.85, metalness: 0.02 });
const paperMat = new THREE.MeshStandardMaterial({
  map: targetTexture('paper'), roughness: 0.9, metalness: 0.0, side: THREE.DoubleSide,
});
const steelMat = new THREE.MeshStandardMaterial({ color: 0x8d918b, roughness: 0.44, metalness: 0.82, envMapIntensity: 1.1 });
const steelDark = new THREE.MeshStandardMaterial({ color: 0x3d403e, roughness: 0.62, metalness: 0.85 });
const orangePaint = new THREE.MeshStandardMaterial({ color: 0xc75930, roughness: 0.55, metalness: 0.2 });

function targetStand(parent, height = 1.05) {
  const g = new THREE.Group();
  for (const s of [-1, 1]) {
    add(g, box(0.045, height + 0.35, 0.045, woodMat), s * 0.42, (height + 0.35) / 2, 0);
    // angled feet
    add(g, box(0.045, 0.75, 0.045, woodMat), s * 0.42, 0.30, 0.22, 0.55, 0, 0);
  }
  add(g, box(0.94, 0.055, 0.05, woodMat), 0, height + 0.33, 0);
  // backing board
  const backMat = new THREE.MeshStandardMaterial({ color: 0xb6ad91, roughness: 0.95 });
  add(g, box(0.74, 0.94, 0.018, backMat), 0, height, 0.005);
  parent.add(g);
  return g;
}

export function createPaperTarget({ x = 0, z = -20, y = 1.25, distance = 25, label = 'PAPER', id = 0 }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  targetStand(group, y);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.72), paperMat);
  plate.position.set(0, y, 0.025);
  plate.castShadow = false;
  plate.receiveShadow = true;
  group.add(plate);
  // frame strips
  add(group, box(0.66, 0.026, 0.025, woodMat), 0, y + 0.36, 0.02);
  add(group, box(0.66, 0.026, 0.025, woodMat), 0, y - 0.36, 0.02);

  const holes = new THREE.Group();
  group.add(holes);
  const target = {
    id, kind: 'paper', label, distance, group, hitMesh: plate,
    points: 100, hits: 0, center: new THREE.Vector3(x, y, z + 0.03),
    addHole(uv) {
      const holeMat = new THREE.MeshBasicMaterial({ map: getHoleTexture(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.032, 0.032), holeMat);
      m.position.set((uv.x - 0.5) * 0.58, (uv.y - 0.5) * 0.72, 0.003 + Math.random() * 0.001);
      holes.add(m);
      if (holes.children.length > 90) holes.remove(holes.children[0]);
      // darken paper around hole
      this.hits++;
    },
    scoreFor(uv) {
      const dx = uv.x - 0.5, dy = uv.y - 0.5;
      const r = Math.hypot(dx, dy * 0.82);
      if (r < 0.045) return 100;
      if (r < 0.10) return 75;
      if (r < 0.17) return 50;
      if (r < 0.25) return 25;
      return 10;
    },
    update() {},
    reset() { holes.clear(); this.hits = 0; },
  };
  plate.userData.target = target;
  group.userData.target = target;
  return target;
}

function gongFrame(group, height = 2.05) {
  for (const s of [-1, 1]) {
    add(group, box(0.07, height, 0.07, steelDark), s * 0.55, height / 2, 0);
    add(group, box(0.07, 0.06, 1.0, steelDark), s * 0.55, 0.03, 0.38);
    add(group, box(0.07, 0.07, 0.85, steelDark), s * 0.55, height - 0.04, 0.34, -0.18, 0, 0);
  }
  add(group, box(1.2, 0.08, 0.08, steelDark), 0, height - 0.03, 0);
  // chain
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) add(group, torus(0.016, 0.004, steelMat, 5, 8), s * 0.18, height - 0.10 - i * 0.045, 0, i % 2 ? Math.PI / 2 : 0, 0, 0);
  }
  add(group, box(0.42, 0.025, 0.03, steelDark), 0, height - 0.25, 0);
}

export function createSteelGong({ x = 0, z = -30, distance = 35, label = 'STEEL', id = 0, radius = 0.24 }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  gongFrame(group, 2.0);
  const pivot = new THREE.Group();
  pivot.position.set(0, 2.0, 0);
  group.add(pivot);
  const plate = new THREE.Mesh(new THREE.CircleGeometry(radius, 40), steelMat);
  plate.position.set(0, -0.42, 0.02);
  plate.castShadow = true; plate.receiveShadow = true;
  pivot.add(plate);
  // face paint ring
  const ring = new THREE.Mesh(new THREE.RingGeometry(radius * 0.55, radius * 0.72, 32), orangePaint);
  ring.position.set(0, -0.42, 0.024);
  pivot.add(ring);
  const center = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.12, 20), new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.8 }));
  center.position.set(0, -0.42, 0.025);
  pivot.add(center);
  // back brace
  add(pivot, box(0.04, 0.30, 0.04, steelDark), 0, -0.18, 0);

  const target = {
    id, kind: 'steel', label, distance, group, hitMesh: plate, points: 150, angle: 0, vel: 0, hits: 0,
    center: new THREE.Vector3(x, 1.58, z + 0.04),
    hit() {
      this.vel += 2.4;
      this.hits++;
      this.flash = 0.12;
    },
    update(dt) {
      this.vel += -this.angle * 42 * dt;
      this.vel *= Math.pow(0.08, dt);
      this.angle += this.vel * dt;
      this.angle = THREE.MathUtils.clamp(this.angle, -1.1, 1.1);
      pivot.rotation.x = this.angle;
      if (this.flash > 0) {
        this.flash -= dt;
        plate.material.emissive.setHex(0xff9a40);
        plate.material.emissiveIntensity = Math.max(0, this.flash * 10);
      } else if (plate.material.emissiveIntensity !== 0) {
        plate.material.emissiveIntensity = 0;
      }
    },
    reset() { this.angle = 0; this.vel = 0; this.hits = 0; },
  };
  plate.userData.target = target;
  group.userData.target = target;
  return target;
}

function silhouetteGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.22, -0.55);
  s.lineTo(-0.26, -0.20);
  s.quadraticCurveTo(-0.34, 0.06, -0.24, 0.22);
  s.lineTo(-0.13, 0.28);
  s.quadraticCurveTo(-0.09, 0.36, -0.06, 0.40);
  s.absarc(0, 0.44, 0.085, Math.PI, 0, true);
  s.quadraticCurveTo(0.09, 0.36, 0.13, 0.28);
  s.lineTo(0.24, 0.22);
  s.quadraticCurveTo(0.34, 0.06, 0.26, -0.20);
  s.lineTo(0.22, -0.55);
  s.lineTo(0.08, -0.55);
  s.lineTo(0.06, -0.70);
  s.lineTo(-0.06, -0.70);
  s.lineTo(-0.08, -0.55);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.028, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.006, bevelThickness: 0.004 });
  geo.center();
  return geo;
}

export function createSteelSilhouette({ x = 0, z = -55, distance = 60, label = 'SILHOUETTE', id = 0 }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  // A-frame base
  for (const s of [-1, 1]) {
    add(group, box(0.08, 2.1, 0.08, steelDark), s * 0.70, 1.05, 0.10, 0, 0, s * -0.12);
    add(group, box(0.08, 0.06, 1.2, steelDark), s * 0.70, 0.03, 0.55, 0.2, 0, 0);
  }
  add(group, box(1.55, 0.08, 0.08, steelDark), 0, 2.05, 0.10);
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) add(group, torus(0.017, 0.004, steelMat, 5, 8), s * 0.3, 1.98 - i * 0.04, 0.1);
  }
  add(group, box(0.65, 0.025, 0.04, steelDark), 0, 1.84, 0.10);
  const pivot = new THREE.Group();
  pivot.position.set(0, 2.0, 0.10);
  group.add(pivot);
  const plate = new THREE.Mesh(silhouetteGeometry(), steelMat);
  plate.position.set(0, -0.78, 0.03);
  plate.castShadow = true;
  pivot.add(plate);
  // painted chest zone
  const chest = new THREE.Mesh(new THREE.CircleGeometry(0.135, 28), orangePaint);
  chest.position.set(0, -0.70, 0.073);
  pivot.add(chest);
  const headZone = new THREE.Mesh(new THREE.CircleGeometry(0.065, 20), orangePaint);
  headZone.position.set(0, -0.355, 0.073);
  pivot.add(headZone);
  const target = {
    id, kind: 'steel', label, distance, group, hitMesh: plate, points: 200, angle: 0, vel: 0, hits: 0,
    center: new THREE.Vector3(x, 1.22, z + 0.12),
    hit() { this.vel += 1.7; this.hits++; this.flash = 0.10; },
    update(dt) {
      this.vel += -this.angle * 34 * dt;
      this.vel *= Math.pow(0.07, dt);
      this.angle += this.vel * dt;
      this.angle = THREE.MathUtils.clamp(this.angle, -0.8, 0.8);
      pivot.rotation.x = this.angle;
      if (this.flash > 0) {
        this.flash -= dt;
        plate.material.emissive.setHex(0xff8530);
        plate.material.emissiveIntensity = Math.max(0, this.flash * 10);
      } else plate.material.emissiveIntensity = 0;
    },
    reset() { this.angle = 0; this.vel = 0; this.hits = 0; },
  };
  plate.userData.target = target;
  group.userData.target = target;
  return target;
}

export function createPopupTarget({ x = 0, z = -25, distance = 30, id = 0, radius = 0.20 }) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  // low base
  add(group, rb(0.55, 0.12, 0.35, 0.02, steelDark, 2), 0, 0.06, 0);
  add(group, box(0.08, 0.35, 0.08, steelDark), 0, 0.28, 0.10);
  const pivot = new THREE.Group();
  pivot.position.set(0, 0.45, 0.06);
  group.add(pivot);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.90, 0.05), steelDark);
  arm.position.set(0, 0.45, 0);
  pivot.add(arm);
  const plate = new THREE.Mesh(new THREE.CircleGeometry(radius, 28), steelMat.clone());
  plate.position.set(0, 0.84, -0.02);
  plate.rotation.y = Math.PI;
  plate.userData.flip = true;
  plate.castShadow = true;
  pivot.add(plate);
  const ring = new THREE.Mesh(new THREE.RingGeometry(radius * 0.55, radius * 0.70, 24), orangePaint);
  ring.position.set(0, 0.84, -0.024);
  ring.rotation.y = Math.PI;
  pivot.add(ring);
  const center = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.11, 16), new THREE.MeshBasicMaterial({ color: 0x191915 }));
  center.position.set(0, 0.84, -0.025);
  center.rotation.y = Math.PI;
  pivot.add(center);
  // face toward +Z, so flip meshes around y while plate circle faces -Z; better build facing +Z:
  plate.rotation.set(0, 0, 0);
  ring.rotation.set(0, 0, 0);
  center.rotation.set(0, 0, 0);
  plate.position.z = 0.025;
  ring.position.z = 0.028;
  center.position.z = 0.030;
  // springs
  const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 6, 1, true), steelDark);
  spring.position.set(0.18, 0.16, 0.08);
  group.add(spring);

  const target = {
    id, kind: 'popup', label: 'HOSTILE', distance, group, hitMesh: plate, points: 250, up: false, hits: 0,
    center: new THREE.Vector3(x, 1.1, z + 0.06),
    angle: -Math.PI / 2, targetAngle: -Math.PI / 2,
    hit() { this.hits++; this.flash = 0.13; this.up = false; this.targetAngle = -Math.PI / 2; },
    raise() { this.up = true; this.targetAngle = 0; },
    update(dt) {
      this.angle += (this.targetAngle - this.angle) * Math.min(1, dt * 10);
      pivot.rotation.x = this.angle;
      if (this.flash > 0) {
        this.flash -= dt;
        plate.material.emissive.setHex(0xff8530);
        plate.material.emissiveIntensity = Math.max(0, this.flash * 9);
      } else plate.material.emissiveIntensity = 0;
    },
    reset() { this.up = false; this.angle = -Math.PI / 2; this.targetAngle = -Math.PI / 2; this.hits = 0; },
  };
  plate.userData.target = target;
  group.userData.target = target;
  return target;
}
