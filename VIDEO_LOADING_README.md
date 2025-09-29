# Video Loading System

A comprehensive, responsive video loading system for your Next.js application that works across all devices and provides smooth loading experiences.

## Features

- 🎥 **Video Loading**: Uses your custom video file for loading animations
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- 🌙 **Dark Mode Support**: Automatically adapts to your theme
- ⚡ **Performance Optimized**: Multiple video formats and fallbacks
- 🎛️ **Easy Integration**: Simple API for programmatic control
- 🔧 **Development Tools**: Built-in controls for testing

## Quick Start

### 1. Basic Usage in Loading Components

Replace your existing loading components with the video loading:

```tsx
// app/loading.tsx or any loading.tsx file
import VideoLoading from "@/app/ui/video-loading";

export default function Loading() {
  return <VideoLoading autoHide={true} hideDelay={1500} />;
}
```

### 2. Programmatic Loading Control

Use the loading context for dynamic loading states:

```tsx
import { useLoadingState } from "@/app/ui/loading-overlay";

function MyComponent() {
  const { withLoading, showLoading, hideLoading } = useLoadingState();

  const handleAsyncOperation = async () => {
    // Automatic loading management
    await withLoading(() => fetchData(), "Loading data...");
  };

  const handleManualLoading = () => {
    showLoading("Processing...");
    // Do something
    hideLoading();
  };
}
```

## Video File Setup

### Supported Formats

- **Primary**: `/public/video/loading.MOV` (QuickTime)
- **Fallback**: `/public/video/loading.mp4` (MP4)
- **Web**: `/public/video/loading.webm` (WebM)

### Recommended Video Specifications

- **Duration**: 2-5 seconds for optimal UX
- **Resolution**: 1920x1080 or higher
- **Aspect Ratio**: 16:9 or 4:3
- **File Size**: Keep under 5MB for fast loading
- **Format**: H.264 codec for best compatibility

## Responsive Behavior

### Mobile Devices (< 640px)

- Video covers full screen
- Optimized for portrait orientation
- Touch-friendly controls

### Tablets (641px - 1024px)

- Video contained within 90% of screen
- Maintains aspect ratio
- Responsive text sizing

### Desktop (> 1025px)

- Video contained within 80% of screen
- High DPI display optimization
- Full feature set available

## API Reference

### VideoLoading Component

```tsx
interface VideoLoadingProps {
  onComplete?: () => void; // Callback when loading completes
  autoHide?: boolean; // Auto-hide after delay (default: true)
  hideDelay?: number; // Delay before hiding in ms (default: 2000)
  className?: string; // Additional CSS classes
}
```

### useLoadingState Hook

```tsx
const {
  isLoading, // Current loading state
  showLoading, // Show loading with message
  hideLoading, // Hide loading
  withLoading, // Wrap async function with loading
} = useLoadingState();
```

### useVideoLoading Hook

```tsx
const { isLoading, showLoading, hideLoading } = useVideoLoading();
```

## Customization

### CSS Customization

The video loading system uses CSS custom properties that can be overridden:

```css
.video-loading-container {
  background: var(--color-background);
  /* Your custom styles */
}

.video-loading-video {
  /* Video-specific styles */
}
```

### Theme Integration

The system automatically uses your existing theme colors:

- Primary color for loading spinners
- Background colors for overlays
- Text colors for loading messages

## Performance Considerations

### Video Optimization

1. **Compress videos** using tools like HandBrake or FFmpeg
2. **Use multiple formats** for better browser support
3. **Consider poster images** for faster initial display
4. **Preload videos** for instant playback

### Loading States

1. **Use appropriate delays** based on operation complexity
2. **Provide meaningful messages** to users
3. **Handle errors gracefully** with fallback states

## Development Tools

In development mode, you'll see:

- **Skip button**: Skip current loading animation
- **Replay button**: Restart video animation
- **Reset button**: Reset app entrance animation

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Video Not Playing

1. Check file paths and formats
2. Ensure video files are in `/public/video/`
3. Verify browser support for video formats
4. Check console for errors

### Performance Issues

1. Optimize video file size
2. Use appropriate video resolution
3. Consider using poster images
4. Test on various devices

### Responsive Issues

1. Check CSS media queries
2. Test on different screen sizes
3. Verify viewport meta tag
4. Check for conflicting styles

## Examples

See `/app/demo-loading/page.tsx` for comprehensive usage examples and testing interface.

## Integration Checklist

- [ ] Add video files to `/public/video/`
- [ ] Update loading.tsx files
- [ ] Wrap app with LoadingProvider
- [ ] Test on different devices
- [ ] Optimize video files
- [ ] Customize loading messages
- [ ] Test error scenarios

