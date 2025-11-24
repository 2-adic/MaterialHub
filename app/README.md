# MaterialHub App

React Native mobile application built with Expo and TypeScript.

## Development Commands

- `npm start` - Start the development server
- `npm run android` - Open in Android emulator
- `npm run ios` - Open in iOS simulator (Mac only)
- `npm run web` - Open in web browser

## Project Structure

```
app/
├── App.tsx                # Main app entry point
├── src/
│   ├── screens/           # Screen components
│   ├── navigation/        # Navigation setup
│   ├── data/              # Material data
│   ├── types/             # TypeScript types
│   └── utils/             # Helper functions
├── package.json
└── app.json
```

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation

**App crashes or won't load?**

- Check the terminal for error messages
- Try clearing the cache: `npm start --clear`
- Restart Expo Go on your phone
