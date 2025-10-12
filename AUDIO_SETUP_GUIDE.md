# Audio System Setup Guide

This guide explains how to set up and use the audio background music system for your landing page and intro.

## Features

✅ **Background Music for Landing Page & Intro**

- Upload audio files through the admin panel
- Automatic looping playback
- Mute/Unmute control
- Play/Stop control
- Choice of where to use the audio (Landing page, Intro, or Both)

## Setup Instructions

### 1. Database Setup

First, you need to create the `audios` table in your MySQL database. Run the SQL script:

```bash
mysql -u your_username -p your_database < database-schema-audio.sql
```

Or manually execute the SQL commands in `database-schema-audio.sql` using your preferred MySQL client.

### 2. Upload Audio Files

1. Navigate to the admin panel: `http://yourdomain.com/dashboard/audios`
2. Click "Add Audio" button
3. Fill in the form:

   - **Title (Kurdish, English, Arabic)**: Name for the audio track
   - **Audio File**: Upload your audio file (MP3, WAV, or OGG - Max 10MB)
   - **Use For**: Select where the audio should play:
     - `Landing Page Only`: Plays only on the main landing page
     - `Intro Only`: Plays only during the intro animation
     - `Both`: Plays on both landing and intro
   - **Active**: Check to enable the audio

4. Click "Create Audio"

### 3. Audio Player Controls

The audio player appears as floating buttons in the bottom-right corner:

- **Speaker Icon**: Mute/Unmute the audio
  - Blue icon = Audio is playing with sound
  - Red icon with X = Audio is muted
- **Play/Stop Icon**: Control playback
  - Orange Stop icon = Audio is currently playing
  - Green Play icon = Audio is stopped

### 4. How It Works

- **Auto-Play**: The audio attempts to auto-play when the page loads
  - Note: Some browsers block auto-play until user interaction
  - If auto-play is blocked, the user can click the Play button
- **Looping**: The audio automatically loops (repeats) when it finishes

- **Smart Loading**:
  - Only one active audio is loaded per page
  - The system fetches the most recent active audio based on the "Use For" setting
  - For "Both" setting, the audio plays on both landing and intro pages

### 5. Managing Audio Files

#### View All Audio Files

- Go to: `/dashboard/audios`
- Search, filter, and paginate through your audio files
- See preview player for each audio

#### Edit Audio

- Click the pencil icon next to any audio entry
- Update titles, replace audio file, change settings
- Click "Update Audio"

#### Delete Audio

- Click the trash icon next to any audio entry
- Confirm deletion
- Audio file is removed from both database and S3 storage

### 6. Supported Audio Formats

- **MP3** (audio/mpeg) - Recommended
- **WAV** (audio/wav)
- **OGG** (audio/ogg)

**Maximum file size**: 10MB

### 7. Best Practices

1. **Use Compressed Audio**: MP3 format at 128-192 kbps is ideal for web
2. **Keep Files Small**: Smaller files load faster
3. **Test Before Activating**: Upload and test the audio before setting it to active
4. **One Active Audio**: Keep only one audio active per use case (landing/intro)
5. **Volume Levels**: Ensure your audio is normalized and not too loud

### 8. Troubleshooting

**Audio doesn't play automatically:**

- This is normal browser behavior (auto-play policy)
- Users can click the Play button to start playback

**Audio file too large:**

- Compress your audio file
- Use online tools like Audacity to reduce file size
- Recommended: MP3 at 128-192 kbps

**Upload fails:**

- Check file format (must be MP3, WAV, or OGG)
- Ensure file is under 10MB
- Check your S3 storage permissions

**Multiple audios playing:**

- Only one audio should be active for each use case
- Deactivate other audios in the admin panel

### 9. Technical Details

**Components:**

- `/app/ui/audio-player.tsx` - Audio player component with controls
- `/app/api/audios/route.ts` - API endpoint for fetching active audio
- `/app/dashboard/audios/` - Admin panel pages
- `/app/ui/audio/` - Audio management UI components

**Database:**

- Table: `audios`
- Stores: titles (multi-language), audio URL, active status, use case

**Storage:**

- Audio files are stored in AWS S3
- Delivered via CloudFront CDN for fast loading

## Need Help?

If you encounter any issues:

1. Check browser console for errors
2. Verify database table is created correctly
3. Ensure S3 permissions are configured
4. Test with different audio files
