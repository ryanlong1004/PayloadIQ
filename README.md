# PayloadIQ: Postman Clone

A modern Vue 3 + UnoCSS web app to compose and send HTTP requests, view responses, and manage request history. Features responsive design, micro-interactions, and robust state management with Pinia.

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
