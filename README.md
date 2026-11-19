# Little Maths Adventure 🚀

A playful React + TypeScript multiplication game for young children.

## Features
- Choose Captain Aarav (boy) or Captain Anya (girl).
- Explore nine themed planets for tables 2–10.
- Five multiple-choice questions per planet.
- Animated transitions and floating character.
- Correct/wrong feedback, sound toggle and star rewards.
- Saves stars and explored planets in browser LocalStorage.
- Responsive layout for laptop, tablet and mobile.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Notes
- No backend is required.
- Progress is saved in the current browser using LocalStorage.
- Character art currently uses emoji placeholders. For a polished production version, replace these with licensed/custom 3D character PNG/WebP assets and add recorded voice instructions.
- The app uses Google Fonts from the web; it falls back to system fonts if offline.
