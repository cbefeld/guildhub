# Monster Images

This folder contains custom generated images for D&D monsters.

## File Naming Convention
- Images should be named using the monster's `index` from the API
- Format: `{monster.index}.png`
- Example: `adult-black-dragon.png`, `goblin.png`, etc.

## Image Requirements
- **Format**: PNG recommended
- **Size**: 200x200px or larger (will be cropped to fit)
- **Style**: Portrait orientation, showing face/head area
- **Positioning**: Face should be in upper portion for proper cropping

## Adding Images
1. Generate image using AI (ChatGPT, DALL-E, Midjourney, etc.)
2. Save with correct filename based on monster index
3. Place in this folder
4. The app will automatically use the local image instead of API image

## Fallback
If an image file is missing, the app will still work but may show a broken image icon until you add the custom image.

## Total Monsters
There are **334 monsters** in the D&D 5e API that can have custom images.