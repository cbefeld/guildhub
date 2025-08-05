const FrameBasedGenerator = require('./frame_based_generator');

async function testFrameGeneration() {
    try {
        console.log('🎴 Generating frame-based cards from Figma EXAMPLE CARD...');
        
        // Load the design tokens
        const designTokens = JSON.parse(require('fs').readFileSync('design_tokens.json', 'utf8'));
        
        if (!designTokens.exampleCard) {
            console.log('❌ No EXAMPLE CARD frame found in design tokens');
            console.log('💡 Make sure your Figma file has a frame named "EXAMPLE CARD"');
            return;
        }

        // Create the frame-based generator
        const generator = new FrameBasedGenerator(designTokens);
        
        // Generate and save the CSS
        generator.saveFrameBasedCSS();
        
        // Generate and save the HTML
        generator.saveFrameBasedHTML();
        
        console.log('\n🎉 Frame-based cards generated successfully!');
        console.log('📁 Files created:');
        console.log('   - figma-frame-styles.css (CSS styles)');
        console.log('   - figma-frame-example.html (Example card)');
        console.log('\n💡 You can now:');
        console.log('   1. Open figma-frame-example.html to see the exact card');
        console.log('   2. Use the CSS classes in your app');
        console.log('   3. Modify the styles to match your needs');
        
    } catch (error) {
        console.error('❌ Error generating frame-based cards:', error.message);
    }
}

testFrameGeneration(); 