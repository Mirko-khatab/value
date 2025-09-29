# Video Loading Theme Integration Guide

## 🎨 Background Modes

Your video loading component now supports three different background modes that automatically adapt to your light/dark theme:

### 1. **Blend Mode** (Default)

```tsx
<VideoLoading backgroundMode="blend" />
```

- **Light Theme**: Uses `multiply` blend mode with higher brightness
- **Dark Theme**: Uses `screen` blend mode with lower brightness
- **Best For**: Videos with neutral/white backgrounds
- **Effect**: Video colors blend naturally with your theme colors

### 2. **Overlay Mode**

```tsx
<VideoLoading backgroundMode="overlay" />
```

- Adds a subtle color overlay using your theme's primary and tertiary colors
- Video opacity reduced to 70% for better blending
- **Best For**: Videos that need more theme integration
- **Effect**: Video appears tinted with your brand colors

### 3. **Solid Mode**

```tsx
<VideoLoading backgroundMode="solid" />
```

- Video plays at full opacity with no blending
- Background still matches your theme
- **Best For**: Videos with transparent backgrounds or when you want the original video appearance
- **Effect**: Original video with theme-matching background

## 🎭 How It Works

### Theme Detection

The component automatically detects your current theme (light/dark) and applies appropriate styles:

```tsx
// Light theme
mixBlendMode: "multiply";
filter: "brightness(1.1) contrast(0.9)";

// Dark theme
mixBlendMode: "screen";
filter: "brightness(0.9) contrast(1.1)";
```

### Background Layers

1. **Base Layer**: Gradient background using theme colors
2. **Video Layer**: Your video with theme-aware blending
3. **Overlay Layer**: Optional color overlay (overlay mode only)
4. **Content Layer**: Loading text and branding

## 🛠️ Customization

### Change Default Mode

Update the default in `app-entrance.tsx`:

```tsx
<VideoLoading
  backgroundMode="overlay" // Change this
  autoHide={true}
  hideDelay={hasVisited ? 2000 : 4000}
/>
```

### Theme Colors Used

- `colors.background`: Main background
- `colors.surface`: Gradient accent
- `colors.primary`: Overlay tint and branding
- `colors.tertiary`: Secondary overlay tint
- `colors.text`: Loading text

### CSS Classes

- `.video-loading-video`: Base video styles
- `.theme-blend`: Smooth transitions for theme changes

## 📱 Responsive Behavior

All background modes work across all device sizes:

- **Mobile**: Cover fit with center positioning
- **Tablet**: Contain fit with 90% max size
- **Desktop**: Optimized for larger screens

## 🎯 Recommendations

- **Corporate/Professional**: Use `blend` mode
- **Creative/Artistic**: Use `overlay` mode
- **Minimal/Clean**: Use `solid` mode

## 🔧 Troubleshooting

### Video not blending well?

Try different modes:

1. Switch from `blend` to `overlay`
2. Adjust video contrast in your video editor
3. Use `solid` mode for problematic videos

### Theme not changing?

Ensure your video loading component is inside the `ThemeProvider`:

```tsx
<ThemeProvider>
  <VideoLoading />
</ThemeProvider>
```

### Performance issues?

- Blend modes can be GPU intensive
- Use `solid` mode for better performance
- Ensure video files are optimized (use the provided script)
