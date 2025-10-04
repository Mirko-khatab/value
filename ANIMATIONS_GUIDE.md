# Website Animations Guide 🎬✨

Your website features **TWO amazing animations** working intelligently together for the perfect user experience!

## 🎯 The Perfect Sequence

### First Visit to Homepage:

```
Sketch Intro (8.7s) → Multi-language showcase with logo & sketches
      ↓
Main Website → Your beautiful homepage
```

### Navigation & Other Pages:

```
Video Loading (2-4s) → Smooth page transition with video
      ↓
Page Content
```

### Returning to Homepage:

```
Homepage loads instantly → No animations, direct access
```

---

## 🎬 Animation 1: Video Loading

**Location:** Site-wide (shown in root layout)  
**Duration:** 2-4 seconds  
**Storage:** `localStorage.getItem("hasVisited")`

### Features:

- ✨ Beautiful video entrance with your brand video
- 🎨 Adapts to light/dark theme
- ⚡ Shows once per device (stored in localStorage)
- 🌈 Smooth fade-out transition

### Files:

- Component: `app/ui/video-loading.tsx`
- Wrapper: `app/ui/app-entrance.tsx`
- Used in: `app/layout.tsx`

---

## 🎨 Animation 2: Sketch Intro

**Location:** Homepage only (`/`)  
**Duration:** 8.7 seconds  
**Storage:** `localStorage.getItem("hasSeenIntro")`

### Features:

- ✨ 12 sketch images animating smoothly
- 🎨 Background grid with fade-in effect
- 🏢 Animated logo with bounce effect
- 🌍 **Multi-language support** (English, Kurdish, Arabic)
- 🔄 Fast language transitions (1.3s each)
- 🌙 RTL support for Kurdish and Arabic
- 💫 Floating elements and decorations
- ⚡ Progress indicators

### Languages:

1. **English**: "We value your work"
2. **Kurdish** (کوردی): "بەها ئەدەین بەکارەکانتان"
3. **Arabic** (العربية): "نحن نقدر عملك"

### Files:

- Component: `app/ui/intro.tsx`
- Used in: `app/page.tsx`
- Preview: `app/intro-preview/page.tsx`

---

## 🔄 How It Works

### First Visit to Homepage:

1. **User lands on homepage** → Sketch Intro plays (8.7s)
2. **Intro completes** → `hasSeenIntro` is set in localStorage
3. **Main website appears** → User can browse normally

### Navigation Flow:

- **User navigates** (Dashboard, About, etc.) → Video Loading shows (2-4s)
- **Page changes** → Video Loading provides smooth transition
- **Back to homepage** → Loads instantly (no animations)

### Returning Visits:

- **Homepage** → Loads instantly, no intro
- **Other pages** → Video loading already shown, quick access

---

## 🎛️ Customization

### Video Loading Timing

Edit `app/ui/app-entrance.tsx`:

```tsx
hideDelay={hasVisited ? 2000 : 4000}
//              ↑            ↑
//         Returning    First-time
//         visitors     visitors
```

### Sketch Intro Timing

Edit `app/ui/intro.tsx`:

```tsx
const sketchDuration = 400; // Time per sketch (ms)
const sloganDuration = 1300; // Time per language (ms)
```

### Change Languages

Edit `app/ui/intro.tsx`:

```tsx
const languages: Language[] = [
  { text: "We value your work", dir: "ltr", name: "English" },
  { text: "بەها ئەدەین بەکارەکانتان", dir: "rtl", name: "کوردی" },
  { text: "نحن نقدر عملك", dir: "rtl", name: "العربية" },
  // Add more:
  { text: "Your text here", dir: "ltr", name: "YourLang" },
];
```

### Disable One Animation

**To disable Video Loading:**
Comment out in `app/layout.tsx`:

```tsx
// <AppEntrance />
```

**To disable Sketch Intro:**
Comment out in `app/page.tsx`:

```tsx
// {showIntro && <Intro onComplete={handleIntroComplete} />}
```

---

## 🛠️ Development Tools

### Reset Video Loading

Run in browser console:

```javascript
localStorage.removeItem("hasVisited");
```

### Reset Sketch Intro

Run in browser console:

```javascript
localStorage.removeItem("hasSeenIntro");
```

### Reset Both

Run in browser console:

```javascript
localStorage.clear();
```

Or use **Incognito/Private mode** to test fresh visits!

---

## 📊 Animation Timing

### First Homepage Visit:

- Sketch Intro: ~8.7 seconds
- **Total:** ~8.7 seconds

### Page Navigation:

- Video Loading: ~2-4 seconds per page transition

### Breakdown:

```
Video Loading (2-4s)
├─ Video plays
├─ Theme adaptation
└─ Fade out

Sketch Intro (8.7s)
├─ Sketches cycle: 4.8s (12 × 400ms)
├─ Languages: 3.9s (3 × 1.3s)
│  ├─ Logo appears
│  ├─ English: 1.3s
│  ├─ Kurdish: 1.3s
│  └─ Arabic: 1.3s
└─ Fade out: 1s
```

---

## 💡 Best Practices

1. **Keep both animations** - They complement each other perfectly!
2. **Video Loading** = Brand entrance (short & sweet)
3. **Sketch Intro** = Mission statement (engaging showcase)
4. **Don't show too often** - Once per device is perfect
5. **Mobile friendly** - Both animations are fully responsive

---

## 🎨 Design Philosophy

### Why Two Animations?

1. **Sketch Intro** (Homepage first visit)

   - Showcases your work process
   - Multi-language inclusivity (English, Kurdish, Arabic)
   - Displays your logo beautifully
   - Deeper brand story

2. **Video Loading** (Navigation & page transitions)
   - Quick brand recognition
   - Smooth page transitions
   - Professional loading experience

Together they create a **memorable first impression** and smooth navigation experience!

---

## 📱 Responsive Design

Both animations work beautifully on:

- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop monitors
- 📺 Large displays

---

## 🚀 Performance

- **Video**: Optimized WebM format
- **Images**: Next.js Image optimization
- **Lazy loading**: Non-critical images
- **localStorage**: Prevents re-rendering
- **Smooth 60fps** animations

---

## 🎉 Result

A **professional, modern, and unforgettable** website experience that:

- ✨ **Sketch Intro** on first homepage visit - showcases your brand story in 3 languages
- 🎬 **Video Loading** for smooth page transitions and navigation
- ⚡ **Respects user time** - intro shows once, quick loading for navigation
- 🌍 **Multi-language welcome** - English, Kurdish, Arabic
- 💫 **Professional polish** - smooth animations throughout the site
- 🎯 **Smart behavior** - knows when to show which animation

Enjoy your spectacular website animations! 🚀✨🌍
