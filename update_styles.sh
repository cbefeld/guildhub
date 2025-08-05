#!/bin/bash

# GuildHub Figma Style Update Script
# This script extracts design tokens from Figma and generates updated CSS

echo "🎨 Updating GuildHub styles from Figma..."

# Check if Figma token is set
if [ -z "$FIGMA_ACCESS_TOKEN" ]; then
    echo "❌ FIGMA_ACCESS_TOKEN not set. Please set it first:"
    echo "export FIGMA_ACCESS_TOKEN='your_token_here'"
    exit 1
fi

# Extract design tokens
echo "📥 Extracting design tokens from Figma..."
node test_figma_extractor.js

if [ $? -eq 0 ]; then
    echo "✅ Design tokens extracted successfully!"
    
    # Generate CSS
    echo "🎨 Generating CSS from design tokens..."
    node -e "
    const CSSGenerator = require('./css_generator');
    const designTokens = JSON.parse(require('fs').readFileSync('design_tokens.json', 'utf8'));
    const generator = new CSSGenerator(designTokens);
    generator.saveToFile('figma-styles.css');
    "
    
    if [ $? -eq 0 ]; then
        echo "✅ CSS generated successfully!"
        echo "🎉 Your GuildHub app now has the latest styles from Figma!"
        echo ""
        echo "📊 Summary:"
        echo "   - Colors: $(grep -c '--color-' figma-styles.css)"
        echo "   - Typography: $(grep -c '--font-family-' figma-styles.css)"
        echo "   - Spacing: $(grep -c '--spacing-' figma-styles.css)"
        echo ""
        echo "💡 You can now use these styles in your HTML:"
        echo "   - Colors: .bg-color-1, .text-color-3, etc."
        echo "   - Typography: .font-1, .font-2, etc."
        echo "   - Spacing: .p-10, .m-20, etc."
    else
        echo "❌ Failed to generate CSS"
        exit 1
    fi
else
    echo "❌ Failed to extract design tokens"
    exit 1
fi 