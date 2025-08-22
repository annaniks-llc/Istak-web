# Font Installation Guide

## Current Status
✅ Font structure is set up  
✅ Fallback fonts are working (Inter & Oswald from Google Fonts)  
⏳ Custom fonts need to be added  

## To Add Your Custom Fonts:

### Step 1: Get Your Font Files
- Obtain the actual Mardoto and Arm Hmk's Bebas Neue font files
- Ensure you have all weights: Regular (400), Medium (500), SemiBold (600), Bold (700)
- Get multiple formats: `.woff2`, `.woff`, and `.ttf`

### Step 2: Replace Placeholder Files
- Delete the placeholder files in `Mardoto/` and `BebasNeue/` directories
- Add your actual font files with the exact names specified in `globals.scss`

### Step 3: Enable Custom Fonts
- Open `app/[lang]/globals.scss`
- Remove the `/*` and `*/` comment markers around the `@font-face` declarations
- The fonts will automatically load and replace the fallbacks

### Step 4: Update CSS Files (Optional)
- You can remove the fallback font declarations from your SCSS files
- Or keep them as a safety net

## Font File Names Required:

**Mardoto Directory:**
- Mardoto-Regular.woff2
- Mardoto-Regular.woff  
- Mardoto-Regular.ttf
- Mardoto-Medium.woff2
- Mardoto-Medium.woff
- Mardoto-Medium.ttf
- Mardoto-SemiBold.woff2
- Mardoto-SemiBold.woff
- Mardoto-SemiBold.ttf
- Mardoto-Bold.woff2
- Mardoto-Bold.woff
- Mardoto-Bold.ttf

**BebasNeue Directory:**
- ArmHmksBebasNeue-Regular.woff2
- ArmHmksBebasNeue-Regular.woff
- ArmHmksBebasNeue-Regular.ttf
- ArmHmksBebasNeue-Medium.woff2
- ArmHmksBebasNeue-Medium.woff
- ArmHmksBebasNeue-Medium.ttf
- ArmHmksBebasNeue-SemiBold.woff2
- ArmHmksBebasNeue-SemiBold.woff
- ArmHmksBebasNeue-SemiBold.ttf
- ArmHmksBebasNeue-Bold.woff2
- ArmHmksBebasNeue-Bold.woff
- ArmHmksBebasNeue-Bold.ttf

## Current Fallback Fonts:
- **Mardoto replacement**: Inter (Google Fonts)
- **Bebas Neue replacement**: Oswald (Google Fonts)

## Important Notes:
- Font declarations are now in `app/[lang]/globals.scss` (not in a separate fonts.css file)
- This fixes the CSS parsing error that was occurring
- The fonts.css file in the fonts directory is no longer needed

These fallbacks will work until you add your custom fonts!
