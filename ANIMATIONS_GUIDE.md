# Website Intro Animation Guide 🎬✨

Your website features an **amazing sketch intro animation** that creates an unforgettable first impression!

## 🎯 The Perfect Sequence

### For First-Time Visitors:

```
1. Sketch Intro (8.7s) → Multi-language showcase with logo & sketches
      ↓
2. Main Website → Your beautiful homepage
```

### For Returning Visitors:

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

### First Visit Flow:

1. **User lands on homepage** → Sketch Intro plays
2. **Intro completes** → `hasSeenIntro` is set in localStorage
3. **Main website appears** → User can browse normally

### Returning Visit:

- User comes back → Animation is skipped
- Instant access to website content

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

## 📊 Total Experience Time

### First-Time Visitor:

- Video Loading: ~2-4 seconds
- Sketch Intro: ~8.7 seconds
- **Total:** ~10.7-12.7 seconds

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

1. **Video Loading**

   - Quick brand recognition
   - Sets the mood
   - Smooth entry transition

2. **Sketch Intro**
   - Showcases your work process
   - Multi-language inclusivity
   - Deeper brand story

Together they create a **memorable first impression** without being overwhelming!

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

A **professional, modern, and unforgettable** website entrance that:

- Showcases your brand
- Welcomes in multiple languages
- Respects user time (shows once)
- Creates lasting impression
- Sets you apart from competition

Enjoy your spectacular dual-animation entrance! 🚀✨🌍
