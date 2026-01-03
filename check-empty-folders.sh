#!/bin/bash

# Check Empty Project Folders Script
# This script checks which project folders have no images

echo "🔍 Checking for empty project folders..."
echo ""

# Check if folder path is provided
if [ -z "$1" ]; then
    echo "❌ Please provide the main folder path"
    echo "Usage: bash check-empty-folders.sh /path/to/your/projects/folder"
    exit 1
fi

MAIN_FOLDER="$1"

if [ ! -d "$MAIN_FOLDER" ]; then
    echo "❌ Folder not found: $MAIN_FOLDER"
    exit 1
fi

echo "📁 Scanning: $MAIN_FOLDER"
echo "=" | awk '{for(i=0;i<70;i++)printf "="}END{print""}'

EMPTY_COUNT=0
HAS_IMAGES_COUNT=0

# Loop through each subfolder
for folder in "$MAIN_FOLDER"/*; do
    if [ -d "$folder" ]; then
        FOLDER_NAME=$(basename "$folder")
        
        # Count image files (jpg, jpeg, png, webp)
        IMAGE_COUNT=$(find "$folder" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | wc -l | tr -d ' ')
        
        if [ "$IMAGE_COUNT" -eq 0 ]; then
            echo "❌ EMPTY: $FOLDER_NAME"
            echo "   Path: $folder"
            EMPTY_COUNT=$((EMPTY_COUNT + 1))
        else
            echo "✅ OK: $FOLDER_NAME ($IMAGE_COUNT images)"
            HAS_IMAGES_COUNT=$((HAS_IMAGES_COUNT + 1))
        fi
    fi
done

echo ""
echo "=" | awk '{for(i=0;i<70;i++)printf "="}END{print""}'
echo "📊 Summary:"
echo "   ✅ Folders with images: $HAS_IMAGES_COUNT"
echo "   ❌ Empty folders: $EMPTY_COUNT"
echo ""

if [ "$EMPTY_COUNT" -gt 0 ]; then
    echo "💡 To fix empty folders:"
    echo "   1. Add images (.jpg, .png, etc.) to the empty folders"
    echo "   2. Run upload.py again"
    echo ""
fi
