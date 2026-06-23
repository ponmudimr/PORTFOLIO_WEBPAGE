# Ponmudi M R — Portfolio Website

A personal portfolio website for **Ponmudi M R**, an Electronics & Communication Engineering (ECE) undergraduate at Bannari Amman Institute of Technology, Sathyamangalam. The site showcases technical projects, certifications, skills, and a downloadable resume for someone focused on embedded systems, RF/SDR communication, and IoT.

**Live site:** https://ponmudimr.github.io/PORTFOLIO_WEBPAGE/

## Overview

The site is a single-page application built with plain HTML, CSS, and JavaScript — no frameworks, no build step. It follows a clean, minimal design language inspired by Apple's product pages: generous whitespace, system fonts, a restrained color palette, and subtle scroll-triggered animations. It supports both light and dark themes, automatically matching the visitor's system preference, with a manual toggle that persists across visits via `localStorage`.

## Sections

- **Hero** — name, role, and an animated rotating-gradient profile photo with a typewriter-style subtitle cycling through roles (ECE Student, Embedded Systems Developer, RF & SDR Engineer, etc.)
- **About** — profile card with stats (projects, prize money won, IEEE membership, graduation year) and a timeline of achievements
- **Skills** — a grid of technical skills (C, Arduino, ESP32, Linux, Embedded Systems, IoT, RF & SDR, Drone Technology, Git) with animated proficiency bars
- **Projects** — five featured engineering projects, each opening into a detailed modal covering description, tech stack, key features, challenges, and future improvements
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
