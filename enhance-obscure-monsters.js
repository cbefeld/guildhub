const fs = require('fs');

// Load all monsters from JSON file
const ALL_MONSTERS = require('./full-monster-list.json');

// Common/obvious monsters that don't need descriptions (self-explanatory names)
const OBVIOUS_MONSTERS = new Set([
    'aboleth', 'acolyte', 'adult-black-dragon', 'adult-blue-dragon', 'adult-brass-dragon',
    'adult-bronze-dragon', 'adult-copper-dragon', 'adult-gold-dragon', 'adult-green-dragon',
    'adult-red-dragon', 'adult-silver-dragon', 'adult-white-dragon', 'air-elemental',
    'ancient-black-dragon', 'ancient-blue-dragon', 'ancient-brass-dragon', 'ancient-bronze-dragon',
    'ancient-copper-dragon', 'ancient-gold-dragon', 'ancient-green-dragon', 'ancient-red-dragon',
    'ancient-silver-dragon', 'ancient-white-dragon', 'animated-armor', 'ape', 'archmage',
    'assassin', 'awakened-shrub', 'awakened-tree', 'baboon', 'badger', 'bandit', 'bandit-captain',
    'basilisk', 'bat', 'berserker', 'black-bear', 'black-dragon-wyrmling', 'blue-dragon-wyrmling',
    'boar', 'brass-dragon-wyrmling', 'bronze-dragon-wyrmling', 'brown-bear', 'bugbear',
    'camel', 'cat', 'centaur', 'chimera', 'commoner', 'constrictor-snake', 'copper-dragon-wyrmling',
    'crab', 'crocodile', 'deer', 'dire-wolf', 'dragon-turtle', 'drow', 'dwarf', 'eagle',
    'earth-elemental', 'elephant', 'elf', 'elk', 'fire-elemental', 'flying-snake', 'frog',
    'giant-ape', 'giant-badger', 'giant-bat', 'giant-bear', 'giant-boar', 'giant-centipede',
    'giant-constrictor-snake', 'giant-crab', 'giant-crocodile', 'giant-eagle', 'giant-elk',
    'giant-fire-beetle', 'giant-frog', 'giant-goat', 'giant-hyena', 'giant-lizard',
    'giant-octopus', 'giant-owl', 'giant-poisonous-snake', 'giant-rat', 'giant-scorpion',
    'giant-sea-horse', 'giant-shark', 'giant-spider', 'giant-toad', 'giant-vulture',
    'giant-wasp', 'giant-weasel', 'giant-wolf-spider', 'gnoll', 'gnome', 'goat', 'goblin',
    'gold-dragon-wyrmling', 'green-dragon-wyrmling', 'griffon', 'guard', 'halfling', 'hawk',
    'hell-hound', 'hippogriff', 'hobgoblin', 'horse', 'human', 'hyena', 'jackal', 'knight',
    'kobold', 'lion', 'lizard', 'lizardfolk', 'mage', 'mammoth', 'mastiff', 'minotaur',
    'mule', 'noble', 'octopus', 'ogre', 'orc', 'owl', 'owlbear', 'panther', 'pegasus',
    'poisonous-snake', 'pony', 'priest', 'quasit', 'rat', 'raven', 'red-dragon-wyrmling',
    'rhinoceros', 'riding-horse', 'saber-toothed-tiger', 'scorpion', 'scout', 'sea-horse',
    'shark', 'silver-dragon-wyrmling', 'skeleton', 'spider', 'spy', 'stirge', 'swarm-of-bats',
    'swarm-of-insects', 'swarm-of-poisonous-snakes', 'swarm-of-quippers', 'swarm-of-rats',
    'swarm-of-ravens', 'tiger', 'toad', 'tribal-warrior', 'triceratops', 'tyrannosaurus-rex',
    'veteran', 'vulture', 'war-horse', 'warhorse', 'water-elemental', 'weasel', 'white-dragon-wyrmling',
    'winter-wolf', 'wolf', 'zombie'
]);

