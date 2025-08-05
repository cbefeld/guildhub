#!/usr/bin/env python3
"""
D&D 5e Spells Scraper (Correct)
Scrapes spell information from https://www.aidedd.org/dnd-filters/spells-5e.php
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
import re
from datetime import datetime
import time

class DnDSpellsScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.base_url = "https://www.aidedd.org"
        self.spells_url = "https://www.aidedd.org/dnd-filters/spells-5e.php"
    
    def scrape_spells_table(self):
        """
        Scrape the main spells table from the website
        """
        try:
            print(f"Scraping spells from: {self.spells_url}")
            response = self.session.get(self.spells_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find the main spells table
            table = soup.find('table')
            if not table:
                print("No table found on the page")
                return []
            
            spells = []
            rows = table.find_all('tr')[1:]  # Skip header row
            
            print(f"Found {len(rows)} spells to process...")
            
            for i, row in enumerate(rows):
                if i % 50 == 0:  # Progress indicator
                    print(f"Processing spell {i+1}/{len(rows)}...")
                
                cells = row.find_all('td')
                if len(cells) >= 11:  # Ensure we have enough columns (11 total)
                    spell = self._parse_spell_row(cells)
                    if spell:
                        spells.append(spell)
                
                # Small delay to be respectful
                time.sleep(0.1)
            
            print(f"Successfully scraped {len(spells)} spells!")
            return spells
            
        except requests.RequestException as e:
            print(f"Error scraping spells: {e}")
            return []
    
    def _parse_spell_row(self, cells):
        """
        Parse a single spell row from the table
        Columns: [empty] | Spell | Lvl | School | Casting Time | Range | V,S,M | Concentration | Ritual | Description | Source
        """
        try:
            # Extract spell name and link (column 1, index 1)
            spell_cell = cells[1]
            spell_link = spell_cell.find('a')
            spell_name = spell_link.get_text(strip=True) if spell_link else spell_cell.get_text(strip=True)
            spell_url = spell_link['href'] if spell_link and 'href' in spell_link.attrs else ""
            
            # Extract other fields based on actual table structure
            level = cells[2].get_text(strip=True)
            school = cells[3].get_text(strip=True)
            casting_time = cells[4].get_text(strip=True)
            range_val = cells[5].get_text(strip=True)
            components = cells[6].get_text(strip=True)
            concentration = cells[7].get_text(strip=True)
            ritual = cells[8].get_text(strip=True)
            description = cells[9].get_text(strip=True)
            source = cells[10].get_text(strip=True)
            
            # Clean up the data
            level = self._clean_level(level)
            concentration = "Yes" if concentration.strip() else "No"
            ritual = "Yes" if ritual.strip() else "No"
            
            # Only include spells with valid names
            if not spell_name or spell_name.strip() == "":
                return None
            
            spell_data = {
                'name': spell_name,
                'url': spell_url,
                'level': level,
                'school': school,
                'casting_time': casting_time,
                'range': range_val,
                'components': components,
                'concentration': concentration,
                'ritual': ritual,
                'description': description,
                'source': source
            }
            
            return spell_data
            
        except Exception as e:
            print(f"Error parsing spell row: {e}")
            return None
    
    def _clean_level(self, level_text):
        """
        Clean and standardize spell level
        """
        level_text = level_text.strip()
        if level_text == "0":
            return "Cantrip"
        return f"Level {level_text}"
    
    def save_to_json(self, spells, filename):
        """
        Save spells data to JSON file
        """
        data = {
            'scraped_at': datetime.now().isoformat(),
            'source_url': self.spells_url,
            'total_spells': len(spells),
            'spells': spells
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Spells data saved to {filename}")
    
    def save_to_csv(self, spells, filename):
        """
        Save spells data to CSV file
        """
        if not spells:
            print("No spells to save")
            return
        
        fieldnames = spells[0].keys()
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for spell in spells:
                writer.writerow(spell)
        
        print(f"Spells data saved to {filename}")
    
    def analyze_spells(self, spells):
        """
        Provide some basic analysis of the scraped spells
        """
        if not spells:
            return
        
        print("\n" + "="*50)
        print("SPELLS ANALYSIS")
        print("="*50)
        
        # Count by level
        level_counts = {}
        school_counts = {}
        concentration_count = 0
        ritual_count = 0
        
        for spell in spells:
            # Level counts
            level = spell['level']
            level_counts[level] = level_counts.get(level, 0) + 1
            
            # School counts
            school = spell['school']
            school_counts[school] = school_counts.get(school, 0) + 1
            
            # Concentration and ritual counts
            if spell['concentration'] == 'Yes':
                concentration_count += 1
            if spell['ritual'] == 'Yes':
                ritual_count += 1
        
        print(f"\nTotal Spells: {len(spells)}")
        print(f"Concentration Spells: {concentration_count}")
        print(f"Ritual Spells: {ritual_count}")
        
        print(f"\nSpells by Level:")
        # Sort levels properly: Cantrip first, then Level 1-9
        sorted_levels = sorted(level_counts.keys(), 
                             key=lambda x: (0 if x == "Cantrip" else int(x.split()[1])))
        for level in sorted_levels:
            print(f"  {level}: {level_counts[level]}")
        
        print(f"\nSpells by School:")
        for school in sorted(school_counts.keys()):
            print(f"  {school}: {school_counts[school]}")

def main():
    scraper = DnDSpellsScraper()
    
    print("D&D 5e Spells Scraper (Correct)")
    print("="*50)
    
    # Scrape the spells
    spells = scraper.scrape_spells_table()
    
    if spells:
        # Save the data
        scraper.save_to_json(spells, 'dnd_spells_correct.json')
        scraper.save_to_csv(spells, 'dnd_spells_correct.csv')
        
        # Analyze the spells
        scraper.analyze_spells(spells)
        
        # Show some examples
        print(f"\nExample Spells:")
        for i, spell in enumerate(spells[:5], 1):
            print(f"\n{i}. {spell['name']} ({spell['level']})")
            print(f"   School: {spell['school']}")
            print(f"   Casting Time: {spell['casting_time']}")
            print(f"   Range: {spell['range']}")
            print(f"   Components: {spell['components']}")
            print(f"   Concentration: {spell['concentration']}, Ritual: {spell['ritual']}")
            print(f"   Description: {spell['description'][:100]}...")
            print(f"   Source: {spell['source']}")
        
        print(f"\nAll spell data has been saved to 'dnd_spells_correct.json' and 'dnd_spells_correct.csv'")
        
    else:
        print("No spells were scraped. Please check the website and try again.")

if __name__ == "__main__":
    main() 