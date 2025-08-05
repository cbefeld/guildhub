const FigmaExtractor = require('./figma_extractor');

// You'll need to get a Figma access token from:
// https://www.figma.com/developers/api#access-tokens

async function testFigmaExtraction() {
    // Replace with your actual Figma access token
    const accessToken = process.env.FIGMA_ACCESS_TOKEN || 'YOUR_FIGMA_ACCESS_TOKEN';
    
    if (accessToken === 'YOUR_FIGMA_ACCESS_TOKEN') {
        console.log('❌ Please set your Figma access token:');
        console.log('1. Go to https://www.figma.com/developers/api#access-tokens');
        console.log('2. Create a new access token');
        console.log('3. Set it as an environment variable: export FIGMA_ACCESS_TOKEN="your_token"');
        console.log('4. Or replace "YOUR_FIGMA_ACCESS_TOKEN" in this file');
        return;
    }

    const extractor = new FigmaExtractor(accessToken);
    const figmaUrl = 'https://www.figma.com/design/T85krdSZ67vm30nfZtAiYm/GuildHub?node-id=0-1&p=f&t=b0tcmK0Er2Kc13bx-0';

    try {
        console.log('🔍 Extracting design tokens from Figma...');
        const tokens = await extractor.extractDesignTokens(figmaUrl);
        
        console.log('\n✅ Design Tokens Extracted:');
        console.log('📁 File:', tokens.fileInfo.name);
        console.log('🕒 Last Modified:', new Date(tokens.fileInfo.lastModified).toLocaleString());
        
        console.log('\n🎨 Colors:');
        tokens.colors.forEach(color => console.log(`  ${color}`));
        
        console.log('\n📝 Typography:');
        tokens.typography.forEach(font => {
            console.log(`  ${font.family} - ${font.weight} - ${font.size}px`);
        });
        
        console.log('\n📏 Spacing/Sizing:');
        tokens.spacing.forEach(size => console.log(`  ${size}px`));
        
        // Show EXAMPLE CARD frame details if found
        if (tokens.exampleCard) {
            console.log('\n🎴 EXAMPLE CARD Frame Details:');
            console.log(`  Name: ${tokens.exampleCard.name}`);
            console.log(`  Type: ${tokens.exampleCard.type}`);
            console.log(`  Dimensions: ${tokens.exampleCard.absoluteBoundingBox?.width || 'N/A'}x${tokens.exampleCard.absoluteBoundingBox?.height || 'N/A'}`);
            console.log(`  Children: ${tokens.exampleCard.children.length} elements`);
            
            tokens.exampleCard.children.forEach((child, index) => {
                console.log(`    ${index + 1}. ${child.name} (${child.type})`);
                if (child.characters) {
                    console.log(`       Text: "${child.characters}"`);
                }
                if (child.fills && child.fills.length > 0) {
                    console.log(`       Fill: ${child.fills[0].type}`);
                }
            });
        } else {
            console.log('\n❌ No EXAMPLE CARD frame found in the design');
        }
        
        // Save to file for use in your app
        const fs = require('fs');
        fs.writeFileSync('design_tokens.json', JSON.stringify(tokens, null, 2));
        console.log('\n💾 Design tokens saved to design_tokens.json');
        
    } catch (error) {
        console.error('❌ Error extracting design tokens:', error.message);
    }
}

testFigmaExtraction(); 