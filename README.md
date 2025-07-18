# PayloadIQ: Postman Clone

<p align="center">
  <img src="src/assets/payload_iq.png" alt="PayloadIQ Logo" width="300" />
</p>

PayloadIQ is a modern, open-source Vue 3 web app for composing and sending HTTP requests, viewing responses, and managing request history. Inspired by Postman, it features a developer-centric UI, modular components, UnoCSS/Tailwind styling, and robust state management with Pinia.

## 🚀 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/ryanlong1004/payload_iq.git
cd payload_iq
npm install
```

Start the development server:

```bash
npm run dev
```

## 🧩 Project Structure

- `src/components/` — UI components (RequestComposer, ResponseViewer, Toast, ThemeToggle, etc.)
- `src/views/` — Main dashboard and layout
- `src/store/` — Pinia state management
- `src/utils/` — API and localStorage utilities
- `src/composables/` — Vue composables (e.g., useToast)
- `src/assets/` — Images and branding

## 🛠️ Developer Setup & Tooling

- **Framework:** Vue 3 + Vite
- **Styling:** UnoCSS, Tailwind CSS
- **State:** Pinia
- **Testing:** Vitest, @vue/test-utils
- **Icons:** Heroicons

Recommended VS Code extension: [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 🧪 Testing

Run unit tests:

```bash
npm test
```

Test files are located in `src/components/__tests__/` and `src/store/__tests__/`.

## 🤝 Contributing

We welcome contributions! You can help by:

- Reporting bugs and issues
- Suggesting features and improvements
- Submitting pull requests for code, docs, or tests
- Reviewing and discussing open issues/PRs

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines (coming soon).

## 💬 Community & Support

- [Discussions](https://github.com/ryanlong1004/payload_iq/discussions)
- [Issues](https://github.com/ryanlong1004/PayloadIQ/issues)

## 📦 Roadmap & Ideas

- Collections and environments
- Authentication helpers
- Desktop packaging (Tauri/Electron)
- Advanced import/export
- More micro-interactions and themes
- API mocking and test suites

## 📚 Documentation

- UnoCSS: [https://unocss.dev/guide/](https://unocss.dev/guide/)
- Vite: [https://vitejs.dev/](https://vitejs.dev/)
- Pinia: [https://pinia.vuejs.org/](https://pinia.vuejs.org/)

## 📝 License

MIT
