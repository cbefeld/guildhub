#!/usr/bin/env python3
"""
Advanced Web Scraper Example
This script demonstrates more advanced web scraping techniques
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import csv
from datetime import datetime
import re

class WebScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def scrape_quotes(self):
        """
        Scrape quotes from quotes.toscrape.com
        """
        base_url = "http://quotes.toscrape.com"
        quotes = []
        
        try:
            # Scrape the first page
            response = self.session.get(base_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find all quote containers
            quote_containers = soup.find_all('div', class_='quote')
            
            for container in quote_containers:
                # Extract quote text
                text_elem = container.find('span', class_='text')
                text = text_elem.get_text(strip=True) if text_elem else ""
                
                # Extract author
                author_elem = container.find('small', class_='author')
                author = author_elem.get_text(strip=True) if author_elem else ""
                
                # Extract tags
                tags_elem = container.find_all('a', class_='tag')
                tags = [tag.get_text(strip=True) for tag in tags_elem]
                
                quotes.append({
                    'text': text,
                    'author': author,
                    'tags': tags
                })
            
            print(f"Scraped {len(quotes)} quotes from {base_url}")
            return quotes
            
        except requests.RequestException as e:
            print(f"Error scraping quotes: {e}")
            return []
    
    def scrape_news_headlines(self):
        """
        Scrape news headlines from a news website
        """
        # Using a news RSS feed as an example
        url = "https://feeds.bbci.co.uk/news/rss.xml"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'xml')  # Use XML parser for RSS
            
            headlines = []
            items = soup.find_all('item')
            
            for item in items[:10]:  # Get first 10 headlines
                title_elem = item.find('title')
                title = title_elem.get_text(strip=True) if title_elem else ""
                
                description_elem = item.find('description')
                description = description_elem.get_text(strip=True) if description_elem else ""
                
                pub_date_elem = item.find('pubDate')
                pub_date = pub_date_elem.get_text(strip=True) if pub_date_elem else ""
                
                headlines.append({
                    'title': title,
                    'description': description,
                    'pub_date': pub_date
                })
            
            print(f"Scraped {len(headlines)} news headlines")
            return headlines
            
        except requests.RequestException as e:
            print(f"Error scraping news: {e}")
            return []
    
    def save_to_csv(self, data, filename):
        """
        Save scraped data to CSV file
        """
        if not data:
            print("No data to save")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = data[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for row in data:
                writer.writerow(row)
        
        print(f"Data saved to {filename}")
    
    def save_to_json(self, data, filename):
        """
        Save scraped data to JSON file
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"Data saved to {filename}")

def main():
    scraper = WebScraper()
    
    print("Advanced Web Scraper")
    print("=" * 50)
    
    # Scrape quotes
    print("\n1. Scraping quotes...")
    quotes = scraper.scrape_quotes()
    if quotes:
        scraper.save_to_json(quotes, 'quotes.json')
        scraper.save_to_csv(quotes, 'quotes.csv')
        
        # Display first 3 quotes
        print("\nFirst 3 quotes:")
        for i, quote in enumerate(quotes[:3], 1):
            print(f"{i}. \"{quote['text']}\" - {quote['author']}")
            print(f"   Tags: {', '.join(quote['tags'])}")
            print()
    
    # Wait a bit between requests
    time.sleep(2)
    
    # Scrape news headlines
    print("\n2. Scraping news headlines...")
    headlines = scraper.scrape_news_headlines()
    if headlines:
        scraper.save_to_json(headlines, 'headlines.json')
        scraper.save_to_csv(headlines, 'headlines.csv')
        
        # Display first 3 headlines
        print("\nFirst 3 headlines:")
        for i, headline in enumerate(headlines[:3], 1):
            print(f"{i}. {headline['title']}")
            print(f"   {headline['description'][:100]}...")
            print(f"   Published: {headline['pub_date']}")
            print()

if __name__ == "__main__":
    main() 