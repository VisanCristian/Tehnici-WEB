# BOON: The FNAF Store - Project Overview

"BOON: The FNAF Store" is a web application developed as a university project for the "Tehnici WEB" (Web Techniques) course. It is an online store dedicated to merchandise from the *Five Nights at Freddy's* (FNAF) universe, including costumes, apparel, plushies, and DIY sets.

## Architecture and Technologies

- **Frontend:**
  - **HTML5:** Semantic structure for the main pages (e.g., `index1.html`).
  - **CSS3:** Extensive use of CSS variables (custom properties), Flexbox, and CSS Grid for layout. Responsive design is a key focus.
  - **SCSS:** Used for modular styling, specifically for the navigation menu (`resurse/scss/nav.scss`).
  - **Fonts:** Uses "Orbitron" and "Exo 2" from Google Fonts.
  - **Icons:** Uses Font Awesome 6.
- **Backend (In Transition):**
  - **Node.js:** The project includes a `package.json` with an `ejs` dependency, suggesting a transition from static HTML to a dynamic server-side rendered application.
  - **EJS:** Templates are expected to be located in the `views/` directory (currently empty or in progress).

## Directory Structure

- `/resurse`: Static assets including CSS, SCSS, images, fonts, and licensing documents.
  - `/css`: Compiled CSS files and source maps.
  - `/scss`: Source SCSS files for the navigation menu.
  - `/imagini`: Project images, including favicons and product photos.
  - `/font`: Local font files.
- `/views`: Directory for EJS templates (intended for `fragmente` and `pagini`).
- `index1.html`: The main landing page of the store.
- `package.json`: Project metadata and dependencies.

## Key Features (Documented in README)

- **Landing Page:** Information about the store, FAQs, and featured products.
- **Shop Page:** Categorized product listings with search and filtering (planned).
- **Contact:** Contact information and support ticket system (planned).
- **Reviews:** User review section (planned).
- **Responsive Design:** Optimized for different screen sizes (1000px, 700px breakpoints).
- **Thematic Styling:** Dark, neon-accented "FNAF" aesthetic using an analogic color scheme (Purple/Magenta/Cyan).

## Building and Running

### Prerequisites
- Node.js and npm

### Installation
```bash
npm install
```

### Running (TODO)
Currently, the project is primarily static. Once the Node.js server is implemented, the entry point will be `index.js` (as specified in `package.json`).

```bash
# TODO: Add command to start the server (e.g., node index.js or npm start)
```

### SCSS Compilation
If you modify SCSS files, they need to be recompiled to CSS.
```bash
# TODO: Add specific sass compilation command if used
```

## Development Conventions

- **Variable-First CSS:** All colors and spacing should be managed through CSS variables defined in the `:root` or `body` of `general.css`.
- **Responsive Breakpoints:** Use `nav1000.css` and `nav700.css` (or equivalent media queries) for responsiveness.
- **Naming:** Follow established naming conventions for classes and IDs (mostly Romanian-based as per project requirements).
- **Documentation:** Maintain the `README.md` with project progress (Stages/Etapa).
