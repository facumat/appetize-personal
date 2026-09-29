// Generates the Loafy mascot Lottie animations into assets/lottie.
// Run with: node scripts/generate-loafy.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'lottie');
const FPS = 30;
const SIZE = 400;

const hex = (h, a = 1) => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
  a,
];

const C = {
  crust: hex('#B8662B'),
  crustDark: hex('#8A4516'),
  crumb: hex('#FBE3B4'),
  crumbLight: hex('#FFF1D6'),
  eye: hex('#3B2314'),
  white: hex('#FFFFFF'),
  cheek: hex('#F59A8B'),
  mouth: hex('#7A2E1C'),
  tongue: hex('#F0766A'),
  shadow: hex('#3B2314', 0.18),
  sparkle: hex('#F5B83D'),
  sparkleAlt: hex('#F07C5A'),
  bubble: hex('#FFFFFF', 0.9),
};

// ---- property helpers ----
const val = (k) => ({ a: 0, k });
const ease = { i: { x: [0.42], y: [1] }, o: { x: [0.58], y: [0] } };
/** Animated property from [[frame, value], ...]. Scalars are wrapped as arrays. */
const anim = (frames) => ({
  a: 1,
  k: frames.map(([t, v], idx) => {
    const s = Array.isArray(v) ? v : [v];
    return idx === frames.length - 1 ? { t, s } : { t, s, ...ease };
  }),
});

const tr = (o = {}) => ({
  ty: 'tr',
  p: val(o.p ?? [0, 0]),
  a: val(o.a ?? [0, 0]),
  s: o.s ?? val([100, 100]),
  r: o.r ?? val(0),
  o: o.o ?? val(100),
  sk: val(0),
  sa: val(0),
});
const fill = (c) => ({ ty: 'fl', c: val([c[0], c[1], c[2], 1]), o: val(c[3] * 100), r: 1 });
const stroke = (c, w) => ({ ty: 'st', c: val(c), o: val(100), w: val(w), lc: 2, lj: 2 });
const ellipse = (p, s) => ({ ty: 'el', d: 1, p: val(p), s: val(s) });
const rect = (p, s, r) => ({ ty: 'rc', d: 1, p: val(p), s: val(s), r: val(r) });
/** Bezier path. Points are [x, y, inX, inY, outX, outY] with tangents relative to the vertex. */
const path = (pts, closed = false) => ({
  ty: 'sh',
  d: 1,
  ks: val({
    c: closed,
    v: pts.map((p) => [p[0], p[1]]),
    i: pts.map((p) => [p[2] ?? 0, p[3] ?? 0]),
    o: pts.map((p) => [p[4] ?? 0, p[5] ?? 0]),
  }),
});
const group = (nm, items, t = {}) => ({ ty: 'gr', nm, it: [...items, tr(t)] });

let nextInd = 1;
const layer = (nm, shapes, ks = {}, extra = {}) => ({
  ddd: 0,
  ind: nextInd++,
  ty: 4,
  nm,
  sr: 1,
  ao: 0,
  bm: 0,
  ip: 0,
  op: 9999,
  st: 0,
  ks: {
    o: ks.o ?? val(100),
    r: ks.r ?? val(0),
    p: ks.p ?? val([0, 0, 0]),
    a: ks.a ?? val([0, 0, 0]),
    s: ks.s ?? val([100, 100, 100]),
  },
  shapes,
  ...extra,
});

// ---- Loafy parts (body space: origin at bottom-center of the loaf) ----
const bodyShapes = () => [
  group('crumb-shine', [ellipse([-62, -176], [34, 18]), fill(C.crumbLight)]),
  group('crumb', [
    ellipse([-52, -160], [128, 104]),
    ellipse([52, -160], [128, 104]),
    rect([0, -82], [180, 152], 26),
    fill(C.crumb),
  ]),
  group('crust-shade', [rect([0, -12], [204, 24], 12), fill(C.crustDark)]),
  group('crust', [
    ellipse([-54, -162], [150, 124]),
    ellipse([54, -162], [150, 124]),
    rect([0, -85], [204, 170], 34),
    fill(C.crust),
  ]),
];

const feetLayer = (parent) =>
  layer(
    'feet',
    [
      group('feet', [ellipse([-42, 4], [46, 22]), ellipse([42, 4], [46, 22]), fill(C.crustDark)]),
    ],
    { p: val([0, 0, 0]) },
    { parent },
  );

const eyesLayer = (parent, blinkFrames = []) => {
  const eye = (x) =>
    group(`eye-${x}`, [
      group('glint', [ellipse([x + 5, -7], [9, 9]), fill(C.white)]),
      group('pupil', [ellipse([x, 0], [24, 30]), fill(C.eye)]),
    ]);
  const s = blinkFrames.length
    ? anim(
        blinkFrames.flatMap((f) => [
          [f, [100, 100, 100]],
          [f + 3, [100, 8, 100]],
          [f + 6, [100, 100, 100]],
        ]),
      )
    : val([100, 100, 100]);
  return layer('eyes', [eye(-36), eye(36)], { p: val([0, -112, 0]), s }, { parent });
};