// Manual descriptions for obscure monsters (researched from D&D sources)
const MONSTER_DESCRIPTIONS = {
    'ankheg': 'A burrowing insectoid predator with powerful mandibles and acid spray',
    'axe-beak': 'A flightless bird with a sharp, axe-like beak used for hunting',
    'azer': 'A brass-skinned humanoid from the Elemental Plane of Fire with burning hair',
    'balor': 'A massive demon lord wreathed in flames with a fiery whip and sword',
    'barbed-devil': 'A spined fiend that hurls barbed projectiles from its body',
    'bearded-devil': 'A horned devil with a writhing beard of worms and a glaive',
    'behir': 'A serpentine creature with twelve legs and lightning breath',
    'blink-dog': 'A loyal canine that can teleport short distances at will',
    'blood-hawk': 'A vicious bird of prey with razor-sharp talons and beak',
    'black-pudding': 'An amorphous ooze that dissolves organic matter on contact',
    'bone-devil': 'A skeletal fiend with a poisonous stinger tail and hooked claws',
    'brass-dragon': 'A metallic dragon that breathes sleep gas and fire',
    'bronze-dragon': 'A metallic dragon that breathes lightning and repulsion gas',
    'bulette': 'A heavily armored land shark that burrows through earth and stone',
    'chain-devil': 'A devil wrapped in animated chains that bind and torture victims',
    'cloaker': 'A manta ray-like aberration that disguises itself as a cloak',
    'cockatrice': 'A two-legged dragon with a rooster\'s head that can petrify with its bite',
    'couatl': 'A feathered serpent with rainbow wings and divine magic',
    'darkmantle': 'A cave-dwelling creature that resembles a stalactite until it drops on prey',
    'demilich': 'The skull of a powerful lich floating with gems for eyes',
    'doppelganger': 'A shapeshifter that can perfectly mimic any humanoid it has seen',
    'drider': 'A dark elf cursed with the lower body of a giant spider',
    'dryad': 'A tree spirit that protects its forest grove from harm',
    'duergar': 'Gray dwarves from the Underdark with psychic and enlargement abilities',
    'efreeti': 'A powerful fire genie from the Elemental Plane of Fire',
    'ettercap': 'A spider-like humanoid that weaves webs and commands spiders',
    'ettin': 'A two-headed giant with poor coordination but great strength',
    'flameskull': 'An undead floating skull wreathed in green flames',
    'froghemoth': 'A massive amphibian with tentacles and three eyes on stalks',
    'gargoyle': 'A stone creature that resembles architectural decoration when motionless',
    'gelatinous-cube': 'A transparent ooze that fills dungeon corridors and dissolves prey',
    'ghast': 'An undead creature that paralyzes victims with its stench and claws',
    'ghost': 'The tormented spirit of a dead humanoid bound to the material plane',
    'ghoul': 'An undead creature that feeds on corpses and can paralyze with its touch',
    'glabrezu': 'A four-armed demon with pincers that delights in corrupting mortals',
    'gnoll': 'A hyena-like humanoid that serves the demon lord Yeenoghu',
    'gorgon': 'A metallic bull that can petrify creatures with its breath',
    'gray-ooze': 'An acidic slime that corrodes metal and organic matter',
    'grick': 'A worm-like aberration with tentacles surrounding a sharp beak',
    'grimlock': 'A blind, pale humanoid that hunts by sound and smell in caves',
    'harpy': 'A creature with a woman\'s torso and a bird\'s wings and talons',
    'hell-hound': 'A fiendish dog with fire breath and burning bite',
    'hezrou': 'A toad-like demon that emits a nauseating stench',
    'hook-horror': 'An insectoid creature with hook-like claws instead of hands',
    'hydra': 'A multi-headed reptilian beast that regrows severed heads',
    'imp': 'A small devil that serves as a familiar and spy for evil spellcasters',
    'invisible-stalker': 'An air elemental bound to hunt a specific target relentlessly',
    'kraken': 'A colossal sea monster with massive tentacles and ancient intelligence',
    'lamia': 'A creature with a human torso and lion\'s body that drains wisdom',
    'lich': 'An undead spellcaster of immense power who has achieved immortality',
    'manticore': 'A beast with a human head, lion\'s body, and spike-shooting tail',
    'marid': 'A powerful water genie from the Elemental Plane of Water',
    'medusa': 'A creature with snakes for hair whose gaze turns victims to stone',
    'mezzoloth': 'A insectoid yugoloth mercenary from the Lower Planes',
    'mind-flayer': 'An aberration with tentacles that feeds on brains and controls minds',
    'mimic': 'A shapeshifter that disguises itself as treasure chests or furniture',
    'mummy': 'An undead wrapped in bandages that spreads mummy rot disease',
    'nalfeshnee': 'A massive demon with a boar\'s head and nimbus of light',
    'naga': 'A serpentine creature with a human head and powerful magic',
    'nightmare': 'A fiendish horse with a flaming mane and hooves',
    'nothic': 'A one-eyed aberration created from a wizard\'s failed immortality ritual',
    'ochre-jelly': 'A yellow ooze that splits when damaged by lightning or slashing',
    'otyugh': 'A three-legged scavenger with tentacles and a mouth full of teeth',
    'peryton': 'A creature with an elk\'s body and eagle\'s wings that casts a human shadow',
    'phase-spider': 'A giant spider that can shift between the Material and Ethereal planes',
    'pit-fiend': 'The most powerful type of devil, a general in Hell\'s armies',
    'pseudodragon': 'A tiny dragon with a stinger tail that serves as a familiar',
    'purple-worm': 'A colossal burrowing worm with a poisonous stinger',
    'rakshasa': 'A fiend with backwards hands that can shapeshift and cast spells',
    'roc': 'A bird of legendary size capable of carrying off elephants',
    'roper': 'A cave-dwelling predator that resembles a stalagmite with tentacles',
    'rust-monster': 'A creature that corrodes metal with its antennae touch',
    'sahuagin': 'A shark-like humanoid that rules underwater kingdoms',
    'salamander': 'A serpentine creature from the Elemental Plane of Fire with a spear',
    'satyr': 'A fey creature with goat legs known for music and revelry',
    'shadow': 'An undead creature that drains strength and creates more shadows',
    'shambling-mound': 'A plant creature made of rotting vegetation that absorbs lightning',
    'shield-guardian': 'A magical construct that protects its master with a magic shield',
    'shrieker': 'A mushroom that emits piercing shrieks when disturbed',
    'specter': 'An incorporeal undead that drains life force from the living',
    'sphinx': 'A creature with a human head, lion\'s body, and eagle\'s wings that poses riddles',
    'succubus': 'A seductive fiend that corrupts mortals and drains their life force',
    'tarrasque': 'A legendary kaiju-sized monstrosity of incredible destructive power',
    'treant': 'An ancient tree given sentience and mobility to protect forests',
    'troll': 'A lanky giant that regenerates damage unless burned or dissolved by acid',
    'umber-hulk': 'A beetle-like creature that confuses prey with its compound eyes',
    'unicorn': 'A magical horse with a spiral horn and healing powers',
    'vampire': 'An undead creature that feeds on blood and can charm victims',
    'wight': 'An undead warrior that drains life force and creates spawn',
    'will-o-wisp': 'A malevolent ball of light that feeds on fear and despair',
    'wraith': 'An incorporeal undead that creates spawn from those it kills',
    'wyvern': 'A two-legged dragon with a poisonous stinger tail',
    'xorn': 'A three-armed earth elemental that feeds on precious metals and gems',
    'yuan-ti-pureblood': 'A serpentine humanoid with snake-like features and magic resistance'
};

