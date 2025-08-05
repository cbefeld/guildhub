#!/usr/bin/env python3
"""
Simple Web Scraper Example
This script demonstrates basic web scraping using requests and BeautifulSoup
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def scrape_website(url):
    """
    Scrape a website and return the parsed HTML content
    """
    try:
        # Send a GET request to the URL
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        return soup
        
    except requests.RequestException as e:
        print(f"Error fetching the website: {e}")
        return None

def extract_links(soup):
    """
    Extract all links from the webpage
    """
    links = []
    for link in soup.find_all('a', href=True):
        links.append({
            'text': link.get_text(strip=True),
            'url': link['href']
        })
    return links

def extract_headings(soup):
    """
    Extract all headings (h1, h2, h3, etc.) from the webpage
    """
    headings = []
    for heading in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        headings.append({
            'level': heading.name,
            'text': heading.get_text(strip=True)
        })
    return headings

def main():
    # Example: Scrape a news website
    url = "https://httpbin.org/html"  # A safe test URL
    
    print(f"Scraping: {url}")
    print("=" * 50)
    
    # Scrape the website
    soup = scrape_website(url)
    
    if soup:
        # Extract information
        title = soup.title.string if soup.title else "No title found"
        links = extract_links(soup)
        headings = extract_headings(soup)
        
        # Display results
        print(f"Page Title: {title}")
        print(f"\nFound {len(headings)} headings:")
        for heading in headings[:5]:  # Show first 5 headings
            print(f"  {heading['level'].upper()}: {heading['text']}")
        
        print(f"\nFound {len(links)} links:")
        for link in links[:5]:  # Show first 5 links
            print(f"  {link['text']} -> {link['url']}")
        
        # Save results to a file
        results = {
            'url': url,
            'scraped_at': datetime.now().isoformat(),
            'title': title,
            'headings': headings,
            'links': links
        }
        
        with open('scraping_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\nResults saved to 'scraping_results.json'")
        
    else:
        print("Failed to scrape the website")

if __name__ == "__main__":
    main() 