const fs = require('fs');

class CSSGenerator {
    constructor(designTokens) {
        this.tokens = designTokens;
    }

    // Generate CSS variables from design tokens
    generateCSSVariables() {
        let css = ':root {\n';
        
        // Color variables
        css += '  /* Colors */\n';
        this.tokens.colors.forEach((color, index) => {
            css += `  --color-${index + 1}: ${color};\n`;
        });
        
        // Typography variables
        css += '\n  /* Typography */\n';
        this.tokens.typography.forEach((font, index) => {
            css += `  --font-family-${index + 1}: ${font.family};\n`;
            css += `  --font-weight-${index + 1}: ${font.weight};\n`;
            css += `  --font-size-${index + 1}: ${font.size}px;\n`;
        });
        
        // Spacing variables
        css += '\n  /* Spacing */\n';
        this.tokens.spacing.forEach((size, index) => {
            css += `  --spacing-${index + 1}: ${size}px;\n`;
        });
        
        css += '}\n\n';
        return css;
    }

    // Generate utility classes
    generateUtilityClasses() {
        let css = '/* Utility Classes */\n\n';
        
        // Color utilities
        css += '/* Color Utilities */\n';
        this.tokens.colors.forEach((color, index) => {
            css += `.bg-color-${index + 1} { background-color: var(--color-${index + 1}); }\n`;
            css += `.text-color-${index + 1} { color: var(--color-${index + 1}); }\n`;
        });
        
        // Typography utilities
        css += '\n/* Typography Utilities */\n';
        this.tokens.typography.forEach((font, index) => {
            css += `.font-${index + 1} { font-family: var(--font-family-${index + 1}); font-weight: var(--font-weight-${index + 1}); font-size: var(--font-size-${index + 1}); }\n`;
        });
        
        // Spacing utilities
        css += '\n/* Spacing Utilities */\n';
        this.tokens.spacing.forEach((size, index) => {
            css += `.p-${index + 1} { padding: var(--spacing-${index + 1}); }\n`;
            css += `.m-${index + 1} { margin: var(--spacing-${index + 1}); }\n`;
        });
        
        return css;
    }

    // Generate component styles (example)
    generateComponentStyles() {
        let css = '\n/* Component Styles */\n\n';
        
        // Button styles
        css += '/* Button Component */\n';
        css += '.btn {\n';
        css += '  padding: var(--spacing-1);\n';
        css += '  background-color: var(--color-1);\n';
        css += '  color: white;\n';
        css += '  border: none;\n';
        css += '  border-radius: 4px;\n';
        css += '  cursor: pointer;\n';
        css += '  font-family: var(--font-family-1);\n';
        css += '  font-weight: var(--font-weight-1);\n';
        css += '  font-size: var(--font-size-1);\n';
        css += '  transition: all 0.2s ease;\n';
        css += '}\n\n';
        
        css += '.btn:hover {\n';
        css += '  opacity: 0.9;\n';
        css += '  transform: translateY(-1px);\n';
        css += '}\n\n';
        
        // Card styles
        css += '/* Card Component */\n';
        css += '.card {\n';
        css += '  background: white;\n';
        css += '  border-radius: 8px;\n';
        css += '  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n';
        css += '  padding: var(--spacing-2);\n';
        css += '  margin: var(--spacing-1);\n';
        css += '}\n\n';
        
        return css;
    }

    // Generate complete CSS file
    generateCompleteCSS() {
        let css = '/* Generated from Figma Design Tokens */\n';
        css += `/* File: ${this.tokens.fileInfo.name} */\n`;
        css += `/* Generated: ${new Date().toISOString()} */\n\n`;
        
        css += this.generateCSSVariables();
        css += this.generateUtilityClasses();
        css += this.generateComponentStyles();
        
        return css;
    }

    // Save CSS to file
    saveToFile(filename = 'figma-styles.css') {
        const css = this.generateCompleteCSS();
        fs.writeFileSync(filename, css);
        console.log(`✅ CSS saved to ${filename}`);
    }
}

// Export for use
module.exports = CSSGenerator;

// Example usage (uncomment to test)
/*
const designTokens = JSON.parse(fs.readFileSync('design_tokens.json', 'utf8'));
const generator = new CSSGenerator(designTokens);
generator.saveToFile('figma-styles.css');
*/ 