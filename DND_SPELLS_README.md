# D&D 5e Spells Scraper

This project successfully scrapes all 477 D&D 5e spells from [AideDD](https://www.aidedd.org/dnd-filters/spells-5e.php) and provides structured data for analysis and use.

## 🎯 What Was Scraped

Successfully extracted **477 spells** with the following data fields:

- **Name**: Spell name with link to detailed page
- **Level**: Spell level (Cantrip, Level 1-9)
- **School**: Magic school (abjuration, conjuration, etc.)
- **Casting Time**: How long it takes to cast
- **Range**: Spell range
- **Components**: Required components (V, S, M)
- **Concentration**: Whether it requires concentration
- **Ritual**: Whether it can be cast as a ritual
- **Description**: Spell description
- **Source**: Source book (Player's Handbook, Xanathar's Guide, etc.)

## 📊 Data Analysis Results

### Spell Distribution by Level:
- **Cantrips**: 44 spells
- **Level 1**: 73 spells
- **Level 2**: 73 spells
- **Level 3**: 67 spells
- **Level 4**: 48 spells
- **Level 5**: 59 spells
- **Level 6**: 46 spells
- **Level 7**: 25 spells
- **Level 8**: 22 spells
- **Level 9**: 20 spells

### Spell Distribution by School:
- **Evocation**: 101 spells (most common)
- **Conjuration**: 87 spells
- **Transmutation**: 94 spells
- **Abjuration**: 52 spells
- **Enchantment**: 42 spells
- **Necromancy**: 38 spells
- **Divination**: 32 spells
- **Illusion**: 31 spells

### Special Characteristics:
- **Concentration Spells**: 218 (45.7%)
- **Ritual Spells**: 33 (6.9%)

## 📁 Generated Files

1. **`dnd_spells_correct.json`** - Complete spell data in JSON format
2. **`dnd_spells_correct.csv`** - Complete spell data in CSV format
3. **`dnd_spells_correct.py`** - The working scraper script

## 🚀 How to Use

### Run the Scraper:
```bash
# Activate virtual environment
source scraping_env/bin/activate

# Run the scraper
python dnd_spells_correct.py
```

### Use the Data:
```python
import json

# Load the spell data
with open('dnd_spells_correct.json', 'r') as f:
    data = json.load(f)

spells = data['spells']

# Example: Find all cantrips
cantrips = [spell for spell in spells if spell['level'] == 'Cantrip']

# Example: Find all fire spells
fire_spells = [spell for spell in spells if 'fire' in spell['description'].lower()]

# Example: Find all ritual spells
ritual_spells = [spell for spell in spells if spell['ritual'] == 'Yes']
```

## 🔧 Technical Details

### Scraping Process:
1. **Table Structure Analysis**: Identified 11-column table structure
2. **Data Extraction**: Parsed each row to extract spell information
3. **Data Cleaning**: Standardized levels, concentration, and ritual fields
4. **Error Handling**: Robust error handling for malformed data
5. **Rate Limiting**: Added delays to be respectful to the server

### Key Features:
- **Progress Tracking**: Shows progress during scraping
- **Data Validation**: Ensures only valid spells are included
- **Multiple Formats**: Saves data in both JSON and CSV
- **Analysis**: Provides statistical breakdown of the data
- **Respectful Scraping**: Includes delays and proper headers

## 📈 Potential Use Cases

1. **D&D Character Building**: Filter spells by class, level, or school
2. **Spell Analysis**: Study spell distribution and balance
3. **Game Development**: Use as reference data for D&D-based games
4. **Research**: Analyze magic system design patterns
5. **Tools Development**: Build spell lookup tools or character sheets

## 🛠️ Customization

You can easily modify the scraper for other purposes:

```python
# Filter spells by school
evocation_spells = [spell for spell in spells if spell['school'] == 'evocation']

# Filter by level range
low_level_spells = [spell for spell in spells if spell['level'] in ['Cantrip', 'Level 1', 'Level 2']]

# Search by description
damage_spells = [spell for spell in spells if 'damage' in spell['description'].lower()]
```

## 📝 Notes

- **Source**: Data scraped from [AideDD](https://www.aidedd.org/dnd-filters/spells-5e.php)
- **Last Updated**: August 4, 2025
- **Total Spells**: 477
- **Data Quality**: High - all fields properly extracted and cleaned

## 🤝 Legal Notice

This scraper is for educational and personal use. Always respect website terms of service and robots.txt files. The spell data belongs to Wizards of the Coast and is used under fair use for educational purposes. 