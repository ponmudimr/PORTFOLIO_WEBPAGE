# Ponmudi M R — Portfolio Website

A personal portfolio website for **Ponmudi M R**, a Linux developer and open-source contributor studying Electronics & Communication Engineering (ECE) at Bannari Amman Institute of Technology, Sathyamangalam. The site showcases real GitHub contributions, technical projects, certifications, skills, and a downloadable resume for someone focused on Linux, embedded systems, and RF/SDR communication.

**Live site:** https://ponmudimr.github.io/PORTFOLIO_WEBPAGE/

## Overview

The site is a single-page application built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies to manage. The design leans into that simplicity: flat hairline-bordered blocks instead of shadow-and-gradient cards, JetBrains Mono for structural chrome, and each section header written as the shell command you'd actually type to see that content (`$ whoami`, `$ cat skills.txt`, `$ git log --author=ponmudimr`). It supports both light and dark themes, automatically matching the visitor's system preference, with a manual toggle that persists across visits via `localStorage`.

## Sections

- **Hero** — name, role, and an animated rotating-gradient profile photo with a typewriter-style subtitle cycling through roles (Linux Developer, Open-Source Contributor, Embedded Systems Engineer, etc.)
- **About** — profile card with stats (projects, prize money won, IEEE membership, graduation year) and a timeline of achievements, including merged open-source pull requests
- **Skills** — a grid of technical skills (Linux, Git & GitHub, Bash, C, Embedded Systems, ESP32, Arduino, RF & SDR, IoT, Drone Technology) with animated proficiency bars
- **Open Source** — a real, merged pull request with full detail, a curated set of public repositories (with live star counts and links), and a live-rendered GitHub stats embed — nothing on this section is fabricated
- **Projects** — five featured engineering projects, each opening into a detailed modal covering description, tech stack, key features, challenges, and future improvements, plus the actual open tooling each was built with
- **Certificates** — a filterable grid of certifications and awards (by category: Award, Competition, Academic, Membership, Club), with real certificate images shown on click where available
- **Resume** — a downloadable PDF resume
- **Contact** — direct links to email, LinkedIn, GitHub, and Instagram

## Tech Stack

- **HTML5** — semantic structure (`index.html`)
- **CSS3** — custom properties (CSS variables) for theming, Flexbox/Grid layouts, `IntersectionObserver`-driven scroll reveals (`css/style.css`)
- **Vanilla JavaScript** — all content (skills, projects, certificates) is data-driven from arrays, rendered into the DOM at runtime; no external libraries or dependencies (`js/main.js`)
- **GitHub Pages** — static hosting, deployed directly from the `main` branch

## Project Structure

```
.
├── index.html          # Page markup, all sections
├── css/
│   └── style.css       # Theme variables, layout, animations
├── js/
│   └── main.js         # Content data + DOM rendering + interactivity
└── assets/             # Resume PDF, certificate images, profile photo, QR code
```

## Running Locally

No build tools or dependencies are required. Clone the repository and serve the folder with any static file server, for example:

```bash
git clone https://github.com/ponmudimr/PORTFOLIO_WEBPAGE.git
cd PORTFOLIO_WEBPAGE
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Customization

All editable content lives in `js/main.js` as plain JavaScript arrays (`SKILLS`, `PROJECTS`, `CERTS`), making it straightforward to add new projects, skills, or certificates without touching the HTML structure. Section-level content (hero text, about bio, contact links) is edited directly in `index.html`.

## Contact

- **Email:** ponmudimr.ec25@bitsathy.ac.in
- **LinkedIn:** [linkedin.com/in/mrponmudi](https://linkedin.com/in/mrponmudi)
- **GitHub:** [github.com/ponmudimr](https://github.com/ponmudimr)
