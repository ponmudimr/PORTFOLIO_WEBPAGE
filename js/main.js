// ── DATA ─────────────────────────────────────────────────────────────────────
const SKILLS=[
  {icon:'⚙️',name:'C Programming',level:.9},
  {icon:'🤖',name:'Arduino',level:.88},
  {icon:'📟',name:'ESP32',level:.85},
  {icon:'🐧',name:'Linux',level:.8},
  {icon:'🔌',name:'Embedded Systems',level:.87},
  {icon:'🌐',name:'IoT',level:.82},
  {icon:'📡',name:'RF & SDR',level:.75},
  {icon:'🚁',name:'Drone Technology',level:.7},
  {icon:'💻',name:'Frontend Design',level:.72},
  {icon:'🐙',name:'Git & GitHub',level:.85},
];

const PROJECTS=[
  {
    id:'A',
    num:'PROJECT 01',
    title:'Autonomous Search & Intimation Drone for Navy and Army',
    tags:['Drone','Embedded','Defense','RF','Autonomous'],
    desc:'A fully autonomous UAV system designed for naval and army search-and-rescue operations in GPS-denied environments. The drone leverages SDR-based navigation, onboard computer vision, and encrypted RF uplink for real-time situational awareness.',
    tech:['ESP32','RTL-SDR V4','Raspberry Pi','OpenCV','LoRa 433MHz','LiPo Power System','Custom PCB'],
    features:[
      'GPS-independent navigation using opportunistic LEO signals',
      'Real-time video feed with onboard compression',
      'Encrypted RF data link with 10km LOS range',
      'Automated return-to-base on low battery',
      'Thermal imaging module integration-ready',
    ],
    challenges:'Achieving stable autonomous flight in RF-contested environments while keeping the BOM under ₹20,000 was the primary challenge. Signal spoofing mitigation required custom FHSS firmware.',
    future:'Swarm coordination protocol, AI-based target recognition, miniaturization for man-portable kit.',
  },
  {
    id:'B',
    num:'PROJECT 02',
    title:'Powerloom Fabric Length Measurement Sensor System',
    tags:['IoT','Sensors','Industrial','ESP32','BLE'],
    desc:'An industry-deployed sensor system for real-time fabric length measurement on powerloom machines at Kumarapalayam, Namakkal. Replaces manual counting with a low-cost, highly accurate optical encoder + MCU solution.',
    tech:['ESP32','Optical Encoder','BLE','Node-RED','OLED Display','3D Printed Housing','12V Industrial Power'],
    features:[
      'Real-time fabric length display on OLED',
      'BLE data sync to supervisor smartphone',
      'Batch counter with auto-reset',
      'Tamper-alert mechanism',
      'Low power standby mode',
    ],
    challenges:'Vibration noise from the loom mechanism affected encoder readings. Implemented debounce filtering and differential signal conditioning to achieve ±2cm accuracy over 100m fabric runs.',
    future:'Cloud dashboard for factory-wide monitoring, predictive maintenance alerts, integration with ERP.',
  },
  {
    id:'C',
    num:'PROJECT 03',
    title:'Universal Bluetooth Keyboard Adapter',
    tags:['BLE','HID','Arduino','Firmware','Accessibility'],
    desc:'A hardware adapter that converts any legacy PS/2 or USB wired keyboard into a modern Bluetooth HID device. Enables use of classic mechanical keyboards with tablets and smartphones without a physical connection.',
    tech:['Arduino Pro Micro','HC-05 BLE Module','PS/2 Protocol','HID Firmware','Custom PCB','3D Printed Enclosure'],
    features:[
      'Supports PS/2 and USB keyboard protocols',
      'Multi-device pairing (up to 3 devices)',
      'Hardware encryption for BT link',
      'LED status indicator matrix',
      'Rechargeable 500mAh Li-Po battery',
    ],
    challenges:'PS/2 timing is extremely strict at the microsecond level. Bit-banging the protocol on Arduino while simultaneously managing BLE stack required careful interrupt priority management.',
    future:'USB HID host support, OTA firmware updates, companion mobile app for macro programming.',
  },
  {
    id:'D',
    num:'PROJECT 04',
    title:'Linux Automation Projects',
    tags:['Linux','Bash','Python','Networking','Server'],
    desc:'A collection of automation tools and scripts built on Linux for home server management, EZVIZ camera routing via Tailscale, photo backup workflows with FreeFileSync, and radio signal processing pipelines for SDR work.',
    tech:['Linux Mint','Bash','Python','Tailscale','FreeFileSync','Tonfotos','SatDump','JAERO'],
    features:[
      'EZVIZ NVR auto-mount & stream routing via Tailscale VPN',
      'Cron-based photo sync from NAS to cloud-backup',
      'Automated SDR pipeline: receive → decode → archive',
      'System health dashboard with alerting',
      'Headless server management scripts',
    ],
    challenges:'Tailscale subnet routing with multiple NICs caused hairpin NAT issues. Resolved by configuring IP masquerade rules and custom exit nodes.',
    future:'Docker containerization of all services, Grafana monitoring dashboard, automated ACARS/ADS-B logging system.',
  },
  {
    id:'E',
    num:'PROJECT 05',
    title:'Smart Embedded Systems — TribalNet & LEO-PNT',
    tags:['LoRa','LEO','SDR','ESP32','Navigation','Defense'],
    desc:'Two flagship smart embedded systems: (1) TribalNet — a 10km LoRa mesh network for off-grid tribal communication at ₹1,500/node, winner of NHIDE 2026 (₹50,000). (2) Cognitive Opportunistic LEO-PNT Receiver — an SDR system exploiting LEO satellite signals for GPS-denied navigation, submitted for defense innovation challenge.',
    tech:['ESP32 WROOM-32E','SX1278 LoRa 433MHz','MAX7219 LED','RTL-SDR V4','Raspberry Pi 5','ICM-42688 IMU','SatDump v1.2.2'],
    features:[
      'TribalNet: 10km LOS range, RSSI –54 dBm, mesh topology',
      'TribalNet: ₹1,500/node BOM — NHIDE 2026 1st Prize',
      'LEO-PNT: Orbcomm / Iridium opportunistic positioning',
      'LEO-PNT: IMU sensor fusion for inertial bridging',
    ],
    challenges:'For TribalNet: achieving reliable mesh routing under dense forest canopy at 433 MHz required adaptive power control. For LEO-PNT: Doppler shift correction on Orbcomm bursts at 137 MHz demanded real-time DSP tuning.',
    future:'TribalNet: SOS beacon mode, solar-powered nodes. LEO-PNT: patent filing (IPC G01S19/00), integration with military PNT standards.',
  },
];

