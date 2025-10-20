# 📁 Folder Structure - Visual Guide

## Complete Directory Tree

```
C:\Users\user\Desktop\socket-tester\
│
├── 📄 START_HERE.md                    ← **START HERE! Quick 3-step setup**
├── 📄 README.md                        ← Complete documentation
├── 📄 SETUP_INSTRUCTIONS.md            ← Detailed setup guide
├── 📄 WHAT_WAS_CREATED.md             ← Overview of all files
├── 📄 FOLDER_STRUCTURE.md             ← This file (visual guide)
│
├── 📄 package.json                     ← Dependencies & scripts
├── 📄 package-lock.json                ← (Generated) Dependency lock
├── 📄 vite.config.js                   ← Vite configuration
├── 📄 index.html                       ← HTML entry point
├── 📄 .gitignore                       ← Git ignore rules
│
├── 📁 node_modules/                    ← (After npm install) Dependencies
│
└── 📁 src/                             ← **Source code**
    │
    ├── 📄 main.jsx                     ← React app entry point
    ├── 📄 App.jsx                      ← Main app component
    ├── 📄 App.css                      ← App-specific styles
    ├── 📄 index.css                    ← Global styles & CSS variables
    │
    ├── 📁 hooks/                       ← **Custom React hooks**
    │   └── 📄 useSocket.js             ← Socket.IO connection hook
    │
    └── 📁 components/                  ← **React components**
        ├── 📄 Login.jsx                ← Authentication component
        ├── 📄 Login.css                ← Login styles
        │
        ├── 📄 Instructions.jsx         ← Usage instructions
        ├── 📄 Instructions.css         ← Instructions styles
        │
        ├── 📄 NotificationsPanel.jsx   ← Notifications module
        ├── 📄 QueuePanel.jsx          ← Queue management module
        ├── 📄 ChatPanel.jsx           ← Chat/messaging module
        └── 📄 ConsultationPanel.jsx   ← Video consultation module
```

---

## 📊 File Count

| Type | Count | Files |
|------|-------|-------|
| 📚 Documentation | 5 | START_HERE, README, SETUP_INSTRUCTIONS, WHAT_WAS_CREATED, FOLDER_STRUCTURE |
| ⚙️ Configuration | 4 | package.json, vite.config.js, index.html, .gitignore |
| 🎨 Source (JSX) | 9 | main, App, Login, Instructions, 4 panels, useSocket |
| 💅 Styles (CSS) | 4 | index.css, App.css, Login.css, Instructions.css |
| **Total** | **22** | **All files** |

---

## 🗂️ What's in Each Folder

### Root Directory (`socket-tester/`)

Contains:
- All documentation files
- Configuration files
- Entry point (index.html)
- Dependencies (package.json)

**Key files to read:**
1. `START_HERE.md` - Quick setup
2. `README.md` - Full docs
3. `package.json` - Dependencies

### `/src/` - Source Code

All React application code:
- `main.jsx` - Initializes React app
- `App.jsx` - Main application component
- CSS files for styling

### `/src/hooks/` - Custom Hooks

Reusable React hooks:
- `useSocket.js` - Socket.IO connection management
  - Handles connection/disconnection
  - Manages authentication
  - Provides socket instance to components

### `/src/components/` - React Components

All UI components:

| Component | Purpose | Features |
|-----------|---------|----------|
| `Login.jsx` | Authentication | JWT/credentials login |
| `Instructions.jsx` | User guide | Complete testing guide |
| `NotificationsPanel.jsx` | Notifications | Subscribe, receive, mark read |
| `QueuePanel.jsx` | Queue | Join, position updates, call next |
| `ChatPanel.jsx` | Chat | Messages, typing, read receipts |
| `ConsultationPanel.jsx` | Video calls | Join, start/end, signaling |

---

## 📦 Dependencies (package.json)

### Production Dependencies

```json
{
  "react": "^18.2.0",           // UI framework
  "react-dom": "^18.2.0",       // React DOM renderer
  "socket.io-client": "^4.5.4"  // Socket.IO client
}
```

### Development Dependencies

```json
{
  "@vitejs/plugin-react": "^4.2.1",  // Vite React plugin
  "vite": "^5.0.8"                   // Build tool
}
```