const happyEyesLayer = (parent) =>
  layer(
    'happy-eyes',
    [
      group('arcs', [
        path([
          [-48, 4, 0, 0, 2, -12],
          [-36, -10, -7, 0, 7, 0],
          [-24, 4, -2, -12, 0, 0],
        ]),
        path([
          [24, 4, 0, 0, 2, -12],
          [36, -10, -7, 0, 7, 0],
          [48, 4, -2, -12, 0, 0],
        ]),
        stroke(C.eye, 7),
      ]),
    ],
    { p: val([0, -112, 0]) },
    { parent },
  );

const cheeksLayer = (parent) =>
  layer(
    'cheeks',
    [group('cheeks', [ellipse([-62, 0], [28, 16]), ellipse([62, 0], [28, 16]), fill(C.cheek)])],
    { p: val([0, -86, 0]), o: val(70) },
    { parent },
  );

const smileLayer = (parent) =>
  layer(
    'smile',
    [
      group('smile', [
        path([
          [-16, 0, 0, 0, 4, 14],
          [16, 0, -4, 14, 0, 0],
        ]),
        stroke(C.mouth, 6),
      ]),
    ],
    { p: val([0, -86, 0]) },
    { parent },
  );

const openMouthLayer = (parent) =>
  layer(
    'open-mouth',
    [
      group('tongue', [ellipse([0, 14], [16, 9]), fill(C.tongue)]),
      group('mouth', [
        path(
          [
            [-20, -2, 0, 0, 0, 0],
            [20, -2, 0, 0, 0, 24],
            [0, 22, 12, 0, -12, 0],
            [-20, -2, 0, 24, 0, 0],
          ],
          true,
        ),
        fill(C.mouth),
      ]),
    ],
    { p: val([0, -88, 0]) },
    { parent },
  );

/** Arm hanging from a shoulder; side is -1 (left) or 1 (right). */
const armLayer = (parent, side, r, pose = 'down') => {
  const end = pose === 'up' ? [side * 30, -34] : [side * 22, 32];
  return layer(
    `arm-${side < 0 ? 'left' : 'right'}`,
    [
      group('hand', [ellipse(end, [22, 22]), fill(C.crustDark)]),
      group('arm', [path([[0, 0], end]), stroke(C.crust, 14)]),
    ],
    { p: val([side * 98, -70, 0]), r: r ?? val(0) },
    { parent },
  );
};

const shadowLayer = (s) =>
  layer('shadow', [group('shadow', [ellipse([0, 0], [210, 30]), fill(C.shadow)])], {
    p: val([200, 330, 0]),
    s,
  });

/** 4-point star sparkle that pops at `start`. */
const sparkleLayer = (x, y, start, color, size = 1) => {
  const r = 18 * size;
  const k = 5 * size;
  return layer(
    'sparkle',
    [
      group('star', [
        path(
          [
            [0, -r],
            [k, -k],
            [r, 0],
            [k, k],
            [0, r],
            [-k, k],
            [-r, 0],
            [-k, -k],
          ],
          true,
        ),
        fill(color),
      ]),
    ],
    {
      p: val([x, y, 0]),
      s: anim([
        [start, [0, 0, 100]],
        [start + 8, [110, 110, 100]],
        [start + 20, [0, 0, 100]],
      ]),
      r: anim([
        [start, 0],
        [start + 20, 90],
      ]),
    },
  );
};

const bubbleLayer = (x, start, dur, size) =>
  layer('bubble', [group('bubble', [ellipse([0, 0], [size, size]), fill(C.bubble)])], {
    p: anim([
      [start, [x, 250, 0]],
      [start + dur, [x + 10, 40, 0]],
    ]),
    o: anim([
      [start, 0],
      [start + 6, 90],
      [start + dur - 8, 90],
      [start + dur, 0],
    ]),
    s: anim([
      [start, [40, 40, 100]],
      [start + dur, [120, 120, 100]],
    ]),
  });

const composition = (nm, op, layers) => ({
  v: '5.7.4',
  fr: FPS,
  ip: 0,
  op,
  w: SIZE,
  h: SIZE,
  nm,
  ddd: 0,
  assets: [],
  markers: [],
  layers: layers.map((l) => ({ ...l, op })),
});

/** Builds a Loafy with a body layer and its parented parts. Returns layers top-first. */
const loafy = ({ bodyKs, face, arms }) => {
  nextInd = 1;
  const body = layer('body', bodyShapes(), bodyKs);
  const faceLayers = face(body.ind);
  const armLayers = arms(body.ind);
  const feet = feetLayer(body.ind);
  return [...faceLayers, ...armLayers, body, feet];
};

