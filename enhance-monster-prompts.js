const https = require('https');
const fs = require('fs');

// Configuration
const CONFIG = {
    API_BASE: 'api.open5e.com',
    OUTPUT_FILE: 'enhanced-monster-prompts.txt',
    DELAY_BETWEEN_REQUESTS: 1000 // 1 second between API calls to be respectful
};

// Load all monsters from JSON file
const ALL_MONSTERS = require('./full-monster-list.json');

// Function to make HTTPS requests
function makeRequest(hostname, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'DnD-Card-Generator/1.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                } catch (error) {
                    reject(new Error(`Failed to parse JSON: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

// Function to search for a monster in the Open5e API
async function searchMonster(monsterName) {
    try {
        console.log(`🔍 Searching for: ${monsterName}`);
        
        // Try exact match first
        const exactPath = `/monsters/${monsterName.toLowerCase().replace(/\s+/g, '-')}/`;
        
        try {
            const exactResult = await makeRequest(CONFIG.API_BASE, exactPath);
            if (exactResult && exactResult.name) {
                console.log(`✅ Found exact match: ${exactResult.name}`);
                return exactResult;
            }
        } catch (error) {
            // Exact match failed, try search
            console.log(`   Exact match failed, trying search...`);
        }
        
        // Try search if exact match fails
        const searchPath = `/monsters/?search=${encodeURIComponent(monsterName)}`;
        const searchResult = await makeRequest(CONFIG.API_BASE, searchPath);
        
        if (searchResult && searchResult.results && searchResult.results.length > 0) {
            // Find the best match
            const bestMatch = searchResult.results.find(monster => 
                monster.name.toLowerCase() === monsterName.toLowerCase()
            ) || searchResult.results[0];
            
            console.log(`✅ Found search match: ${bestMatch.name}`);
            return bestMatch;
        }
        
        console.log(`❌ No match found for: ${monsterName}`);
        return null;
        
    } catch (error) {
        console.error(`❌ Error searching for ${monsterName}: ${error.message}`);
        return null;
    }
}

// Function to extract a concise description from monster data
function extractDescription(monster) {
    if (!monster) return '';
    
    let description = '';
    
    // Try to get description from various fields
    if (monster.desc) {
        description = monster.desc;
    } else if (monster.description) {
        description = monster.description;
    }
    
    if (!description) return '';
    
    // Clean up the description
    description = description
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\_(.*?)\_/g, '$1')     // Remove italic markdown
        .replace(/\\n/g, ' ')           // Replace newlines with spaces
        .replace(/\s+/g, ' ')           // Normalize whitespace
        .trim();
    
    // Get first sentence or first 150 characters
    const sentences = description.split(/[.!?]+/);
    if (sentences.length > 0 && sentences[0].length > 10) {
        let firstSentence = sentences[0].trim();
        if (firstSentence.length > 150) {
            firstSentence = firstSentence.substring(0, 147) + '...';
        }
        return firstSentence;
    }
    
    // Fallback to first 150 characters
    if (description.length > 150) {
        return description.substring(0, 147) + '...';
    }
    
    return description;
}

// Function to create enhanced prompt
function createEnhancedPrompt(monster, description) {
    const basePrompt = `Fantasy D&D ${monster.name}`;
    
    let enhancedPrompt = basePrompt;
    
    if (description) {
        // Add description in parentheses
        enhancedPrompt += ` (${description})`;
    }
    
    enhancedPrompt += ', dark fantasy card art style, detailed portrait showing head and upper body, dramatic lighting, menacing expression, high quality digital art --ar 1:1 --style raw';
    
    return `/imagine ${enhancedPrompt}`;
}

// Function to sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function
async function enhanceAllMonsterPrompts() {
    console.log(`🚀 Starting enhancement of ${ALL_MONSTERS.length} monster prompts...`);
    console.log(`📡 Using Open5e API: https://${CONFIG.API_BASE}`);
    
    const enhancedPrompts = [];
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < ALL_MONSTERS.length; i++) {
        const monster = ALL_MONSTERS[i];
        
        console.log(`\n🎯 Processing ${monster.name} (${i + 1}/${ALL_MONSTERS.length})...`);
        
        try {
            // Search for monster data
            const monsterData = await searchMonster(monster.name);
            
            // Extract description
            const description = extractDescription(monsterData);
            
            // Create enhanced prompt
            const enhancedPrompt = createEnhancedPrompt(monster, description);
            
            enhancedPrompts.push(enhancedPrompt);
            enhancedPrompts.push(''); // Add blank line for readability
            
            if (description) {
                console.log(`   📝 Description: ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`);
                successCount++;
            } else {
                console.log(`   ⚠️  No description found, using basic prompt`);
                failCount++;
            }
            
        } catch (error) {
            console.error(`❌ Error processing ${monster.name}: ${error.message}`);
            // Add basic prompt as fallback
            const basicPrompt = createEnhancedPrompt(monster, '');
            enhancedPrompts.push(basicPrompt);
            enhancedPrompts.push('');
            failCount++;
        }
        
        // Rate limiting
        if (i < ALL_MONSTERS.length - 1) {
            console.log(`   ⏸️  Waiting ${CONFIG.DELAY_BETWEEN_REQUESTS}ms...`);
            await sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
        }
    }
    
    // Write enhanced prompts to file
    const outputContent = enhancedPrompts.join('\n');
    fs.writeFileSync(CONFIG.OUTPUT_FILE, outputContent);
    
    // Summary
    console.log('\n📊 Enhancement Summary:');
    console.log(`✅ Monsters with descriptions: ${successCount}`);
    console.log(`❌ Monsters without descriptions: ${failCount}`);
    console.log(`📄 Enhanced prompts saved to: ${CONFIG.OUTPUT_FILE}`);
    console.log('\n🎉 Monster prompt enhancement complete!');
}

// Run the script
if (require.main === module) {
    enhanceAllMonsterPrompts().catch(error => {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { enhanceAllMonsterPrompts, createEnhancedPrompt };