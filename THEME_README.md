# Theme System Documentation

## Overview
This project now includes a comprehensive dark/light mode theme system with automatic color adaptation and easy-to-use text components.

## Features

### 🎨 Theme Switching
- **Automatic Detection**: Detects user's system preference for dark/light mode
- **Persistent Storage**: Remembers user's theme choice in localStorage
- **Manual Toggle**: Click the theme toggle button in the navigation to switch themes
- **Smooth Transitions**: All color changes include smooth transitions

### 🧭 Always-Visible Navigation
- **Fixed Position**: Navigation bar stays visible when scrolling
- **Backdrop Blur**: Semi-transparent background with blur effect
- **Theme-Aware**: Automatically adapts colors based on current theme
- **High Z-Index**: Ensures navigation is always on top

### 📝 Text Components
The new `Text` component automatically adapts to theme changes:

```tsx
import Text from "@/app/ui/text";

// Basic usage
<Text>Default text</Text>

// With variants
<Text variant="primary">Primary colored text</Text>
<Text variant="secondary">Secondary colored text</Text>
<Text variant="tertiary">Tertiary colored text</Text>

// With sizes
<Text size="xs">Extra small</Text>
<Text size="sm">Small</Text>
<Text size="base">Base size</Text>
<Text size="lg">Large</Text>
<Text size="xl">Extra large</Text>
<Text size="2xl">2X large</Text>
<Text size="3xl">3X large</Text>
<Text size="4xl">4X large</Text>
<Text size="5xl">5X large</Text>

// With weights
<Text weight="light">Light weight</Text>
<Text weight="normal">Normal weight</Text>
<Text weight="medium">Medium weight</Text>
<Text weight="semibold">Semibold weight</Text>
<Text weight="bold">Bold weight</Text>

// As different HTML elements
<Text as="h1">Heading 1</Text>
<Text as="h2">Heading 2</Text>
<Text as="p">Paragraph</Text>
<Text as="span">Span text</Text>

// Combining props
<Text variant="primary" size="xl" weight="bold" as="h1">
  Large bold primary heading
</Text>
```

### 🎯 Theme-Aware Colors
The system automatically provides different colors for light and dark modes:

- **Primary**: `#2E5A7A` (light) / `#4FBADB` (dark)
- **Secondary**: `#7B7B85` (light) / `#9CA3AF` (dark)
- **Tertiary**: `#4FBADB` (light) / `#60A5FA` (dark)
- **Text**: `#636464` (light) / `#F3F4F6` (dark)
- **Background**: `#FFFFFF` (light) / `#111827` (dark)
- **Surface**: `#F9FAFB` (light) / `#1F2937` (dark)
- **Border**: `#E5E7EB` (light) / `#374151` (dark)

## Usage Examples

### Using Theme Context
```tsx
import { useTheme } from "@/app/lib/theme-context";

function MyComponent() {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <div style={{ backgroundColor: colors.primary }}>
        Dynamic primary color background
      </div>
    </div>
  );
}
```

### Using CSS Custom Properties
You can also use CSS custom properties in your styles:

```css
.my-component {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

### Using Tailwind Classes
The system provides theme-aware Tailwind classes:

```tsx
<div className="bg-primary text-white">
  Primary background
</div>
<div className="text-secondary">
  Secondary text
</div>
<div className="border-primary">
  Primary border
</div>
```

## File Structure

```
app/
├── lib/
│   ├── theme-context.tsx    # Theme context provider
│   └── utils.ts             # Utility functions including `cn`
├── ui/
│   ├── navigation.tsx       # Updated navigation with theme toggle
│   ├── theme-toggle.tsx     # Theme toggle button component
│   ├── text.tsx             # Theme-aware text component
│   ├── theme-demo.tsx       # Demo component showcasing themes
│   └── global.css           # Global styles with CSS custom properties
└── layout.tsx               # Root layout with ThemeProvider
```

## Implementation Details

### Theme Context
- Uses React Context API for global theme state
- Automatically detects system preference
- Persists theme choice in localStorage
- Provides theme-aware color values

### CSS Custom Properties
- Defined in `:root` for light mode
- Overridden in `.dark` class for dark mode
- Smooth transitions between themes

### Tailwind Integration
- Custom color classes that use CSS custom properties
- Automatic dark mode support via `dark:` prefix
- Seamless integration with existing Tailwind classes

## Browser Support
- Modern browsers with CSS custom properties support
- Automatic fallback to light mode for older browsers
- Progressive enhancement approach

## Performance
- Minimal runtime overhead
- CSS custom properties for efficient color switching
- No unnecessary re-renders
- Optimized transitions

## Future Enhancements
- Additional theme variants (e.g., high contrast, sepia)
- User-defined custom themes
- Animation preferences
- Accessibility improvements
