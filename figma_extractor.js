const https = require('https');

class FigmaExtractor {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = 'https://api.figma.com/v1';
    }

    // Extract file ID from Figma URL
    extractFileId(url) {
        // Handle both /file/ and /design/ URL formats
        const fileMatch = url.match(/\/file\/([a-zA-Z0-9]+)/);
        const designMatch = url.match(/\/design\/([a-zA-Z0-9]+)/);
        return fileMatch ? fileMatch[1] : (designMatch ? designMatch[1] : null);
    }

    // Get file information
    async getFile(fileId) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.figma.com',
                path: `/v1/files/${fileId}`,
                method: 'GET',
                headers: {
                    'X-Figma-Token': this.accessToken
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.end();
        });
    }

    // Extract colors from the design
    extractColors(document) {
        const colors = new Set();
        const self = this;
        
        function traverse(node) {
            if (node.fills && Array.isArray(node.fills)) {
                node.fills.forEach(fill => {
                    if (fill.type === 'SOLID' && fill.color) {
                        const color = fill.color;
                        const hex = self.rgbToHex(
                            Math.round(color.r * 255),
                            Math.round(color.g * 255),
                            Math.round(color.b * 255)
                        );
                        colors.add(hex);
                    }
                });
            }
            
            if (node.children) {
                node.children.forEach(child => traverse(child));
            }
        }
        
        traverse(document);
        return Array.from(colors);
    }

    // Convert RGB to Hex
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Extract typography information
    extractTypography(document) {
        const typography = new Set();
        
        function traverse(node) {
            if (node.style && node.style.fontFamily) {
                const fontInfo = {
                    family: node.style.fontFamily,
                    weight: node.style.fontWeight || 'normal',
                    size: node.style.fontSize || 'inherit'
                };
                typography.add(JSON.stringify(fontInfo));
            }
            
            if (node.children) {
                node.children.forEach(child => traverse(child));
            }
        }
        
        traverse(document);
        return Array.from(typography).map(t => JSON.parse(t));
    }

    // Extract spacing/sizing information
    extractSpacing(document) {
        const spacing = new Set();
        
        function traverse(node) {
            if (node.absoluteBoundingBox) {
                const { width, height } = node.absoluteBoundingBox;
                spacing.add(Math.round(width));
                spacing.add(Math.round(height));
            }
            
            if (node.children) {
                node.children.forEach(child => traverse(child));
            }
        }
        
        traverse(document);
        return Array.from(spacing).sort((a, b) => a - b);
    }

    // Find specific frame by name
    findFrameByName(document, frameName) {
        const frames = [];
        
        function traverse(node) {
            if (node.type === 'FRAME' && node.name && node.name.toLowerCase().includes(frameName.toLowerCase())) {
                frames.push(node);
            }
            if (node.children) {
                node.children.forEach(child => traverse(child));
            }
        }
        
        traverse(document);
        return frames;
    }

    // Extract detailed frame information
    extractFrameDetails(frame) {
        const details = {
            name: frame.name,
            type: frame.type,
            absoluteBoundingBox: frame.absoluteBoundingBox,
            fills: frame.fills,
            strokes: frame.strokes,
            strokeWeight: frame.strokeWeight,
            cornerRadius: frame.cornerRadius,
            children: []
        };

        if (frame.children) {
            details.children = frame.children.map(child => ({
                name: child.name,
                type: child.type,
                absoluteBoundingBox: child.absoluteBoundingBox,
                fills: child.fills,
                strokes: child.strokes,
                strokeWeight: child.strokeWeight,
                cornerRadius: child.cornerRadius,
                characters: child.characters,
                style: child.style,
                children: child.children ? child.children.map(grandChild => ({
                    name: grandChild.name,
                    type: grandChild.type,
                    absoluteBoundingBox: grandChild.absoluteBoundingBox,
                    fills: grandChild.fills,
                    strokes: grandChild.strokes,
                    characters: grandChild.characters,
                    style: grandChild.style
                })) : []
            }));
        }

        return details;
    }

    // Main extraction method
    async extractDesignTokens(figmaUrl) {
        const fileId = this.extractFileId(figmaUrl);
        if (!fileId) {
            throw new Error('Invalid Figma URL');
        }

        const fileData = await this.getFile(fileId);
        const document = fileData.document;

        // Find the EXAMPLE CARD frame
        const exampleCardFrames = this.findFrameByName(document, 'EXAMPLE CARD');
        let exampleCardDetails = null;
        
        if (exampleCardFrames.length > 0) {
            exampleCardDetails = this.extractFrameDetails(exampleCardFrames[0]);
        }

        return {
            colors: this.extractColors(document),
            typography: this.extractTypography(document),
            spacing: this.extractSpacing(document),
            exampleCard: exampleCardDetails,
            fileInfo: {
                name: fileData.name,
                lastModified: fileData.lastModified,
                version: fileData.version
            }
        };
    }
}

// Export for use
module.exports = FigmaExtractor;

// Example usage (uncomment to test)
/*
const extractor = new FigmaExtractor('YOUR_FIGMA_ACCESS_TOKEN');
extractor.extractDesignTokens('https://www.figma.com/design/T85krdSZ67vm30nfZtAiYm/GuildHub?node-id=0-1&p=f&t=b0tcmK0Er2Kc13bx-0')
    .then(tokens => {
        console.log('Design Tokens:', JSON.stringify(tokens, null, 2));
    })
    .catch(error => {
        console.error('Error:', error);
    });
*/ 