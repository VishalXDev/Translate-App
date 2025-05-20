Vue.js Translation App
A responsive single-page Vue.js app that translates English text into multiple languages using the MyMemory Translation API. Features include translation history, speech synthesis, and clipboard support.

Features
Translate English text to multiple languages (9 total, including Hindi)

Speech synthesis to listen to translations

Copy translation to clipboard

Store last 10 translations with reuse & delete options

Responsive design with offline support via localStorage

Installation
Prerequisites
Node.js v14+

npm or yarn

Steps
bash
Copy
Edit
git clone <repository-url>
cd translate-app
npm install
npm run serve
Open http://localhost:8080 in your browser.

Usage
Enter English text

Select target language

Click Translate

Listen 🔊 or copy 📋 translation

Manage translation history (reuse, delete, clear)

API
Uses MyMemory Translation API (free, no API key, 5000 chars/day):
https://mymemory.translated.net/doc/spec.php

Adding Languages
Edit getLanguageOptions in src/services/translationService.js to add/remove languages. Current example:

js
Copy
Edit
[
{ code: 'hi', name: 'Hindi' },
{ code: 'nl', name: 'Dutch' },
{ code: 'fi', name: 'Finnish' },
{ code: 'fr', name: 'French' },
{ code: 'de', name: 'German' },
{ code: 'es', name: 'Spanish' },
{ code: 'it', name: 'Italian' },
{ code: 'ru', name: 'Russian' },
{ code: 'ja', name: 'Japanese' },
]
Project Structure
bash
Copy
Edit
src/
├─ components/ # Vue components
├─ services/ # API & utilities
├─ App.vue # Root component
└─ main.js # Entry point
Deployment
Build with:

bash
Copy
Edit
npm run build
Deploy dist/ folder to any static hosting (Netlify, Vercel, GitHub Pages, etc.).

Notes
Speech synthesis requires browser support for Web Speech API

API limit: 5000 characters/day, consider caching or fallback for heavy use
