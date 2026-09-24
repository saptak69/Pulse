# Pulse Tracker

Pulse is a beautiful, Apple-inspired personal hobby and habit tracker. It features a GitHub-style contribution heatmap, soft UI aesthetics, spring animations, and a seamless mobile-first PWA experience.

## Features
- **Apple Design Language:** Generous whitespace, continuous corner radii, translucent bottom navigation, and fluid Framer Motion spring animations.
- **Heatmap Tracking:** GitHub-style daily contribution grid for each hobby and an aggregated view.
- **Mobile First:** Designed as a Progressive Web App (PWA) with a bottom tab bar.
- **Offline Ready:** Uses Zustand + LocalStorage persist to work instantly without backend setup.
- **Android Ready:** Capacitor configured out of the box to generate an Android app.

## Getting Started

### Web Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

### Backend (Supabase)
The app is currently configured to use `localStorage` so it works out of the box for immediate demonstration.
To use Supabase:
1. Create a Supabase project.
2. Run `npm install @supabase/supabase-js`.
3. Add your credentials to a `.env` file:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
4. Replace the Zustand store calls in `useStore.ts` with Supabase queries defined in `src/lib/supabase.ts`.

### Android Setup (Capacitor)
To build the Android app locally:
1. Ensure you have Android Studio installed.
2. Run `npm run build` to create the web assets in `/dist`.
3. Run `npx cap sync android` to copy assets to the native project.
4. Run `npx cap open android` to open the project in Android Studio, or build via CLI.

## Download the Android App
When you push a new tag (e.g., `v1.0.0`) to this repository, the GitHub Actions workflow will automatically build a debug APK.
You can download the APK from the **Releases** tab on GitHub and sideload it onto your Android device.
