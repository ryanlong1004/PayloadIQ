# PayloadIQ: Postman Clone

<p align="center">
  <img src="src/assets/payload_iq.png" alt="PayloadIQ Logo" width="300" />
</p>

A modern Vue 3 + UnoCSS web app to compose and send HTTP requests, view responses, and manage request history. Features responsive design, micro-interactions, and robust state management with Pinia.

## UnoCSS

This project uses [UnoCSS](https://unocss.dev/) for utility-first, on-demand CSS generation. UnoCSS provides instant atomic CSS classes, fast build times, and flexible configuration for modern web apps.

- **Documentation:** [https://unocss.dev/guide/](https://unocss.dev/guide/)
- **GitHub:** [https://github.com/unocss/unocss](https://github.com/unocss/unocss)
- **Vite Plugin:** [https://unocss.dev/integrations/vite](https://unocss.dev/integrations/vite)

**Key Features:**

- Utility-first atomic CSS
- On-demand generation for fast builds
- Customizable presets and themes
- Works seamlessly with Vue, Vite, and other frameworks

**Configuration:**

- See `unocss.config.mjs` for project-specific settings and theme extensions.

## Features

- Compose HTTP requests (URL, method, headers, body)
- View formatted responses
- Save/load request history (localStorage)
- Modular component structure
- Responsive design for mobile/tablet/desktop
- Micro-interactions (button hover, panel transitions)
- Modern input/button styling
- Centralized state management with Pinia
- Lazy-loaded heavy components
- Utility-first styling with UnoCSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `src/components/` — UI components
- `src/views/` — Page views
- `src/store/` — Pinia state management
- `src/utils/` — Utility functions

## Next Steps

- Add unit tests for key components and logic
- Implement collections, environments, authentication helpers, and desktop packaging (Tauri/Electron)
