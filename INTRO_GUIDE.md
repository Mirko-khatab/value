# Website Intro Animation Guide

## Overview

A stunning multi-language intro animation that cycles through your sketch images and displays your slogan in three languages with smooth transitions on a beautiful #2E5A7A background.

## Features

- ✨ Smooth sketch image transitions (12 images) - cycles while text changes
- 🎨 Background grid of all sketches with fade-in effect
- 🎯 **Everything happens simultaneously** - sketches, text, and logo all visible
- 💫 Floating animated sketch elements
- 🌍 **Multi-language support** (English, Kurdish, Arabic)
- 🔄 Smooth language transitions with slide-up animations (text only, no labels)
- 🏢 **Logo always visible** at the bottom with bounce effect
- 📱 Fully responsive design
- ⚡ Language progress dots show which language is active
- 🎭 Beautiful language cycling with RTL support
- 🌙 Proper RTL (Right-to-Left) support for Kurdish and Arabic

## Languages Included

1. **English**: "We value your work"
2. **Kurdish** (کوردی): "بەها ئەدەین بەکارەکانتان"
3. **Arabic** (العربية): "نحن نقدر عملك"

## Preview

Visit `/intro-preview` to see the intro animation in action and test it.

## How to Use

### Option 1: Add to Homepage

To show the intro on your homepage on first visit, update `app/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import Intro from "@/app/ui/intro";
// ... other imports

export default function Page() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <>
      {showIntro && <Intro onComplete={handleIntroComplete} />}

      <ShowcaseLayout>{/* Your existing content */}</ShowcaseLayout>
    </>
  );
}
```

### Option 2: Add to Root Layout

To show intro on every page load (first visit only), update `app/layout.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import Intro from "@/app/ui/intro";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <html>
      <body>
        {showIntro && <Intro onComplete={handleIntroComplete} />}
        {children}
      </body>
    </html>
  );
}
```

### Option 3: Standalone Page

Use it as a dedicated intro page:

```tsx
import Intro from "@/app/ui/intro";
import { redirect } from "next/navigation";

export default function IntroPage() {
  return <Intro onComplete={() => redirect("/")} />;
}
```

## Customization

### Timing

Edit the duration values in `app/ui/intro.tsx`:

- `sketchDuration`: Time per sketch (default: 400ms)
- `sloganDuration`: Time showing each language (default: 1300ms)

### Colors

Change the background color in the component:

```tsx
style={{ backgroundColor: '#YourColor' }}
```

### Languages

Add or modify languages in the `languages` array:

```tsx
const languages: Language[] = [
  { text: "We value your work", dir: "ltr", name: "English" },
  { text: "بەها ئەدەین بەکارەکانتان", dir: "rtl", name: "کوردی" },
  { text: "نحن نقدر عملك", dir: "rtl", name: "العربية" },
  // Add more languages:
  { text: "Nous valorisons votre travail", dir: "ltr", name: "Français" },
];
```

### Animation Speed

- **Language transitions**: Adjust `sloganDuration` for how long each language displays
- **Slide animations**: Modify `transition-all duration-XXX` classes

## Technical Details

- Built with React hooks (useState, useEffect)
- Uses Next.js Image component for optimization
- Client-side only ('use client')
- Fixed positioning (z-50 layer)
- Automatic cleanup and completion callback
- **Multi-language state management** with language cycling
- **RTL (Right-to-Left) support** for Arabic and Kurdish
- **Smooth transitions** with cubic-bezier easing
- CSS-in-JS for custom animations
- Language progress indicators

## Tips

- The intro shows once per session (sessionStorage) or once ever (localStorage)
- **Total animation time**: ~8.7 seconds
  - 12 sketches × 400ms = 4.8s
  - 3 languages × 1300ms = 3.9s
- All 12 sketch images should be in `/public/sketch/` directory
- Logo image should be at `/public/image/value.png`
- Images are lazy-loaded except the first 4 for performance
- **Logo animation** has a bouncy entrance with scale and rotation
- **RTL text** automatically adjusts direction for Kurdish and Arabic
- Each language gets a smooth slide-up animation
- **Language progress dots** show which language is currently displayed
- The animation is **fully responsive** across all screen sizes

## Animation Sequence

**Everything happens simultaneously!**

1. **Top**: Sketch images cycle through 1-12 (400ms each)

   - Background grid fills in progressively
   - Center spotlight shows current sketch with glow
   - Floating sketches animate around

2. **Middle**: Text changes through 3 languages (1.3s each)

   - English text appears: "We value your work" (1.3s)
   - Transitions to Kurdish: "بەها ئەدەین بەکارەکانتان" (1.3s)
   - Transitions to Arabic: "نحن نقدر عملك" (1.3s)
   - Each text slides up smoothly with animation

3. **Bottom**: Logo visible throughout

   - Appears immediately with bounce animation
   - Stays visible while everything else changes
   - Progress dots below show language progress

4. **Fade out and complete** (1 second)

Enjoy your spectacular multi-language intro! 🚀✨🌍
