// ══════════════════════════════════════════════════════════════════════════════
//  WORLD.JS — Immersive 3D journey engine for Ponmudi M R's portfolio
//  Vanilla Three.js (ESM via import map). No build step.
//  Each portfolio section becomes a zone in a surreal floating archipelago.
//  Camera flies through the world as the page scrolls.
// ══════════════════════════════════════════════════════════════════════════════
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ── CAPABILITY DETECTION ────────────────────────────────────────────────────────
// Decide whether this device gets the full 3D world or the lightweight fallback.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(pointer: coarse)').matches;
const lowMemory     = (navigator.deviceMemory && navigator.deviceMemory <= 2);
const smallScreen   = innerWidth < 900;

function hasWebGL(){
  try{
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  }catch(e){ return false; }
}

const FULL_3D = hasWebGL() && !reducedMotion && !coarsePointer && !smallScreen && !lowMemory;
// Bloom + denser geometry only on clearly capable machines.
const HIGH_END = FULL_3D && (navigator.hardwareConcurrency ? navigator.hardwareConcurrency >= 8 : true)
                          && (navigator.deviceMemory ? navigator.deviceMemory >= 8 : true);

document.body.classList.add('immersive');
if(!FULL_3D){
  // Fallback: animated CSS aurora world + the enhanced 2D layout. No WebGL.
  document.body.classList.add('immersive-fallback');
  const loader = document.getElementById('world-loader');
  if(loader) loader.classList.add('hidden');
  // Light parallax of the aurora to mouse on devices with a fine pointer.
  if(!coarsePointer && !reducedMotion){
    addEventListener('pointermove', e=>{
      const x = (e.clientX/innerWidth - .5);
      const y = (e.clientY/innerHeight - .5);
      document.documentElement.style.setProperty('--aurora-x', (x*-30)+'px');
      document.documentElement.style.setProperty('--aurora-y', (y*-30)+'px');
    }, {passive:true});
  }
} else {
  bootWorld();
}

