const fs = require('fs');

// Load all monsters
const monsters = require('./full-monster-list.json');

// Create prompt for each monster
function createPrompt(monster) {
    return `/imagine Fantasy D&D ${monster.name}, dark fantasy card art style, detailed portrait showing head and upper body, dramatic lighting, menacing expression, high quality digital art --ar 1:1 --style raw`;
}

// Generate all prompts
const prompts = monsters.map(monster => createPrompt(monster));

// Save to file
const promptText = prompts.join('\n\n');
fs.writeFileSync('all-monster-prompts.txt', promptText);

console.log(`✅ Generated ${prompts.length} prompts!`);
console.log('📄 Saved to: all-monster-prompts.txt');
console.log('');
console.log('🎯 Usage:');
console.log('1. Open Midjourney Discord');
console.log('2. Copy/paste prompts from the file');
console.log('3. Use relaxed mode for unlimited generations');
console.log('4. Download images when ready');
console.log('');
console.log('💰 Cost: Just your $10/month Midjourney subscription!');
console.log('⏱️  Time: 1-2 weeks of casual generation');
console.log('💸 Savings: ~$150-300 vs useapi.net');