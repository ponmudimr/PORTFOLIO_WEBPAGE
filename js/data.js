/**
 * PORTFOLIO DATA CONFIGURATION
 * Ponmudi M R — ECE Engineer & Innovator
 */

window.PORTFOLIO_DATA = {
  personal: {
    name: 'Ponmudi M R',
    role: 'ECE Engineer & Innovator',
    rollNo: '7376251EC257',
    batch: '2025–2029',
    institution: 'Bannari Amman Institute of Technology',
    location: 'Sathyamangalam, Tamil Nadu',
    email: 'ponmudimr.ec25@bitsathy.ac.in',
    github: 'https://github.com/ponmudimr',
    linkedin: 'https://linkedin.com/in/mrponmudi',
    instagram: 'https://instagram.com/mrponmudi',
    resumePdf: 'assets/Ponmudi_MR_Resume_2026.pdf',
    photo: 'assets/MYPHOTO.JPG',
    qrCode: 'assets/portfolio-qr.png',
    bio: 'Electronics & Communication Engineering student at Bannari Amman Institute of Technology with a deep passion for embedded systems, RF/SDR communications, and defense-oriented technology. I lead Team 404 (with Dinesh & Pratiksha) and have built systems ranging from LoRa mesh networks deployed for rural connectivity to LEO satellite positioning receivers. I am actively seeking research roles at DRDO, ISRO, and NIT Trichy.',
    stats: [
      { num: '3+', label: 'PROJECTS' },
      { num: '₹50K', label: 'PRIZE WON' },
      { num: 'IEEE', label: 'MEMBER' },
      { num: '2029', label: 'GRADUATING' }
    ]
  },

  typingTitles: [
    'ECE Student',
    'Embedded Systems Developer',
    'Defense Tech Innovator',
    'RF & SDR Engineer',
    'Team 404 Lead'
  ],

  skills: [
    { icon: '⚙️', name: 'C Programming', level: 0.9 },
    { icon: '🤖', name: 'Arduino', level: 0.88 },
    { icon: '📟', name: 'ESP32', level: 0.85 },
    { icon: '🐧', name: 'Linux', level: 0.8 },
    { icon: '🔌', name: 'Embedded Systems', level: 0.87 },
    { icon: '🌐', name: 'IoT', level: 0.82 },
    { icon: '📡', name: 'RF & SDR', level: 0.75 },
    { icon: '🚁', name: 'Drone Technology', level: 0.7 },
    { icon: '💻', name: 'Frontend Design', level: 0.72 },
    { icon: '🐙', name: 'Git & GitHub', level: 0.85 }
  ],

  projects: [
    {
      id: 'A',
      num: 'PROJECT 01',
      title: 'Autonomous Search & Intimation Drone for Navy and Army',
      tags: ['Drone', 'Embedded', 'Defense', 'RF', 'Autonomous'],
      desc: 'A fully autonomous UAV system designed for naval and army search-and-rescue operations in GPS-denied environments. The drone leverages SDR-based navigation, onboard computer vision, and encrypted RF uplink for real-time situational awareness.',
      tech: ['ESP32', 'RTL-SDR V4', 'Raspberry Pi', 'OpenCV', 'LoRa 433MHz', 'LiPo Power System', 'Custom PCB'],
      features: [
        'GPS-independent navigation using opportunistic LEO signals',
        'Real-time video feed with onboard compression',
        'Encrypted RF data link with 10km LOS range',
        'Automated return-to-base on low battery',
        'Thermal imaging module integration-ready'
      ],
      challenges: 'Achieving stable autonomous flight in RF-contested environments while keeping the BOM under ₹20,000 was the primary challenge. Signal spoofing mitigation required custom FHSS firmware.',
      future: 'Swarm coordination protocol, AI-based target recognition, miniaturization for man-portable kit.'
    },
    {
      id: 'B',
      num: 'PROJECT 02',
      title: 'Powerloom Fabric Length Measurement Sensor System',
      tags: ['IoT', 'Sensors', 'Industrial', 'ESP32', 'BLE'],
      desc: 'An industry-deployed sensor system for real-time fabric length measurement on powerloom machines at Kumarapalayam, Namakkal. Replaces manual counting with a low-cost, highly accurate optical encoder + MCU solution.',
      tech: ['ESP32', 'Optical Encoder', 'BLE', 'Node-RED', 'OLED Display', '3D Printed Housing', '12V Industrial Power'],
      features: [
        'Real-time fabric length display on OLED',
        'BLE data sync to supervisor smartphone',
        'Batch counter with auto-reset',
        'Tamper-alert mechanism',
        'Low power standby mode'
      ],
      challenges: 'Vibration noise from the loom mechanism affected encoder readings. Implemented debounce filtering and differential signal conditioning to achieve ±2cm accuracy over 100m fabric runs.',
      future: 'Cloud dashboard for factory-wide monitoring, predictive maintenance alerts, integration with ERP.'
    },
    {
      id: 'C',
      num: 'PROJECT 03',
      title: 'Universal Bluetooth Keyboard Adapter',
      tags: ['BLE', 'HID', 'Arduino', 'Firmware', 'Accessibility'],
      desc: 'A hardware adapter that converts any legacy PS/2 or USB wired keyboard into a modern Bluetooth HID device. Enables use of classic mechanical keyboards with tablets and smartphones without a physical connection.',
      tech: ['Arduino Pro Micro', 'HC-05 BLE Module', 'PS/2 Protocol', 'HID Firmware', 'Custom PCB', '3D Printed Enclosure'],
      features: [
        'Supports PS/2 and USB keyboard protocols',
        'Multi-device pairing (up to 3 devices)',
        'Hardware encryption for BT link',
        'LED status indicator matrix',
        'Rechargeable 500mAh Li-Po battery'
      ],
      challenges: 'PS/2 timing is extremely strict at the microsecond level. Bit-banging the protocol on Arduino while simultaneously managing BLE stack required careful interrupt priority management.',
      future: 'USB HID host support, OTA firmware updates, companion mobile app for macro programming.'
    },
    {
      id: 'D',
      num: 'PROJECT 04',
      title: 'Linux Automation Projects',
      tags: ['Linux', 'Bash', 'Python', 'Networking', 'Server'],
      desc: 'A collection of automation tools and scripts built on Linux for home server management, EZVIZ camera routing via Tailscale, photo backup workflows with FreeFileSync, and radio signal processing pipelines for SDR work.',
      tech: ['Linux Mint', 'Bash', 'Python', 'Tailscale', 'FreeFileSync', 'Tonfotos', 'SatDump', 'JAERO'],
      features: [
        'EZVIZ NVR auto-mount & stream routing via Tailscale VPN',
        'Cron-based photo sync from NAS to cloud-backup',
        'Automated SDR pipeline: receive → decode → archive',
        'System health dashboard with alerting',
        'Headless server management scripts'
      ],
      challenges: 'Tailscale subnet routing with multiple NICs caused hairpin NAT issues. Resolved by configuring IP masquerade rules and custom exit nodes.',
      future: 'Docker containerization of all services, Grafana monitoring dashboard, automated ACARS/ADS-B logging system.'
    },
    {
      id: 'E',
      num: 'PROJECT 05',
      title: 'Smart Embedded Systems — TribalNet & LEO-PNT',
      img: 'assets/nhidepresentation.JPG',
      tags: ['LoRa', 'LEO', 'SDR', 'ESP32', 'Navigation', 'Defense'],
      desc: 'Two flagship smart embedded systems: (1) TribalNet — a 10km LoRa mesh network for off-grid tribal communication at ₹1,500/node, winner of NHIDE 2026 (₹50,000). (2) Cognitive Opportunistic LEO-PNT Receiver — an SDR system exploiting LEO satellite signals for GPS-denied navigation, submitted for defense innovation challenge.',
      tech: ['ESP32 WROOM-32E', 'SX1278 LoRa 433MHz', 'MAX7219 LED', 'RTL-SDR V4', 'Raspberry Pi 5', 'ICM-42688 IMU', 'SatDump v1.2.2'],
      features: [
        'TribalNet: 10km LOS range, RSSI –54 dBm, mesh topology',
        'TribalNet: ₹1,500/node BOM — NHIDE 2026 1st Prize',
        'LEO-PNT: Orbcomm / Iridium opportunistic positioning',
        'LEO-PNT: IMU sensor fusion for inertial bridging'
      ],
      challenges: 'For TribalNet: achieving reliable mesh routing under dense forest canopy at 433 MHz required adaptive power control. For LEO-PNT: Doppler shift correction on Orbcomm bursts at 137 MHz demanded real-time DSP tuning.',
      future: 'TribalNet: SOS beacon mode, solar-powered nodes. LEO-PNT: patent filing (IPC G01S19/00), integration with military PNT standards.'
    }
  ],

  certs: [
    {
      title: 'NHIDE 2026 — 1st Prize · Solar Powered RF Communication',
      by: 'National Hackathon for Innovation, Design & Entrepreneurship — Guru Ghasidas Vishwavidyalaya',
      year: '2026',
      cat: 'Award',
      id: '1st Prize · CBDE Initiative',
      img: 'assets/nhide-certificate.jpg',
      pdf: 'assets/CIRTIFICATE.pdf'
    },
    {
      title: 'VishwaNova 2026 — Certificate of Participation',
      by: 'MIT World Peace University, Pune',
      year: '2026',
      cat: 'Competition',
      id: 'Team 404 Error',
      img: 'assets/vishwanova-certificate.jpeg'
    },
    {
      title: 'YUKTHI Idea/PoC Submission',
      by: 'BIT Special Lab',
      year: '2026',
      cat: 'Academic',
      id: 'PS Portal Submission'
    },
    {
      title: 'IEEE Membership',
      by: 'Institute of Electrical and Electronics Engineers',
      year: '2024',
      cat: 'Membership',
      id: 'BIT-IECC Chapter',
      img: 'assets/ieee-membership.jpg',
      pdf: 'assets/ieee-membership.pdf'
    },
    {
      title: 'AViNYA Club Member',
      by: 'Bannari Amman Institute of Technology',
      year: '2023',
      cat: 'Club',
      id: 'Technical Club'
    }
  ],

  timeline: [
    {
      year: '2026',
      title: 'NHIDE 2026 — 1st Prize ₹50,000',
      desc: 'National Hackathon for Innovation, Design & Entrepreneurship — Guru Ghasidas Vishwavidyalaya · "Solar Powered RF Communication"'
    },
    {
      year: '2026',
      title: 'VishwaNova 2026 — Certificate of Participation',
      desc: 'Team "404 Error" · National-level project competition at MIT World Peace University, Pune'
    },
    {
      year: '2026',
      title: 'Joined BIT — ECE Dept.',
      desc: 'Roll No. 7376251EC257 · Active in IEEE, BIT-IECC & AViNYA Club'
    }
  ]
};