// ── MAIN ENGINE ──────────────────────────────────────────────────────────────────
function bootWorld(){
  const canvas = document.getElementById('world-canvas');
  document.body.classList.add('immersive-3d');

  // Seeded RNG so the world is the same on every load (composition stays "designed").
  let _seed = 1337;
  const rng = ()=>{ _seed = (_seed*1664525 + 1013904223) % 4294967296; return _seed/4294967296; };
  const rand = (a,b)=> a + (b-a)*rng();

  // ── RENDERER ────────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:HIGH_END, powerPreference:'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, HIGH_END ? 2 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 2200);
  camera.position.set(0, 8, 40);

  // ── MOOD / PALETTE ──────────────────────────────────────────────────────────
  // Two world moods, toggled by the theme button: NIGHT (default) and DAWN.
  const MOODS = {
    night: { sky:0x0a0a1f, horizon:0x1a1140, fog:0x0c1030, sun:0x6d8bff, sunInt:1.4, amb:0x202850, ambInt:.6, exposure:1.1 },
    dawn:  { sky:0x1b1330, horizon:0x4a2a55, fog:0x2a1d44, sun:0xffb56b, sunInt:1.8, amb:0x40304a, ambInt:.8, exposure:1.25 },
  };
  let mood = MOODS.night;

  scene.fog = new THREE.FogExp2(mood.fog, 0.0019);
  scene.background = new THREE.Color(mood.sky);

  // Gradient sky dome (cheap volumetric-ish backdrop via vertex-position shader).
  const skyGeo = new THREE.SphereGeometry(1600, 32, 16);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite:false,
    uniforms:{ top:{value:new THREE.Color(mood.sky)}, bottom:{value:new THREE.Color(mood.horizon)}, off:{value:400} },
    vertexShader:`varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`varying vec3 vP; uniform vec3 top; uniform vec3 bottom; uniform float off;
      void main(){ float h=normalize(vP).y; float t=clamp((h*off+off)/(2.0*off),0.0,1.0); gl_FragColor=vec4(mix(bottom,top,t),1.0);}`
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // ── LIGHTS ──────────────────────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(mood.amb, mood.ambInt);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(mood.sun, mood.sunInt);
  sun.position.set(-60, 120, 40);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xff5fae, 0.5); // pink rim from behind
  rim.position.set(40, 20, -120);
  scene.add(rim);
  // A travelling accent light that picks up the current zone's colour.
  const accent = new THREE.PointLight(0x5bd6ff, 2.2, 320, 1.8);
  scene.add(accent);
  let accentTargetColor = new THREE.Color(0x5bd6ff);

  // ── ZONE LAYOUT ───────────────────────────────────────────────────────────────
  // One zone per portfolio section, strung along -Z. The camera weaves between them.
  const ZONES = [
    { id:'hero',     z:   0, color:0x5bd6ff, label:'ARRIVAL'     },
    { id:'about',    z:-150, color:0x8a6bff, label:'ORIGIN'      },
    { id:'skills',   z:-320, color:0x3df0c5, label:'ARSENAL'     },
    { id:'projects', z:-500, color:0xff7a59, label:'LANDMARKS'   },
    { id:'certs',    z:-680, color:0xffd166, label:'CREDENTIALS' },
    { id:'resume',   z:-840, color:0x6d8bff, label:'DOSSIER'     },
    { id:'contact',  z:-1000,color:0xff4fa3, label:'THE PORTAL'  },
  ];

  // Camera keyframes — position + look target, offset to the side of each zone so
  // landmarks sweep past in parallax rather than coming straight at the lens.
  const camKeys = ZONES.map((zoneItem, i)=>{
    const side = i % 2 === 0 ? 1 : -1;
    return {
      pos:  new THREE.Vector3(side * (i===0?0:18), 7 + Math.sin(i)*3, zoneItem.z + 46),
      look: new THREE.Vector3(side * 4, 5, zoneItem.z - 30),
    };
  });
  const posCurve  = new THREE.CatmullRomCurve3(camKeys.map(k=>k.pos),  false, 'catmullrom', 0.5);
  const lookCurve = new THREE.CatmullRomCurve3(camKeys.map(k=>k.look), false, 'catmullrom', 0.5);

  // ── MATERIAL HELPERS ──────────────────────────────────────────────────────────
  const rockMat = (c)=> new THREE.MeshStandardMaterial({ color:c, flatShading:true, roughness:.95, metalness:.05 });
  const glowMat = (c, inten=2)=> new THREE.MeshStandardMaterial({
    color:c, emissive:c, emissiveIntensity:inten, roughness:.3, metalness:.1, flatShading:true });

  const animated = []; // objects with a custom per-frame update {obj, fn}

  // ── STARFIELD ───────────────────────────────────────────────────────────────────
  (function stars(){
    const N = HIGH_END ? 2600 : 1400;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(N*3);
    for(let i=0;i<N;i++){
      const r = rand(400,1500), th = rand(0,Math.PI*2), ph = Math.acos(rand(-1,1));
      pos[i*3]   = r*Math.sin(ph)*Math.cos(th);
      pos[i*3+1] = Math.abs(r*Math.cos(ph))*0.7 + 20;
      pos[i*3+2] = r*Math.sin(ph)*Math.sin(th) - 400;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const m = new THREE.PointsMaterial({ color:0xbcd2ff, size:1.6, sizeAttenuation:true, transparent:true, opacity:.9, depthWrite:false });
    const pts = new THREE.Points(g,m);
    scene.add(pts);
    animated.push({obj:pts, fn:(t)=>{ m.opacity = .6 + 0.35*Math.sin(t*0.8); }});
  })();

  // ── FLOATING DUST / SPARK FIELD (parallax depth) ─────────────────────────────────
  (function dust(){
    const N = HIGH_END ? 900 : 450;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(N*3);
    for(let i=0;i<N;i++){
      pos[i*3]   = rand(-160,160);
      pos[i*3+1] = rand(-30,80);
      pos[i*3+2] = rand(80,-1100);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const m = new THREE.PointsMaterial({ color:0x8fb6ff, size:.9, transparent:true, opacity:.5,
      blending:THREE.AdditiveBlending, depthWrite:false });
    const pts = new THREE.Points(g,m);
    scene.add(pts);
    animated.push({obj:pts, fn:(t)=>{ pts.rotation.y = t*0.01; pts.position.y = Math.sin(t*0.3)*1.5; }});
  })();

  // ── DISTANT MOUNTAIN RIDGES (silhouette, scale & depth) ──────────────────────────
  function mountainRange(zCenter, baseColor){
    const grp = new THREE.Group();
    const layers = [ {z:-260, h:160, w:900, c:0x141833, n:5},
                     {z:-160, h:110, w:760, c:0x1b2147, n:6},
                     {z:-80,  h:70,  w:620, c:0x232a5c, n:7} ];
    layers.forEach(L=>{
      for(let i=0;i<L.n;i++){
        const h = L.h * rand(.6,1.1);
        const geo = new THREE.ConeGeometry(L.w/L.n*rand(.7,1.1), h, 4, 1);
        const m = new THREE.MeshStandardMaterial({ color:L.c, flatShading:true, roughness:1, metalness:0 });
        const peak = new THREE.Mesh(geo,m);
        peak.rotation.y = rand(0,Math.PI);
        peak.position.set((i-L.n/2)*(L.w/L.n) + rand(-30,30), h/2 - 40, zCenter + L.z + rand(-30,30));
        grp.add(peak);
      }
    });
    scene.add(grp);
    return grp;
  }
  mountainRange(-120, 0x141833);
  mountainRange(-620, 0x161a3a);

  // ── FLOATING ISLAND (low-poly rock chunk with glowing underside) ─────────────────
  function floatingIsland(x,y,z,scale,color){
    const grp = new THREE.Group();
    const top = new THREE.Mesh(new THREE.IcosahedronGeometry(scale,1), rockMat(0x2a2f55));
    top.scale.y = .5; grp.add(top);
    const base = new THREE.Mesh(new THREE.ConeGeometry(scale*.9, scale*1.8, 6, 1), rockMat(0x1d2142));
    base.position.y = -scale*1.0; base.rotation.y = rand(0,3); grp.add(base);
    // glowing crystal vein on the underside
    const vein = new THREE.Mesh(new THREE.IcosahedronGeometry(scale*.35,0), glowMat(color,2.4));
    vein.position.y = -scale*1.4; grp.add(vein);
    grp.position.set(x,y,z);
    const phase = rand(0,6.28), amp = rand(1.2,2.6), spin = rand(-.05,.05);
    scene.add(grp);
    animated.push({obj:grp, fn:(t)=>{ grp.position.y = y + Math.sin(t*0.5+phase)*amp; grp.rotation.y += spin*0.02; }});
    return grp;
  }

  // ── CRYSTAL CLUSTER (emissive spires that pulse) ─────────────────────────────────
  function crystalCluster(x,y,z,color,count=5){
    const grp = new THREE.Group();
    for(let i=0;i<count;i++){
      const h = rand(6,16);
      const c = new THREE.Mesh(new THREE.ConeGeometry(rand(1,2.4), h, 5, 1), glowMat(color, rand(1.6,3)));
      c.position.set(rand(-6,6), h/2, rand(-6,6));
      c.rotation.set(rand(-.2,.2), rand(0,3), rand(-.2,.2));
      grp.add(c);
    }
    grp.position.set(x,y,z);
    scene.add(grp);
    const phase = rand(0,6.28);
    animated.push({obj:grp, fn:(t)=>{ const p=.6+.4*Math.sin(t*1.5+phase);
      grp.children.forEach(ch=>ch.material.emissiveIntensity = 1.4 + p*1.4); }});
    return grp;
  }

  // ── ENERGY ORB (additive glow sprite + halo) ─────────────────────────────────────
  const orbTex = (function(){
    const c = document.createElement('canvas'); c.width=c.height=128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64,64,0,64,64,64);
    grad.addColorStop(0,'rgba(255,255,255,1)');
    grad.addColorStop(.25,'rgba(255,255,255,.8)');
    grad.addColorStop(.6,'rgba(160,200,255,.25)');
    grad.addColorStop(1,'rgba(160,200,255,0)');
    g.fillStyle=grad; g.fillRect(0,0,128,128);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
  })();
  function energyOrb(x,y,z,color,size=6){
    const mat = new THREE.SpriteMaterial({ map:orbTex, color, blending:THREE.AdditiveBlending, depthWrite:false, transparent:true });
    const s = new THREE.Sprite(mat); s.scale.set(size,size,1); s.position.set(x,y,z);
    scene.add(s);
    const phase=rand(0,6.28), amp=rand(2,5);
    animated.push({obj:s, fn:(t)=>{ s.position.y = y + Math.sin(t*0.7+phase)*amp;
      const p=.8+.5*Math.sin(t*2+phase); s.scale.set(size*p,size*p,1); }});
    return s;
  }

  // ── PATROLLING DRONE (small craft with blinking beacon) ──────────────────────────
  function drone(cx,cy,cz,radius,color){
    const grp = new THREE.Group();
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(1.1,0),
      new THREE.MeshStandardMaterial({color:0x3a3f66, metalness:.7, roughness:.3, flatShading:true}));
    grp.add(body);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2,.12,8,24), glowMat(color,2.5));
    ring.rotation.x = Math.PI/2; grp.add(ring);
    const beacon = new THREE.PointLight(color, 1.5, 40); grp.add(beacon);
    scene.add(grp);
    const speed = rand(.2,.45), phase = rand(0,6.28), tilt = rand(.1,.4);
    animated.push({obj:grp, fn:(t)=>{
      const a = t*speed + phase;
      grp.position.set(cx + Math.cos(a)*radius, cy + Math.sin(a*2)*3, cz + Math.sin(a)*radius);
      grp.rotation.y = -a; grp.rotation.z = Math.sin(a)*tilt;
      ring.rotation.z += 0.08;
      beacon.intensity = 1 + Math.abs(Math.sin(t*4))*2;
    }});
    return grp;
  }

  // ── DIGITAL FOREST (instanced glowing pines) ────────────────────────────────────
  function digitalForest(zCenter, color, count){
    const geo = new THREE.ConeGeometry(1.6, 9, 6, 1);
    const mat = new THREE.MeshStandardMaterial({ color:0x14352e, emissive:color, emissiveIntensity:.5, flatShading:true, roughness:.8 });
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    const d = new THREE.Object3D();
    for(let i=0;i<count;i++){
      const s = rand(.6,1.6);
      d.position.set(rand(-90,90), 4.5*s - 6, zCenter + rand(-90,90));
      d.scale.set(s,s,s); d.rotation.y = rand(0,3);
      d.updateMatrix(); mesh.setMatrixAt(i, d.matrix);
    }
    scene.add(mesh);
    return mesh;
  }

  // ── GROUND HAZE PLANES (glowing valley floor) ───────────────────────────────────
  function valleyFloor(z, color){
    const m = new THREE.Mesh(new THREE.PlaneGeometry(700,700,1,1),
      new THREE.MeshBasicMaterial({ color, transparent:true, opacity:.06, blending:THREE.AdditiveBlending, depthWrite:false }));
    m.rotation.x = -Math.PI/2; m.position.set(0,-38,z); scene.add(m);
  }

  // ── PORTAL (contact / command center) ────────────────────────────────────────────
  function portal(x,y,z,color){
    const grp = new THREE.Group();
    for(let i=0;i<4;i++){
      const r = 14 - i*2.4;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r,.4,12,48), glowMat(color, 2.4 - i*.3));
      ring.position.z = -i*2; grp.add(ring);
      animated.push({obj:ring, fn:(t)=>{ ring.rotation.z = t*(.2 + i*.12)*(i%2?1:-1); }});
    }
    const core = new THREE.Mesh(new THREE.CircleGeometry(11,48),
      new THREE.MeshBasicMaterial({ color, transparent:true, opacity:.18, blending:THREE.AdditiveBlending, side:THREE.DoubleSide, depthWrite:false }));
    grp.add(core);
    grp.position.set(x,y,z);
    scene.add(grp);
    energyOrb(x,y,z+2,color,10);
    return grp;
  }

  // ── CENTRAL MONUMENT (hero arrival landmark) ─────────────────────────────────────
  function heroMonument(){
    const grp = new THREE.Group();
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(9,0), glowMat(0x5bd6ff,2.2));
    shard.scale.y = 1.8; grp.add(shard);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(16,.3,12,64), glowMat(0x8a6bff,2));
    halo.rotation.x = Math.PI/2.2; grp.add(halo);
    grp.position.set(0,6,-30);
    scene.add(grp);
    animated.push({obj:grp, fn:(t)=>{ shard.rotation.y = t*0.3; halo.rotation.z = t*0.4;
      shard.position.y = Math.sin(t*0.6)*1.2; }});
    return grp;
  }

  // ══ POPULATE EACH ZONE ══════════════════════════════════════════════════════════
  heroMonument();
  for(let k=0;k<6;k++) energyOrb(rand(-40,40), rand(2,30), rand(10,-60), 0x7fb4ff, rand(3,6));
  drone(0,18,-20,26,0x5bd6ff); drone(-20,12,-40,18,0x8a6bff);

  // ABOUT — origin island with floating memory shards
  floatingIsland(-14,4,-150,9,0x8a6bff);
  floatingIsland(20,12,-185,6,0x5bd6ff);
  crystalCluster(-10,-12,-150,0x8a6bff,5);
  for(let k=0;k<4;k++) energyOrb(rand(-30,30),rand(8,28),-150+rand(-30,30),0x8a6bff,rand(3,5));

  // SKILLS — technology monoliths (one cluster of spires per zone, dense & glowing)
  digitalForest(-320,0x3df0c5,HIGH_END?70:35);
  for(let k=0;k<6;k++){
    const ang = k/6*Math.PI*2;
    crystalCluster(Math.cos(ang)*34, -6, -320+Math.sin(ang)*34, 0x3df0c5, 4);
  }
  floatingIsland(0,16,-320,11,0x3df0c5);
  drone(0,20,-320,40,0x3df0c5);
  valleyFloor(-320,0x3df0c5);

  // PROJECTS — discoverable landmark structures
  [[-26,2,-470,0xff7a59],[22,8,-510,0xffd166],[-8,18,-540,0xff7a59],[14,-4,-485,0xff5fae]].forEach(p=>{
    floatingIsland(p[0],p[1],p[2],rand(6,10),p[3]);
    crystalCluster(p[0],p[1]-14,p[2],p[3],5);
  });
  for(let k=0;k<6;k++) energyOrb(rand(-40,40),rand(4,30),-500+rand(-50,50),0xff9a59,rand(3,6));
  drone(0,16,-500,46,0xff7a59);

  // CERTS — hall of glowing credential tablets (floating islands in a ring)
  for(let k=0;k<7;k++){
    const ang = k/7*Math.PI*2;
    floatingIsland(Math.cos(ang)*40, rand(0,18), -680+Math.sin(ang)*40, rand(4,6), 0xffd166);
  }
  crystalCluster(0,-10,-680,0xffd166,6);
  valleyFloor(-680,0xffd166);
  drone(0,22,-680,38,0xffd166);

  // RESUME — monolith dossier
  floatingIsland(0,8,-840,12,0x6d8bff);
  crystalCluster(-12,-8,-840,0x6d8bff,5); crystalCluster(12,-8,-840,0x6d8bff,5);
  for(let k=0;k<4;k++) energyOrb(rand(-26,26),rand(6,26),-840+rand(-20,20),0x6d8bff,rand(3,5));

  // CONTACT — the portal / command center
  portal(0,8,-1010,0xff4fa3);
  digitalForest(-1000,0xff4fa3,HIGH_END?50:25);
  for(let k=0;k<8;k++) energyOrb(rand(-50,50),rand(2,34),-1000+rand(-40,40),0xff4fa3,rand(3,6));
  drone(0,20,-1000,50,0xff4fa3); drone(20,12,-1000,30,0x8a6bff);

  // ── POST-PROCESSING (bloom) ──────────────────────────────────────────────────────
  let composer = null;
  if(HIGH_END){
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.85, 0.6, 0.55);
    composer.addPass(bloom);
  }

  // ── SCROLL → CAMERA PROGRESS ──────────────────────────────────────────────────────
  let targetProgress = 0, progress = 0;
  function computeProgress(){
    const max = document.documentElement.scrollHeight - innerHeight;
    targetProgress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  }
  addEventListener('scroll', computeProgress, {passive:true});
  computeProgress();

  // ── MOUSE PARALLAX ────────────────────────────────────────────────────────────────
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', e=>{
    tmx = (e.clientX/innerWidth - .5);
    tmy = (e.clientY/innerHeight - .5);
  }, {passive:true});

  // ── PER-ZONE MOOD (lighting + accent colour shift via IntersectionObserver) ─────────
  const sections = ZONES.map(zoneItem=>document.getElementById(zoneItem.id));
  const labelEl = document.getElementById('zone-name');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const zoneItem = ZONES.find(z=>z.id===en.target.id);
        if(zoneItem){
          accentTargetColor.setHex(zoneItem.color);
          if(labelEl) labelEl.textContent = zoneItem.label;
          document.documentElement.style.setProperty('--zone-accent', '#'+zoneItem.color.toString(16).padStart(6,'0'));
        }
      }
    });
  }, {threshold:.4});
  sections.forEach(s=>s && obs.observe(s));

  // ── WORLD MOOD TOGGLE (repurpose the theme button: night ↔ dawn) ────────────────────
  const themeBtn = document.getElementById('theme-btn');
  if(themeBtn){
    themeBtn.title = 'Toggle world ambiance';
    themeBtn.addEventListener('click', ()=>{
      mood = (mood === MOODS.night) ? MOODS.dawn : MOODS.night;
    });
  }
  // Smoothly lerp scene colours toward the active mood every frame.
  const _sky=new THREE.Color(), _hor=new THREE.Color(), _fog=new THREE.Color(),
        _amb=new THREE.Color(), _sun=new THREE.Color();
  function applyMood(dt){
    const s = Math.min(1, dt*1.5);
    skyMat.uniforms.top.value.lerp(_sky.setHex(mood.sky), s);
    skyMat.uniforms.bottom.value.lerp(_hor.setHex(mood.horizon), s);
    scene.fog.color.lerp(_fog.setHex(mood.fog), s);
    scene.background.copy(skyMat.uniforms.top.value);
    ambient.color.lerp(_amb.setHex(mood.amb), s); ambient.intensity += (mood.ambInt-ambient.intensity)*s;
    sun.color.lerp(_sun.setHex(mood.sun), s); sun.intensity += (mood.sunInt-sun.intensity)*s;
    renderer.toneMappingExposure += (mood.exposure-renderer.toneMappingExposure)*s;
  }

  // ── RESIZE ──────────────────────────────────────────────────────────────────────
  addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    if(composer) composer.setSize(innerWidth, innerHeight);
    computeProgress();
  });

  // ── HIDE LOADER ONCE READY ────────────────────────────────────────────────────────
  function hideLoader(){
    const loader = document.getElementById('world-loader');
    if(loader){ loader.classList.add('hidden'); setTimeout(()=>loader.remove(), 900); }
  }

  // ── RENDER LOOP ───────────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  let firstFrame = true;
  function tick(){
    const dt = Math.min(clock.getDelta(), .05);
    const t = clock.elapsedTime;

    // ease scroll progress & mouse for a cinematic, weighty feel
    progress += (targetProgress - progress) * Math.min(1, dt*3.5);
    mx += (tmx - mx) * Math.min(1, dt*3);
    my += (tmy - my) * Math.min(1, dt*3);

    // camera follows the authored curve, with mouse parallax layered on top
    posCurve.getPointAt(progress, camPos);
    lookCurve.getPointAt(Math.min(1, progress+0.02), camLook);
    camera.position.set(camPos.x + mx*10, camPos.y - my*6, camPos.z);
    camera.lookAt(camLook.x + mx*6, camLook.y - my*4, camLook.z);

    // travelling accent light tracks the camera & current zone colour
    accent.position.set(camPos.x, camPos.y+6, camPos.z-40);
    accent.color.lerp(accentTargetColor, Math.min(1, dt*2));

    for(let i=0;i<animated.length;i++) animated[i].fn(t, dt);
    applyMood(dt);

    if(composer) composer.render(); else renderer.render(scene, camera);

    if(firstFrame){ firstFrame=false; hideLoader(); }
    if(running) rafId = requestAnimationFrame(tick);
  }
  let running = true, rafId = requestAnimationFrame(tick);

  // Pause the render loop entirely when the tab is hidden (battery / perf).
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ running = false; cancelAnimationFrame(rafId); }
    else if(!running){ running = true; clock.getDelta(); rafId = requestAnimationFrame(tick); }
  });
}
