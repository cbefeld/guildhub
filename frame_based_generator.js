const fs = require('fs');

class FrameBasedGenerator {
    constructor(designTokens) {
        this.tokens = designTokens;
        this.exampleCard = designTokens.exampleCard;
    }

    // Convert Figma colors to CSS
    figmaColorToCSS(figmaColor) {
        if (!figmaColor || figmaColor.type !== 'SOLID') return 'transparent';
        
        const color = figmaColor.color;
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Generate CSS based on frame structure
    generateFrameBasedCSS() {
        if (!this.exampleCard) {
            console.log('❌ No EXAMPLE CARD frame found');
            return '';
        }

        let css = '/* Generated from Figma EXAMPLE CARD Frame */\n';
        css += `/* Frame: ${this.exampleCard.name} */\n`;
        css += `/* Dimensions: ${this.exampleCard.absoluteBoundingBox?.width || 'N/A'}x${this.exampleCard.absoluteBoundingBox?.height || 'N/A'} */\n\n`;

        // Main card container
        css += '.figma-card {\n';
        css += `  width: ${this.exampleCard.absoluteBoundingBox?.width || 672}px;\n`;
        css += `  height: ${this.exampleCard.absoluteBoundingBox?.height || 936}px;\n`;
        css += '  position: relative;\n';
        css += '  margin: 20px auto;\n';
        css += '  border-radius: 8px;\n';
        css += '  overflow: hidden;\n';
        css += '  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n';
        css += '}\n\n';

        // Generate styles for each child element
        this.exampleCard.children.forEach((child, index) => {
            css += this.generateChildStyles(child, index);
        });

        return css;
    }

    // Generate styles for child elements
    generateChildStyles(child, index) {
        let css = `/* ${child.name} */\n`;
        css += `.figma-card-${index + 1} {\n`;
        
        // Position and size
        if (child.absoluteBoundingBox) {
            css += `  position: absolute;\n`;
            css += `  left: ${child.absoluteBoundingBox.x}px;\n`;
            css += `  top: ${child.absoluteBoundingBox.y}px;\n`;
            css += `  width: ${child.absoluteBoundingBox.width}px;\n`;
            css += `  height: ${child.absoluteBoundingBox.height}px;\n`;
        }

        // Background color
        if (child.fills && child.fills.length > 0) {
            const fillColor = this.figmaColorToCSS(child.fills[0]);
            css += `  background-color: ${fillColor};\n`;
        }

        // Border
        if (child.strokes && child.strokes.length > 0) {
            const strokeColor = this.figmaColorToCSS(child.strokes[0]);
            css += `  border: ${child.strokeWeight || 1}px solid ${strokeColor};\n`;
        }

        // Border radius
        if (child.cornerRadius) {
            css += `  border-radius: ${child.cornerRadius}px;\n`;
        }

        // Text styles
        if (child.characters) {
            css += `  color: ${this.getTextColor(child)};\n`;
            if (child.style) {
                css += `  font-family: ${child.style.fontFamily || 'serif'};\n`;
                css += `  font-size: ${child.style.fontSize || 12}px;\n`;
                css += `  font-weight: ${child.style.fontWeight || 400};\n`;
                css += `  line-height: ${child.style.lineHeightPx ? child.style.lineHeightPx + 'px' : '1.2'};\n`;
            }
            css += `  padding: 12px;\n`;
            css += `  display: flex;\n`;
            css += `  align-items: center;\n`;
            css += `  justify-content: center;\n`;
        }

        css += '}\n\n';

        // Generate styles for grandchildren
        if (child.children && child.children.length > 0) {
            child.children.forEach((grandChild, grandIndex) => {
                css += this.generateGrandChildStyles(grandChild, index + 1, grandIndex + 1);
            });
        }

        return css;
    }

    // Generate styles for grandchild elements
    generateGrandChildStyles(grandChild, parentIndex, grandIndex) {
        let css = `/* ${grandChild.name} (child of ${parentIndex}) */\n`;
        css += `.figma-card-${parentIndex}-${grandIndex} {\n`;
        
        // Position and size
        if (grandChild.absoluteBoundingBox) {
            css += `  position: absolute;\n`;
            css += `  left: ${grandChild.absoluteBoundingBox.x}px;\n`;
            css += `  top: ${grandChild.absoluteBoundingBox.y}px;\n`;
            css += `  width: ${grandChild.absoluteBoundingBox.width}px;\n`;
            css += `  height: ${grandChild.absoluteBoundingBox.height}px;\n`;
        }

        // Background color
        if (grandChild.fills && grandChild.fills.length > 0) {
            const fillColor = this.figmaColorToCSS(grandChild.fills[0]);
            css += `  background-color: ${fillColor};\n`;
        }

        // Text styles
        if (grandChild.characters) {
            css += `  color: ${this.getTextColor(grandChild)};\n`;
            if (grandChild.style) {
                css += `  font-family: ${grandChild.style.fontFamily || 'serif'};\n`;
                css += `  font-size: ${grandChild.style.fontSize || 12}px;\n`;
                css += `  font-weight: ${grandChild.style.fontWeight || 400};\n`;
            }
        }

        css += '}\n\n';
        return css;
    }

    // Get text color based on background
    getTextColor(element) {
        if (element.fills && element.fills.length > 0) {
            const fillColor = this.figmaColorToCSS(element.fills[0]);
            // If background is dark, use light text
            if (fillColor.includes('rgb(0, 0, 0)') || fillColor.includes('rgb(23, 20, 15)')) {
                return '#ffffff';
            }
        }
        return '#000000';
    }

    // Generate HTML structure based on frame
    generateFrameBasedHTML() {
        if (!this.exampleCard) {
            return '<div>No EXAMPLE CARD frame found</div>';
        }

        let html = '<div class="figma-card">\n';
        
        this.exampleCard.children.forEach((child, index) => {
            html += this.generateChildHTML(child, index + 1);
        });

        html += '</div>';
        return html;
    }

    // Generate HTML for child elements
    generateChildHTML(child, index) {
        let html = `  <div class="figma-card-${index}">\n`;
        
        // Add text content if present
        if (child.characters) {
            html += `    ${child.characters}\n`;
        }

        // Add grandchildren
        if (child.children && child.children.length > 0) {
            child.children.forEach((grandChild, grandIndex) => {
                html += this.generateGrandChildHTML(grandChild, index, grandIndex + 1);
            });
        }

        html += '  </div>\n';
        return html;
    }

    // Generate HTML for grandchild elements
    generateGrandChildHTML(grandChild, parentIndex, grandIndex) {
        let html = `    <div class="figma-card-${parentIndex}-${grandIndex}">\n`;
        
        if (grandChild.characters) {
            html += `      ${grandChild.characters}\n`;
        }

        html += '    </div>\n';
        return html;
    }

    // Save frame-based CSS
    saveFrameBasedCSS(filename = 'figma-frame-styles.css') {
        const css = this.generateFrameBasedCSS();
        fs.writeFileSync(filename, css);
        console.log(`✅ Frame-based CSS saved to ${filename}`);
    }

    // Save frame-based HTML
    saveFrameBasedHTML(filename = 'figma-frame-example.html') {
        const html = this.generateFrameBasedHTML();
        const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Frame Example</title>
    <link rel="stylesheet" href="figma-frame-styles.css">
</head>
<body>
    ${html}
</body>
</html>`;
        
        fs.writeFileSync(filename, fullHTML);
        console.log(`✅ Frame-based HTML saved to ${filename}`);
    }
}

// Export for use
module.exports = FrameBasedGenerator;

// Example usage (uncomment to test)
/*
const designTokens = JSON.parse(fs.readFileSync('design_tokens.json', 'utf8'));
const generator = new FrameBasedGenerator(designTokens);
generator.saveFrameBasedCSS();
generator.saveFrameBasedHTML();
*/ 