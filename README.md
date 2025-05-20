# Vue.js Translation App

A single-page Vue.js application that translates English text to various languages using the MyMemory Translation API. The application also maintains a history of the last 10 translated phrases.

## Features

- Translate English text to multiple languages
- Display translated text with pronunciation and copy options
- Maintain a history of recent translations (up to 10 entries)
- Speech synthesis for hearing the translated text
- Responsive design for mobile and desktop use
- Offline persistence using localStorage

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Information](#api-information)
- [Project Structure](#project-structure)
- [Customizing](#customizing)
- [Deployment](#deployment)
- [Additional Considerations](#additional-considerations)

## Installation

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager

### Setup Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd translate-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run serve
   # or
   yarn serve
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Usage

1. Enter English text in the input field
2. Select your target language from the dropdown menu
3. Click the "Translate" button
4. View the translation result
5. Use the speaker icon (🔊) to hear the translation pronunciation
6. Use the clipboard icon (📋) to copy the translation to your clipboard
7. Previous translations appear in the history section
8. Click the arrow icon (↩️) to reuse a previous translation
9. Click the trash icon (🗑️) to delete a specific translation
10. Click "Clear History" to remove all translation history

## API Information

This app uses the MyMemory Translation API:
- Free to use (up to 5000 chars/day)
- No API key required for basic usage
- Documentation: [MyMemory API Documentation](https://mymemory.translated.net/doc/spec.php)

## Project Structure

```
translate-app/
├── public/                # Static files
├── src/                   # Source code
│   ├── assets/            # Assets (images, fonts, etc.)
│   ├── components/        # Vue components
│   │   ├── TranslationForm.vue        # Input form component
│   │   ├── TranslationResult.vue      # Results display component
│   │   └── TranslationHistory.vue     # History list component
│   ├── services/          # Service modules
│   │   └── translationService.js      # API and utility functions
│   ├── App.vue            # Main application component
│   └── main.js            # Application entry point
└── package.json           # Project dependencies and scripts
```

## Customizing

### Adding More Languages

Edit the `getLanguageOptions` function in `translationService.js` to add more language options:

```javascript
export function getLanguageOptions() {
  return [
    { code: 'hi', name: 'Hindi' },
    // Add more languages here
    { code: 'nl', name: 'Dutch' },
    { code: 'fi', name: 'Finnish' },
    // etc.
  ];
}
```

### Styling

The app uses scoped CSS in each component. To change the overall appearance:

1. Edit the global styles in `App.vue`
2. Modify component-specific styles in their respective `.vue` files

## Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed to any static file hosting service.

### Deployment Options

- **Netlify**: Connect your GitHub repository or drag and drop the `dist` folder
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Push the `dist` folder to a gh-pages branch
- **Any Static Hosting**: Upload the contents of the `dist` folder

## Additional Considerations

### Rate Limiting

The MyMemory Translation API has the following limits:
- 5000 characters per day for anonymous usage
- Consider implementing a fallback mechanism if the API limit is reached

### Browser Compatibility

- Text-to-speech functionality uses the Web Speech API, which may not be supported in all browsers
- The app includes fallback behavior when speech synthesis is not available

### Future Enhancements

- Add more translation APIs as fallback options
- Implement language detection for input text
- Add translation quality feedback mechanism
- Support for translating between any language pair