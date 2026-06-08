# MockMaster — CBSE Class 10 Mock Tests
### Gamified PWA · React + Vite + Firebase · Built for Bolt.new

---

## What's Inside

A gamified, PWA-ready CBSE Class 10 mock test app with:
- **6 subjects** — Maths, Science, SST, English, Hindi, AI
- **80+ chapters** mapped to CBSE 2026–27 syllabus
- **AI-generated questions** via Anthropic API (fresh every test)
- **CBSE exam pattern** — 50% CBQ, 20% MCQ, 30% SA
- **Gamification** — XP, levels (1–5), streaks, 12 badges
- **Pass/Fail** — 40% threshold, confetti on pass
- **Score tracking** — saved to Firebase Firestore
- **Test history** — last 50 tests with marks, time, XP
- **PWA** — installable on mobile, works offline shell

---

## Step 1 — Firebase Setup

### 1.1 Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **Add Project** → name it `mockmaster-cbse10`
3. Disable Google Analytics (not needed)
4. Click **Create Project**

### 1.2 Add a Web App
1. In your project dashboard, click the **`</>`** icon (Web)
2. Register app with nickname `mockmaster-web`
3. Click **Register App**
4. Copy the `firebaseConfig` object — you'll need it shortly

### 1.3 Enable Firestore
1. In Firebase sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (you can secure it later)
4. Pick a region (e.g., `asia-south1` for India)
5. Click **Enable**

### 1.4 Firestore Security Rules (paste into Firestore → Rules tab)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
> For personal use this is fine. If you share the URL, add authentication later.

---

## Step 2 — Bolt.new Setup

### 2.1 Open Bolt
1. Go to https://bolt.new
2. Click **Start a new project**
3. When prompted, say: *"I want to upload my own files"* or choose **Import from GitHub**

### 2.2 Upload All Files
Upload this entire folder structure to Bolt exactly as-is:
```
cbse10/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── manifest.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/
    │   └── firebase.js          ← PASTE YOUR CONFIG HERE
    ├── data/
    │   └── subjects.js
    ├── hooks/
    │   └── useProfile.js
    ├── utils/
    │   └── generateQuestions.js
    ├── screens/
    │   ├── HomeScreen.jsx
    │   ├── ChapterScreen.jsx
    │   ├── TestScreen.jsx
    │   ├── ResultScreen.jsx
    │   ├── StatsScreen.jsx
    │   └── HistoryScreen.jsx
    └── components/
        └── LoadingScreen.jsx
```

### 2.3 Paste Firebase Config
Open `src/lib/firebase.js` in Bolt and replace the placeholder config:
```js
const firebaseConfig = {
  apiKey: "AIzaSy...",            // ← your values from Firebase
  authDomain: "mockmaster-cbse10.firebaseapp.com",
  projectId: "mockmaster-cbse10",
  storageBucket: "mockmaster-cbse10.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2.4 Run the App
In Bolt's terminal (or it runs automatically):
```bash
npm install
npm run dev
```
The app opens in Bolt's preview panel. Test it — take a mock test, check scores.

---

## Step 3 — Deploy to Firebase Hosting

### 3.1 Build for production
```bash
npm run build
```
This creates a `dist/` folder.

### 3.2 Install Firebase CLI (if not already)
```bash
npm install -g firebase-tools
firebase login
```

### 3.3 Initialize Hosting
```bash
firebase init hosting
```
- Select your `mockmaster-cbse10` project
- Public directory: **`dist`**
- Single-page app: **Yes**
- Overwrite index.html: **No**

### 3.4 Deploy
```bash
firebase deploy --only hosting
```
Your app is live at: `https://mockmaster-cbse10.web.app`

---

## Step 4 — Install as PWA on Mobile

On your phone:
1. Open Chrome and go to your Firebase Hosting URL
2. Tap the **three-dot menu → Add to Home Screen**
3. The app installs like a native app!

On iPhone:
1. Open Safari → tap **Share → Add to Home Screen**

---

## Gamification Summary

| Feature | Detail |
|---|---|
| XP per correct answer | +10 XP |
| XP for passing a test | +50 XP |
| Streak bonus (daily) | +25 XP |
| Pass threshold | 40% (CBSE = 33%, bumped for practice) |
| Levels | 5 levels: Newbie → Board Queen |
| Badges | 12 badges (first test, streaks, perfect score, etc.) |
| Confetti | Fires on every PASS result |
| History | Last 50 tests stored in Firestore |

---

## Firestore Data Structure

```
firestore/
├── profile/
│   └── player          ← XP, level, badges, streaks, recentResults[]
└── testResults/
    └── {auto-id}       ← subject, chapter, score, marks, pct, passed, timeSecs, xpEarned, timestamp
```

---

## Customization

- **Pass threshold** → `src/data/subjects.js` → `PASS_THRESHOLD`
- **XP values** → `src/data/subjects.js` → `XP_PER_CORRECT`, `XP_PER_PASS`
- **Add badges** → `src/data/subjects.js` → `BADGES` array
- **Question count options** → `src/screens/ChapterScreen.jsx`
- **Colors/theme** → `src/index.css` → `:root` variables
- **AI prompt** → `src/utils/generateQuestions.js` → `buildPrompt()`

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Inline styles + CSS variables |
| Database | Firebase Firestore |
| Hosting | Firebase Hosting |
| AI Questions | Anthropic Claude API (claude-sonnet-4) |
| PWA | Web App Manifest + meta tags |
| Fonts | Fredoka One + Nunito (Google Fonts) |