const CERTS=[
  {title:'NHIDE 2026 — 1st Prize',by:'National Hardware Innovation & Design Expo',year:'2026',cat:'Award',id:'₹50,000 · Team 404'},
  {title:'VishwaNova 2026 Finalist',by:'MIT-WPU Pune',year:'2026',cat:'Competition',id:'Team 404 / TribalNet'},
  {title:'YUKTHI Idea/PoC Submission',by:'BIT Special Lab',year:'2026',cat:'Academic',id:'PS Portal Submission'},
  {title:'GP Challenge BPI Industry Visit',by:'Powerloom, Kumarapalayam',year:'2026',cat:'Academic',id:'Geotagged Report'},
  {title:'IEEE Membership',by:'Institute of Electrical and Electronics Engineers',year:'2024',cat:'Membership',id:'BIT-IECC Chapter',img:'assets/ieee-membership.jpg'},
  {title:'BIT-IECC Active Member',by:'BIT IEEE Student Chapter',year:'2024',cat:'Membership',id:'ECE Dept.'},
  {title:'AViNYA Club Member',by:'Bannari Amman Institute of Technology',year:'2023',cat:'Club',id:'Technical Club'},
];

// ── TYPING ANIMATION ───────────────────────────────────────────────────────────
const typedEl=document.getElementById('typed');
const lines=['ECE Student','Embedded Systems Developer','Defense Tech Innovator','RF & SDR Engineer','Team 404 Lead'];
let lineIdx=0,charIdx=0,deleting=false;
function type(){
  const line=lines[lineIdx];
  typedEl.textContent=deleting?line.substring(0,charIdx-1):line.substring(0,charIdx+1);
  deleting?charIdx--:charIdx++;
  if(!deleting&&charIdx===line.length){setTimeout(()=>{deleting=true;setTimeout(type,80)},1800);return}
  if(deleting&&charIdx===0){deleting=false;lineIdx=(lineIdx+1)%lines.length}
  setTimeout(type,deleting?50:80);
}
setTimeout(type,600);

// ── THEME TOGGLE ───────────────────────────────────────────────────────────────
const themeBtn=document.getElementById('theme-btn');
function applyTheme(isDark){
  document.body.classList.toggle('dark-mode',isDark);
  themeBtn.textContent=isDark?'☀':'🌙';
  localStorage.setItem('theme',isDark?'dark':'light');
}
const savedTheme=localStorage.getItem('theme');
const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme?savedTheme==='dark':prefersDark);
themeBtn.addEventListener('click',()=>{
  applyTheme(!document.body.classList.contains('dark-mode'));
});

