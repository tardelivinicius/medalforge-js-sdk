# 🏅 MedalForge SDK

![npm](https://img.shields.io/npm/v/@medalforge/sdk)
![License](https://img.shields.io/npm/l/@medalforge/sdk)

**Official JavaScript/TypeScript SDK for MedalForge**
Add gamification to your app in minutes — track achievements, show badges, and rank your users effortlessly.

---

## 🚀 Features

- 🔒 Simple & secure API integration
- 🏆 Complete medal management system
- 🎖 Display medals in modal or inline views
- 🧑‍🤝‍🧑 User management and medal awarding
- 🥇 View and retrieve user rankings
- ⚡️ Auto-show medal popups
- 🛠 TypeScript support
- 🎨 Customizable display options
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
const response = await sdk.users.register({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
});

// Fetch active badges
const badges = await sdk.badges.list();

// Send event_type registered on Badge to track
const response = await sdk.events.track('course_completed', 'user-123');

```

| Option          | Type       | Required | Default        | Description                                      |
|-----------------|------------|----------|----------------|--------------------------------------------------|
| `apiKey`        | `string`   | Yes      | -              | Your project's public API key                    |
| `secretKey`     | `string`   | Yes      | -              | Your project's secret key                        |
| `debug`         | `boolean`  | No       | `false`        | Enable debug logging                             |
| `autoShowModal` | `boolean`  | No       | `true`         | Auto-show badge modals on unlock                 |
| `environment`   | `string`   | No       | `'production'` | `'production'`, `'staging'`, or `'development'`  |
| `modalContainer`| `HTMLElement` | No    | `document.body`| DOM element to mount modals                      |


# 📚 API Reference

## 👤 Users Management

sdk.users.register(userData)
- Register a new user in the system.

```bash
sdk.users.register(userData)

await sdk.users.register({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
});
```

sdk.users.update(userData)
- Update an existing user's information.

```bash
await sdk.users.update({
  id: 'user-123',
  name: 'Johnathan Doe', // Updated name
  email: 'john.doe@example.com' // Updated email
});
```

Alternatively, you can include user data as metadata in event tracking.

## 🏅 Medals Management

sdk.medals.list()
- List all available medals in the system.

- Returns: Promise<Medal[]>

```bash
const allMedals = await sdk.medals.list();
```

sdk.medals.get(medalId)
- Get details of a specific medal.

Parameters:
- medalId: string - ID of the medal to retrieve

- Returns: Promise<Medal>

```bash
const medal = await sdk.medals.get('medal-123');
console.log(medal);
```

## 🎯 Track Events

Basic event tracking:
```bash
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

## 👤🏅 User Medals Operations

sdk.userMedals.award(userId, medalId)
- Award a medal to a user.

Parameters:
- userId: string - ID of the user
- medalId: string - ID of the medal to award


```bash
await sdk.userMedals.award('user-123', 'medal-456');
```

sdk.userMedals.revoke(userId, medalId)
- Revoke a medal from a user.

Parameters: Same as award


```bash
await sdk.userMedals.revoke('user-123', 'medal-456');
```

sdk.userMedals.getAll(userId)
- Get all medals awarded to a specific user.

Parameters:
- userId: string - ID of the user

- Returns: Promise<UserMedal[]>

```bash
const userMedals = await sdk.userMedals.getAll('user-123');
console.log(userMedals);
```

## 🏅 Medal Viewer

sdk.viewer.displayMedals(medals, options?)
- Display medals in a modal or inline container.

Parameters:
- medals: Medal | Medal[] - Single medal or array of medals to display
- options: Object (optional)

Display Options:

```bash
{
  displayMode?: 'modal' | 'inline'; // Default: 'modal'
  targetContainer?: HTMLElement;    // Required for inline mode
  gridClass?: string;              // CSS classes for grid layout
  containerClass?: string;         // CSS classes for container
}
```

- Examples

Show single medal in modal:
```bash
const medal = await sdk.medals.get('medal-123');
await sdk.viewer.displayMedals(medal);
```

Show multiple medals inline:
```bash
const medals = await sdk.medals.list();
const container = await sdk.viewer.displayMedals(medals, {
  displayMode: 'inline',
  targetContainer: document.getElementById('medals-container')
});
```

Custom grid layout:
```bash
await sdk.viewer.displayMedals(medals, {
  displayMode: 'inline',
  gridClass: 'grid grid-cols-3 gap-2',
  containerClass: 'p-2 bg-gray-100 rounded-lg',
  targetContainer: document.getElementById('medals-container')
});
```

sdk.viewer.displayUserBadges(userId, options?)
- Display all medals for a specific user.

Parameters:
- userId: string - ID of the user
- options: Object (optional) - Display options

Display Options:
```bash
{
  showUnearned?: boolean;          // Show unearned medals (default: true)
  displayMode?: 'modal' | 'inline'; // Default: 'modal'
  targetContainer?: HTMLElement;    // Required for inline mode
  gridClass?: string;              // CSS classes for grid layout
  unearnedStyles?: {               // Styles for unearned medals
    opacity?: string;
    grayscale?: string;
  };
}
```

Examples:

Show all user medals (earned and unearned):
```bash
await sdk.viewer.displayUserBadges('user-123');
```

Show only earned medals:
```bash
await sdk.viewer.displayUserBadges('user-123', {
  showUnearned: false
});
```

Custom inline display:
```bash
await sdk.viewer.displayUserBadges('user-123', {
  showUnearned: true,
  displayMode: 'inline',
  targetContainer: document.getElementById('user-medals'),
  gridClass: 'grid grid-cols-5 gap-4',
  unearnedStyles: {
    opacity: '50%',
    grayscale: '80%'
  }
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
  sdk.modal.show(badge);
}
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
