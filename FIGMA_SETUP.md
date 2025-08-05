# Figma Design Integration Setup

This setup allows you to extract design tokens from your Figma file and automatically generate CSS styles for your app.

## 🚀 Quick Start

### 1. Get Your Figma Access Token

1. Go to [Figma API Access Tokens](https://www.figma.com/developers/api#access-tokens)
2. Click "Create a new access token"
3. Give it a name (e.g., "GuildHub Design Integration")
4. Copy the generated token

### 2. Set Up the Token

**Option A: Environment Variable (Recommended)**
```bash
export FIGMA_ACCESS_TOKEN="your_token_here"
```

**Option B: Direct in Code**
Edit `test_figma_extractor.js` and replace `'YOUR_FIGMA_ACCESS_TOKEN'` with your actual token.

### 3. Extract Design Tokens

Run the extraction script:
```bash
node test_figma_extractor.js
```

This will:
- Connect to your Figma file
- Extract colors, typography, and spacing
- Save design tokens to `design_tokens.json`

### 4. Generate CSS

After extraction, generate CSS styles:
```bash
node -e "
const CSSGenerator = require('./css_generator');
const designTokens = JSON.parse(require('fs').readFileSync('design_tokens.json', 'utf8'));
const generator = new CSSGenerator(designTokens);
generator.saveToFile('figma-styles.css');
"
```

### 5. Use in Your App

Link the generated CSS in your HTML:
```html
<link rel="stylesheet" href="figma-styles.css">
```

## 📁 Files Overview

- `figma_extractor.js` - Extracts design tokens from Figma API
- `test_figma_extractor.js` - Test script to run the extraction
- `css_generator.js` - Converts design tokens to CSS
- `design_tokens.json` - Generated design tokens (after running extraction)
- `figma-styles.css` - Generated CSS styles (after running generation)

## 🎨 What Gets Extracted

### Colors
- All solid colors used in your design
- Converted to hex format
- Available as CSS variables: `--color-1`, `--color-2`, etc.

### Typography
- Font families, weights, and sizes
- Available as CSS variables: `--font-family-1`, `--font-weight-1`, etc.

### Spacing
- Component dimensions and spacing
- Available as CSS variables: `--spacing-1`, `--spacing-2`, etc.

## 🔧 Customization

### Modify the Extractor
Edit `figma_extractor.js` to extract additional properties:
- Border radius
- Shadows
- Gradients
- Component hierarchies

### Modify the CSS Generator
Edit `css_generator.js` to:
- Add more component styles
- Create different utility classes
- Generate Tailwind-like utilities

## 🔄 Workflow

1. **Design in Figma** - Make your design changes
2. **Extract Tokens** - Run `node test_figma_extractor.js`
3. **Generate CSS** - Run the CSS generation command
4. **Apply to App** - The new styles are automatically available

## 🚨 Troubleshooting

### "Invalid Figma URL"
- Make sure your Figma file is accessible
- Check that the URL is correct
- Ensure you have permission to access the file

### "Access Token Error"
- Verify your token is correct
- Check that the token has the right permissions
- Make sure the token hasn't expired

### "No Design Tokens Found"
- Your Figma file might not have many design elements
- Try adding some colors, text, or components to your design
- Check that the file ID is being extracted correctly

## 🔗 Your Figma File

Current file: `https://www.figma.com/design/T85krdSZ67vm30nfZtAiYm/GuildHub?node-id=0-1&p=f&t=b0tcmK0Er2Kc13bx-0`

## 📝 Next Steps

Once this is set up, you can:
1. **Automate the process** - Set up a script to run daily
2. **Add more properties** - Extract shadows, borders, etc.
3. **Create component mapping** - Map specific Figma components to CSS classes
4. **Integrate with build process** - Add to your build pipeline

## 💡 Tips

- **Organize your Figma file** with clear naming conventions
- **Use consistent colors** and typography throughout your design
- **Group related elements** to make extraction more meaningful
- **Test the generated CSS** to ensure it matches your design intent 