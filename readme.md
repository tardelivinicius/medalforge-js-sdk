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


## 🔍 Before You Begin

Complete these required steps before using the SDK:

1. **Create a MedalForge Account**

- Sign up at  [medalforge.io](https://medalforge.io) and verify your email.

2. **Set Up Your Project**

- Create a new project in your first access

- Configure basic project settings

3. **Get API Credentials**
 - Navigate to: Project Settings → API Keys → Create Key

 - Save the credentials

4. **Design Your Badges**

  - In Badge Studio:

  - Create badges with custom icons/colors

  - Define unlock conditions (events, thresholds)

5. **Test rules in Sandbox mode**

```code
⚠️ Important: The SDK won't function without valid API keys and properly configured badges.
```

## 📦 Installation

Install the SDK using your preferred package manager:

```bash
npm install @medalforge/sdk
# or
yarn add @medalforge/sdk
# or
pnpm add @medalforge/sdk
```

## 🛠 Quick Start

```code
import MedalForgeStudio from '@medalforge/sdk';

// Initialize the SDK
const sdk = new MedalForgeStudio({
  apiKey: 'YOUR_API_KEY',      // Required
  secretKey: 'YOUR_SECRET_KEY', // Required
  debug: true,                // Enable debug logs (optional)
  autoShowModal: true         // Auto-show badge modals (default: true)
});

// Register a new user
await sdk.users.register({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
});

// Track a user event
await sdk.events.track('login', 'user-123');
```

| Option          | Type       | Required | Default        | Description                                      |
|-----------------|------------|----------|----------------|--------------------------------------------------|
| `apiKey`        | `string`   | Yes      | -              | Your project's public API key                    |
| `secretKey`     | `string`   | Yes      | -              | Your project's secret key                        |
| `debug`         | `boolean`  | No       | `false`        | Enable debug logging                             |
| `autoShowModal` | `boolean`  | No       | `true`         | Auto-show badge modals on unlock                 |
| `environment`   | `string`   | No       | `'production'` | `'production'`, `'staging'`, or `'development'`  |
| `modalContainer`| `HTMLElement` | No    | `document.body`| DOM element to mount modals                      |


## 👤 Register a User

You can register a user directly:

```code
await sdk.users.register({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
});
```
Alternatively, you can include user data as metadata in event tracking.

## 🎯 Track Events

Basic event tracking:
```code
// Basic event tracking
await sdk.events.track('page_view', 'user-123');

// With metadata
await sdk.events.track('purchase', 'user-123', {
  amount: 99.99,
  items: ['product-1', 'product-2']
});

// With options
await sdk.events.track('login', 'user-123', {}, {
  silent: true,       // Suppress badge notifications
  timestamp: new Date() // Custom timestamp
});

// With userData (don't require use registerUser)
await sdk.events.track('course_completed', 'user-123', {}, {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  courseId: '123
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

# Advanced Usage

## Manual Badge Display
When autoShowModal: false, you'll need to manually show badges using the response from event tracking:
```code
// Initialize with autoShowModal disabled
const sdk = new MedalForgeStudio({
  apiKey: 'your_key',
  secretKey: 'your_secret',
  autoShowModal: false // Disable auto-display
});

// Track event and handle badge manually
const result = await sdk.events.track('achievement', 'user-123');

if (result?.event === 'badge_unlocked') {
  // Manually display the badge
  sdk.modal.show({
    badge: result.badge,
    verification_url: result.verification_url
  });
}
```

##  Batch Processing
```code
await sdk.events.batchTrack([
  { event: 'login', userId: 'user-123' },
  { event: 'tutorial_complete', userId: 'user-123' }
]);
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

## Error Handling
The SDK provides detailed error information:

```
try {
  await sdk.events.track('login', 'user-123');
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error ${error.status}:`, error.message);
    console.error('Details:', error.details);
  } else {
    console.error('Unexpected error:', error);
  }
}
```
Logs will be printed in the browser console.

## 📚 TypeScript Support
This SDK is fully typed and compatible with TypeScript for better development experience and autocomplete.
Full type definitions are included:
```code
import type { Badge, User, EventResponse } from '@medalforge/sdk';

function handleBadgeUnlock(badge: Badge) {
  // Type-safe badge properties
  console.log(badge.name, badge.styles?.icon?.name);
}
```
## 📮 Support
Having trouble or need help?
Reach out to the MedalForge team at support@medalforge.io.

## 📝 License
MIT © MedalForge