// Function to create enhanced prompt
function createEnhancedPrompt(monster) {
    const basePrompt = `Fantasy D&D ${monster.name}`;
    
    let enhancedPrompt = basePrompt;
    
    // Check if this monster needs a description
    const description = MONSTER_DESCRIPTIONS[monster.index];
    if (description && !OBVIOUS_MONSTERS.has(monster.index)) {
        enhancedPrompt += ` (${description})`;
    }
    
    enhancedPrompt += ', dark fantasy card art style, detailed full body portrait, dramatic lighting, menacing expression, high quality digital art --ar 16:9 --style raw';
    
    return `/imagine ${enhancedPrompt}`;
}

// Main function
function enhanceMonsterPrompts() {
    console.log(`🚀 Creating enhanced prompts for ${ALL_MONSTERS.length} monsters...`);
    
    const enhancedPrompts = [];
    let enhancedCount = 0;
    let basicCount = 0;
    
    for (const monster of ALL_MONSTERS) {
        const enhancedPrompt = createEnhancedPrompt(monster);
        enhancedPrompts.push(enhancedPrompt);
        enhancedPrompts.push(''); // Add blank line for readability
        
        if (MONSTER_DESCRIPTIONS[monster.index] && !OBVIOUS_MONSTERS.has(monster.index)) {
            console.log(`✅ Enhanced: ${monster.name} - ${MONSTER_DESCRIPTIONS[monster.index].substring(0, 50)}...`);
            enhancedCount++;
        } else {
            console.log(`📝 Basic: ${monster.name}`);
            basicCount++;
        }
    }
    
    // Write enhanced prompts to file
    const outputContent = enhancedPrompts.join('\n');
    fs.writeFileSync('enhanced-monster-prompts.txt', outputContent);
    
    // Summary
    console.log('\n📊 Enhancement Summary:');
    console.log(`✅ Enhanced with descriptions: ${enhancedCount}`);
    console.log(`📝 Basic prompts (self-explanatory): ${basicCount}`);
    console.log(`📄 Enhanced prompts saved to: enhanced-monster-prompts.txt`);
    console.log('\n🎉 Monster prompt enhancement complete!');
    
    // Show some examples
    console.log('\n📋 Examples of enhanced prompts:');
    const exampleMonsters = ['ankheg', 'bulette', 'rust-monster', 'umber-hulk', 'xorn'];
    for (const index of exampleMonsters) {
        const monster = ALL_MONSTERS.find(m => m.index === index);
        if (monster) {
            console.log(`   ${createEnhancedPrompt(monster)}`);
        }
    }
}

// Run the script
if (require.main === module) {
    enhanceMonsterPrompts();
}

module.exports = { enhanceMonsterPrompts, createEnhancedPrompt };