import * as THREE from 'three';
import { MAT, tacticalGloveHand, forearm, add } from './parts.js';

/**
 * Builds first-person arms in weapon-local space. The weapon points down -Z.
 * Hand anchors and elbow targets come from each weapon's metadata.
 */
export function buildArms(meta, opts = {}) {
  const g = new THREE.Group();
  g.name = 'arms';
  const h = meta.hands;
  if (!h) return g;
  const right = tacticalGloveHand('right', h.right.scale ?? 1, MAT.glove);
  right.position.set(...h.right.pos);
  right.rotation.set(...h.right.rot);
  g.add(right);

  const left = tacticalGloveHand('left', h.left.scale ?? 1, MAT.glove);
  left.position.set(...h.left.pos);
  left.rotation.set(...h.left.rot);
  g.add(left);

  // wrist points are slightly behind the palms so cuffs read correctly
  const wristR = new THREE.Vector3(...h.right.pos).add(new THREE.Vector3(0, -0.010, 0.030));
  const wristL = new THREE.Vector3(...h.left.pos).add(new THREE.Vector3(0, -0.010, 0.030));

  const elbowR = new THREE.Vector3(...h.elbowR);
  const elbowL = new THREE.Vector3(...h.elbowL);
  const armR = forearm('right', wristR.toArray(), elbowR.toArray(), 0.031);
  const armL = forearm('left', wristL.toArray(), elbowL.toArray(), 0.030);
  g.add(armR, armL);

  // shoulder/sleeve stubs to hide open ends behind the camera
  const stubR = forearm('right', elbowR.toArray(), [elbowR.x + 0.06, elbowR.y - 0.04, elbowR.z + 0.22], 0.042);
  const stubL = forearm('left', elbowL.toArray(), [elbowL.x - 0.05, elbowL.y - 0.05, elbowL.z + 0.22], 0.041);
  g.add(stubR, stubL);

  // tactical watch on the left wrist for a bit of character
  if (opts.watch !== false) {
    const watch = new THREE.Group();
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.019, 0.005, 5, 14), MAT.gloveDark);
    band.rotation.y = Math.PI / 2;
    band.position.set(0, 0, 0);
    watch.add(band);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.004, 14), MAT.gunmetal);
    face.rotation.z = Math.PI / 2;
    face.position.x = 0.020;
    watch.add(face);
    const screen = new THREE.Mesh(new THREE.CircleGeometry(0.009, 14), new THREE.MeshBasicMaterial({ color: 0x24362e }));
    screen.rotation.y = Math.PI / 2;
    screen.position.x = 0.023;
    watch.add(screen);
    watch.position.copy(wristL).lerp(elbowL, 0.18);
    watch.rotation.set(0, 0, 0.4);
    g.add(watch);
  }

  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
