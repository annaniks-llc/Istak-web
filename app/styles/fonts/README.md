# Custom Fonts Integration

This directory contains the custom fonts used in the Istak Distillery project.

## Fonts Included

### 1. Mardoto
- **Font Family**: `'Mardoto', sans-serif`
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Usage**: Primary body text, headings, and general content
- **Language Support**: Armenian, Latin

### 2. Arm Hmk's Bebas Neue
- **Font Family**: `'Arm Hmk\'s Bebas Neue', sans-serif`
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Usage**: Display text, titles, and prominent headings
- **Language Support**: Armenian, Latin

## File Structure

```
app/styles/fonts/
├── README.md
├── fonts.css
├── Mardoto/
│   ├── Mardoto-Regular.woff2
│   ├── Mardoto-Regular.woff
│   ├── Mardoto-Regular.ttf
│   ├── Mardoto-Medium.woff2
│   ├── Mardoto-Medium.woff
│   ├── Mardoto-Medium.ttf
│   ├── Mardoto-SemiBold.woff2
│   ├── Mardoto-SemiBold.woff
│   ├── Mardoto-SemiBold.ttf
│   ├── Mardoto-Bold.woff2
│   ├── Mardoto-Bold.woff
│   └── Mardoto-Bold.ttf
└── BebasNeue/
    ├── ArmHmksBebasNeue-Regular.woff2
    ├── ArmHmksBebasNeue-Regular.woff
    ├── ArmHmksBebasNeue-Regular.ttf
    ├── ArmHmksBebasNeue-Medium.woff2
    ├── ArmHmksBebasNeue-Medium.woff
    ├── ArmHmksBebasNeue-Medium.ttf
    ├── ArmHmksBebasNeue-SemiBold.woff2
    ├── ArmHmksBebasNeue-SemiBold.woff
    ├── ArmHmksBebasNeue-SemiBold.ttf
    ├── ArmHmksBebasNeue-Bold.woff2
    ├── ArmHmksBebasNeue-Bold.woff
    └── ArmHmksBebasNeue-Bold.ttf
```

## Installation Steps

### Step 1: Add Font Files
1. Place the actual font files in their respective directories
2. Ensure all font weights are available (Regular, Medium, SemiBold, Bold)
3. Include multiple formats: `.woff2`, `.woff`, and `.ttf` for maximum compatibility

### Step 2: Font Loading
The fonts are automatically loaded via:
- `app/styles/fonts.css` - Contains all @font-face declarations
- `app/[lang]/layout.tsx` - Imports the fonts.css file

### Step 3: Usage in CSS
```scss
// Mardoto usage
.mardoto-text {
  font-family: 'Mardoto', sans-serif;
  font-weight: 400; // Regular
}

.mardoto-bold {
  font-family: 'Mardoto', sans-serif;
  font-weight: 700; // Bold
}

// Arm Hmk's Bebas Neue usage
.bebas-title {
  font-family: 'Arm Hmk\'s Bebas Neue', sans-serif;
  font-weight: 600; // SemiBold
}

.bebas-heading {
  font-family: 'Arm Hmk\'s Bebas Neue', sans-serif;
  font-weight: 700; // Bold
}
```

## Font Features

### Mardoto
- **Primary Use**: Body text, paragraphs, general content
- **Characteristics**: Clean, readable, professional
- **Best For**: Long-form content, descriptions, user interface text

### Arm Hmk's Bebas Neue
- **Primary Use**: Headings, titles, display text
- **Characteristics**: Bold, impactful, modern
- **Best For**: Page titles, section headers, prominent text elements

## Performance Optimization

- **Font Display**: Uses `font-display: swap` for better loading performance
- **Multiple Formats**: Provides `.woff2` (smallest), `.woff`, and `.ttf` fallbacks
- **Preloading**: Consider adding font preloading for critical fonts

## Browser Support

- **Modern Browsers**: Full support for all weights and formats
- **Fallbacks**: Graceful degradation to system fonts if custom fonts fail to load
- **Mobile**: Optimized for mobile devices with appropriate font sizes

## Troubleshooting

### Fonts Not Loading
1. Check file paths in `fonts.css`
2. Verify font files exist in correct directories
3. Check browser console for 404 errors
4. Ensure fonts.css is imported in layout.tsx

### Font Display Issues
1. Verify font-family names match exactly (including quotes)
2. Check font-weight values are correct
3. Ensure proper fallback fonts are specified

## License Information

**Note**: These are commercial/proprietary fonts. Ensure you have proper licensing for web use.
- **Mardoto**: Commercial license required
- **Arm Hmk's Bebas Neue**: Commercial license required

## CSS Variables (Optional)

You can also define CSS custom properties for consistent font usage:

```scss
:root {
  --font-mardoto: 'Mardoto', sans-serif;
  --font-bebas: 'Arm Hmk\'s Bebas Neue', sans-serif;
}

.usage {
  font-family: var(--font-mardoto);
  font-weight: 400;
}
```