// ── HAMBURGER ──────────────────────────────────────────────────────────────────
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('nav-links');
hamburger.addEventListener('click',()=>navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

// ── SKILLS ─────────────────────────────────────────────────────────────────────
const skillsGrid=document.getElementById('skills-grid');
skillsGrid.innerHTML=SKILLS.map(s=>`
  <div class="skill-card">
    <span class="skill-icon">${s.icon}</span>
    <div class="skill-name">${s.name}</div>
    <div class="skill-level"><div class="skill-fill" style="transform:scaleX(${s.level})"></div></div>
  </div>`).join('');

// ── PROJECTS ──────────────────────────────────────────────────────────────────
const projGrid=document.getElementById('projects-grid');
projGrid.innerHTML=PROJECTS.map(p=>`
  <div class="project-card" data-id="${p.id}">
    <div class="project-num">${p.num}</div>
    <div class="project-title">${p.title}</div>
    <div class="project-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <div class="project-arrow">Explore <span>→</span></div>
  </div>`).join('');
projGrid.addEventListener('click',e=>{
  const card=e.target.closest('.project-card');
  if(card)openProject(card.dataset.id);
});

// ── PROJECT MODAL ──────────────────────────────────────────────────────────────
const overlay=document.getElementById('modal-overlay');
const modalContent=document.getElementById('modal-content');
document.getElementById('modal-close').addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

function openProject(id){
  const p=PROJECTS.find(x=>x.id===id);
  if(!p)return;
  modalContent.innerHTML=`
    <div class="modal-num">${p.num}</div>
    <div class="modal-title">${p.title}</div>
    <div class="modal-image-placeholder">Project gallery — image coming soon</div>
    <div class="modal-section">
      <h4>Description</h4>
      <p>${p.desc}</p>
    </div>
    <div class="modal-section">
      <h4>Technologies</h4>
      <div class="modal-tags">${p.tech.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </div>
    <div class="modal-section">
      <h4>Key Features</h4>
      <ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>
    </div>
    <div class="modal-section">
      <h4>Challenges</h4>
      <p>${p.challenges}</p>
    </div>
    <div class="modal-section">
      <h4>Future Improvements</h4>
      <p>${p.future}</p>
    </div>
    <div class="modal-btn-row">
      <a href="https://github.com/ponmudimr" target="_blank" rel="noopener" class="btn-primary">GitHub</a>
    </div>
  `;
  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){
  overlay.classList.remove('open');
  document.body.style.overflow='';
}

// ── CERTIFICATES ───────────────────────────────────────────────────────────────
const filtersEl=document.getElementById('certs-filters');
const certsGridEl=document.getElementById('certs-grid');
const cats=['All',...new Set(CERTS.map(c=>c.cat))];
let activeFilter='All';

filtersEl.innerHTML=cats.map(cat=>`<button class="filter-btn${cat==='All'?' active':''}" data-cat="${cat}">${cat}</button>`).join('');
filtersEl.addEventListener('click',e=>{
  const btn=e.target.closest('.filter-btn');
  if(!btn)return;
  activeFilter=btn.dataset.cat;
  filtersEl.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderCerts();
});

function renderCerts(){
  const filtered=activeFilter==='All'?CERTS:CERTS.filter(c=>c.cat===activeFilter);
  certsGridEl.innerHTML=filtered.map((c,i)=>`
    <div class="cert-card" data-idx="${CERTS.indexOf(c)}">
      <div class="cert-badge">${c.cat}</div>
      <div class="cert-title">${c.title}</div>
      <div class="cert-by">${c.by}</div>
      <div style="margin-top:.5rem;font-size:.78rem;color:var(--accent)">${c.id}</div>
      <div class="cert-year">${c.year}</div>
    </div>
  `).join('');
}
renderCerts();
certsGridEl.addEventListener('click',e=>{
  const card=e.target.closest('.cert-card');
  if(card)openCert(Number(card.dataset.idx));
});

const certModal=document.getElementById('cert-modal');
document.getElementById('cert-close').addEventListener('click',()=>{certModal.classList.remove('open')});
certModal.addEventListener('click',e=>{if(e.target===certModal)certModal.classList.remove('open')});

function openCert(idx){
  const c=CERTS[idx];
  if(!c)return;
  document.getElementById('cert-large-content').innerHTML=c.img?
    `<img src="${c.img}" alt="${c.title}" style="max-width:100%;max-height:100%;border-radius:12px;object-fit:contain">`:
    `<div style="text-align:center">
      <div style="font-size:2.5rem;margin-bottom:1rem">🏆</div>
      <div style="font-size:.85rem;color:var(--accent);margin-bottom:.5rem;font-weight:600">${c.cat}</div>
      <div style="font-size:1.1rem;font-weight:600;color:var(--text)">${c.title}</div>
    </div>`;
  document.getElementById('cert-modal-text').innerHTML=`
    <p style="font-size:.9rem;color:var(--text2);margin-bottom:.5rem">${c.by}</p>
    <p style="font-size:.8rem;color:var(--accent)">${c.id}</p>
    <p style="font-size:.75rem;color:var(--text3);margin-top:.25rem">${c.year}</p>`;
  certModal.classList.add('open');
}

// ── SCROLL REVEAL ──────────────────────────────────────────────────────────────
const fadeEls=document.querySelectorAll('.fade-up');
const fadeObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      fadeObs.unobserve(e.target);
    }
  });
},{threshold:.1});
fadeEls.forEach(el=>fadeObs.observe(el));

// skill level bar observer
const skillObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible')}});
},{threshold:.2});
document.querySelectorAll('.skill-card').forEach(el=>skillObs.observe(el));