const bob = (op, amp = 6) =>
  anim([
    [0, [200, 330, 0]],
    [op / 2, [200, 330 - amp, 0]],
    [op, [200, 330, 0]],
  ]);
const breathe = (op, amt = 3) =>
  anim([
    [0, [100, 100, 100]],
    [op / 2, [100 - amt / 2, 100 + amt, 100]],
    [op, [100, 100, 100]],
  ]);
const shadowPulse = (op) =>
  anim([
    [0, [100, 100, 100]],
    [op / 2, [92, 92, 100]],
    [op, [100, 100, 100]],
  ]);

// ---- animations ----
const idle = () => {
  const op = 90;
  const parts = loafy({
    bodyKs: { p: bob(op), s: breathe(op) },
    face: (p) => [eyesLayer(p, [58]), cheeksLayer(p), smileLayer(p)],
    arms: (p) => [armLayer(p, -1), armLayer(p, 1)],
  });
  return composition('loafy-idle', op, [...parts, shadowLayer(shadowPulse(op))]);
};

const wave = () => {
  const op = 60;
  const parts = loafy({
    bodyKs: {
      p: bob(op, 4),
      r: anim([
        [0, -2],
        [30, 2],
        [60, -2],
      ]),
    },
    face: (p) => [eyesLayer(p, [40]), cheeksLayer(p), openMouthLayer(p)],
    arms: (p) => [
      armLayer(p, -1),
      armLayer(
        p,
        1,
        anim([
          [0, -10],
          [10, 25],
          [20, -10],
          [30, 25],
          [40, -10],
          [60, -10],
        ]),
        'up',
      ),
    ],
  });
  return composition('loafy-wave', op, [...parts, shadowLayer(shadowPulse(op))]);
};

const celebrate = () => {
  const op = 60;
  const parts = loafy({
    bodyKs: {
      p: anim([
        [0, [200, 330, 0]],
        [6, [200, 334, 0]],
        [20, [200, 280, 0]],
        [34, [200, 330, 0]],
        [40, [200, 333, 0]],
        [60, [200, 330, 0]],
      ]),
      s: anim([
        [0, [100, 100, 100]],
        [6, [108, 90, 100]],
        [14, [94, 108, 100]],
        [34, [100, 100, 100]],
        [38, [110, 88, 100]],
        [46, [100, 100, 100]],
        [60, [100, 100, 100]],
      ]),
    },
    face: (p) => [happyEyesLayer(p), cheeksLayer(p), openMouthLayer(p)],
    arms: (p) => [
      armLayer(
        p,
        -1,
        anim([
          [0, 0],
          [20, -25],
          [34, 0],
          [60, 0],
        ]),
        'up',
      ),
      armLayer(
        p,
        1,
        anim([
          [0, 0],
          [20, 25],
          [34, 0],
          [60, 0],
        ]),
        'up',
      ),
    ],
  });
  const sparkles = [
    sparkleLayer(80, 110, 14, C.sparkle, 1.2),
    sparkleLayer(320, 90, 18, C.sparkleAlt, 1),
    sparkleLayer(60, 230, 24, C.sparkleAlt, 0.8),
    sparkleLayer(340, 210, 22, C.sparkle, 0.9),
    sparkleLayer(200, 40, 28, C.sparkle, 0.7),
  ];
  const shadow = shadowLayer(
    anim([
      [0, [100, 100, 100]],
      [20, [70, 70, 100]],
      [34, [100, 100, 100]],
      [60, [100, 100, 100]],
    ]),
  );
  return composition('loafy-celebrate', op, [...sparkles, ...parts, shadow]);
};

// Loafy rising like proofing dough, used on loading screens.
const proofing = () => {
  const op = 90;
  const parts = loafy({
    bodyKs: {
      p: val([200, 330, 0]),
      s: anim([
        [0, [100, 100, 100]],
        [45, [106, 112, 100]],
        [90, [100, 100, 100]],
      ]),
    },
    face: (p) => [happyEyesLayer(p), cheeksLayer(p), smileLayer(p)],
    arms: (p) => [armLayer(p, -1), armLayer(p, 1)],
  });
  const bubbles = [
    bubbleLayer(90, 0, 60, 20),
    bubbleLayer(300, 20, 60, 16),
    bubbleLayer(130, 40, 50, 12),
    bubbleLayer(270, 55, 35, 14),
  ];
  const shadow = shadowLayer(
    anim([
      [0, [100, 100, 100]],
      [45, [108, 100, 100]],
      [90, [100, 100, 100]],
    ]),
  );
  return composition('loafy-proofing', op, [...bubbles, ...parts, shadow]);
};

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, build] of Object.entries({ idle, wave, celebrate, proofing })) {
  const file = join(OUT_DIR, `loafy-${name}.json`);
  writeFileSync(file, JSON.stringify(build()));
  console.log(`wrote ${file}`);
}