### Scripts

```json
{
  "dev": "vite",              // Start dev server
  "build": "vite build",      // Build for production
  "preview": "vite preview"   // Preview production build
}
```

---

## 🎨 CSS Architecture

### Global Styles (`index.css`)

- CSS Variables (colors, spacing)
- Reset/normalize
- Utility classes
- Component base styles

**Variables:**
```css
--primary: #3498db
--success: #2ecc71
--danger: #e74c3c
--warning: #f39c12
```

### Component Styles

- `App.css` - App layout, tabs, cards
- `Login.css` - Login form styles
- `Instructions.css` - Instructions layout

**Architecture:**
```
Global (index.css)
  └── App (App.css)
       ├── Login (Login.css)
       └── Instructions (Instructions.css)
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component
    ↓
useSocket Hook
    ↓
Socket.IO Client
    ↓
Backend Server
    ↓
Database / Logic
    ↓
Socket Event
    ↓
Component Update
    ↓
UI Re-render
```

---

## 🚀 Build Process

### Development

```bash
npm run dev
```

1. Vite starts dev server
2. Loads React app
3. Hot module replacement enabled
4. Runs on http://localhost:3000

### Production

```bash
npm run build
```

1. Vite bundles app
2. Optimizes assets
3. Outputs to `dist/` folder
4. Ready to deploy

### Preview

```bash
npm run preview
```

1. Serves production build
2. Test before deployment
3. Runs on http://localhost:4173

---

## 📂 After Installation

After running `npm install`, you'll have:

```
socket-tester/
├── node_modules/        ← 📦 All dependencies (~200MB)
│   ├── react/
│   ├── socket.io-client/
│   ├── vite/
│   └── ... (hundreds more)
│
├── package-lock.json    ← 🔒 Dependency lock file
│
└── ... (rest of files)
```

---

## 🎯 File Relationships

### Entry Flow

```
index.html
    ↓ (loads)
main.jsx
    ↓ (renders)
App.jsx
    ↓ (uses)
useSocket.js
    ↓ (provides socket to)
Components (Login, Panels)
```

### Component Tree

```
App
├── Login (if not authenticated)
└── Tabs (if authenticated)
    ├── Instructions
    ├── NotificationsPanel
    ├── QueuePanel
    ├── ChatPanel
    └── ConsultationPanel
```

### Style Cascade

```
index.css (global)
    ↓
App.css (app-wide)
    ↓
Component.css (specific)
```

---

## 🔍 Where to Find Things

### Need to... Look in...

| Task | File |
|------|------|
| Change server URL | `src/hooks/useSocket.js` |
| Add new component | `src/components/` |
| Modify styles | `src/*.css` |
| Update dependencies | `package.json` |
| Change port | `vite.config.js` |
| Add environment vars | Create `.env` |

---

## 🛠️ How to Modify

### Add New Module

1. Create `src/components/MyModule.jsx`
2. Import in `App.jsx`
3. Add tab button in `App.jsx`
4. Add route in tab content

### Change Styling

1. **Global:** Edit `src/index.css`
2. **App:** Edit `src/App.css`
3. **Component:** Edit component CSS

### Add Dependencies

```bash
npm install package-name
```

Updates `package.json` and `package-lock.json`

---

## 📝 Important Files Explained

### `package.json`
- Lists all dependencies
- Defines npm scripts
- Project metadata

### `vite.config.js`
- Vite configuration
- Port settings
- Plugins

### `index.html`
- HTML entry point
- Loads React app
- <div id="root">

### `main.jsx`
- React initialization
- Renders App into DOM

### `App.jsx`
- Main application
- Tab navigation
- Route management

### `useSocket.js`
- Socket connection logic
- Authentication
- Lifecycle management

---

## 🎉 You're All Set!

This is your complete folder structure. Everything is:

✅ **Organized** - Logical structure
✅ **Documented** - Every file explained
✅ **Ready to Use** - Just npm install
✅ **Easy to Modify** - Clear architecture
✅ **Production Ready** - Build & deploy

**Next Steps:**

1. Read `START_HERE.md` for quick setup
2. Run `npm install` to get dependencies
3. Run `npm run dev` to start
4. Open http://localhost:3000

**Happy Coding! 🚀**

