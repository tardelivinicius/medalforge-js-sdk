# 🏅 MedalForge SDK

![npm](https://img.shields.io/npm/v/@medalforge/sdk)
![License](https://img.shields.io/npm/l/@medalforge/sdk)

**Official JavaScript/TypeScript SDK for MedalForge**
Add gamification to your app in minutes — track achievements, show badges, and rank your users effortlessly.

---

## 🚀 Features

- 🔒 Simple & secure API integration
- 🏆 Track achievements and custom events
- 🎖 Display earned badges with modals
- 🧑‍🤝‍🧑 Manage users and their badge progress
- 🥇 View and retrieve user rankings
- ⚡️ Auto-show badge popups
- 🛠 TypeScript support

---

## 📦 Installation

Install the SDK using your preferred package manager:

```bash
npm install @medalforge/sdk
# or
yarn add @medalforge/sdk
# or
pnpm add @medalforge/sdk
```

## 🛠 Usage

```code
import { MedalForgeStudio } from '@medalforge/sdk';
```

```code
const sdk = new MedalForgeStudio({
  apiKey: 'your_api_key_here',        // ✅ Required
  secretKey: 'your_secret_here',      // ✅ Required
  debug: true,                        // Optional: enable console logging
  autoShowModal: true,                // Optional: auto-show badge modal (default: true)
  modalContainer: '#modal-root'       // Optional: target container for modal (default: 'body')
});
```

## 👤 Register a User

You can register a user directly:

```code
await sdk.registerUser({
  user_id: '123',
  username: 'John Doe',
  email: 'john@example.org'
});
```
Alternatively, you can include user data as metadata in event tracking.

## 🎯 Track Events

Basic event tracking:
```code
await sdk.trackEvent('user_login', 'user-123');
```

Track an event with custom metadata:
```code
await sdk.trackEvent('course_completed', 'user-456', {
  'course_id': 'course-id-123'
});
```

## 🏅 Badge Operations

Fetch all active badges in your project:
```code
const badges = await sdk.fetchBadges();
```

Fetch badges earned by a specific user (by user_id or email):
```code
const userBadges = await sdk.getUserBadges('user-456');
```

Give a badge to a user manually:
```code
await sdk.giveUserBadge('badge_id', 'user_id');
```

## 📊 Rankings

Retrieve leaderboard data:
```code
const rankings = await sdk.getRankings({
  ranking_type: 'daily' // or 'weekly' | 'monthly'
});
```

## 🧪 Debugging

Enable debug logs by setting the debug flag to true during initialization:
```code
const sdk = new MedalForgeStudio({
  apiKey: 'your_api_key',
  secretKey: 'your_secret_key',
  debug: true
});
```

Logs will be printed in the browser console.

## 📚 TypeScript Support
This SDK is fully typed and compatible with TypeScript for better development experience and autocomplete.

## 📮 Support
Having trouble or need help?
Reach out to the MedalForge team at support@medalforge.io.

## 📝 License
MIT © MedalForge
