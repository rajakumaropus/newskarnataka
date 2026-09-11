#!/usr/bin/env python3
"""
Scrape articles from https://newskarnataka.com/
and populate Strapi with real data
"""

import requests
from bs4 import BeautifulSoup
import json
import sys
from datetime import datetime, timedelta
import time

class NewsKarnatakaScraper:
    def __init__(self, strapi_url, api_token):
        self.strapi_url = strapi_url
        self.api_token = api_token
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }
        self.news_site = "https://newskarnataka.com"
        
    def scrape_articles(self):
        """Scrape articles from newskarnataka.com"""
        print("🔍 Scraping articles from newskarnataka.com...")
        
        articles = []
        categories_to_scrape = [
            'bengaluru',
            'mangaluru', 
            'udupi',
            'mysuru',
            'recent-news'
        ]
        
        for category in categories_to_scrape:
            try:
                url = f"{self.news_site}/category/{category}"
                print(f"  📍 Fetching {category}...")
                
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find article elements (adjust selector based on site structure)
                article_elements = soup.find_all('article') or soup.find_all('div', class_='post')
                
                for elem in article_elements[:5]:  # Get top 5 from each category
                    article = self.extract_article(elem, category)
                    if article:
                        articles.append(article)
                
                time.sleep(1)  # Be respectful to the server
                
            except Exception as e:
                print(f"  ❌ Error scraping {category}: {e}")
        
        return articles
    
    def extract_article(self, element, category):
        """Extract article data from element"""
        try:
            # Try different selectors based on common WordPress themes
            title_elem = element.find('h2', class_='post-title') or \
                        element.find('h3', class_='entry-title') or \
                        element.find('h2')
            
            title = title_elem.get_text().strip() if title_elem else None
            
            if not title:
                return None
            
            # Get excerpt/description
            excerpt_elem = element.find('div', class_='post-excerpt') or \
                          element.find('p', class_='entry-summary') or \
                          element.find('p')
            
            description = excerpt_elem.get_text().strip() if excerpt_elem else title
            
            # Limit description length
            if len(description) > 500:
                description = description[:497] + "..."
            
            # Get link
            link_elem = element.find('a', href=True)
            slug = link_elem['href'].split('/')[-2] if link_elem else title.lower().replace(' ', '-')
            
            article = {
                "title": title[:200],  # Limit title
                "slug": slug[:200],
                "description": description,
                "content": description,  # Use same as description for now
                "category": category,
                "is_featured": False,
                "status": "published",
                "publishedAt": (datetime.now() - timedelta(days=1)).isoformat()
            }
            
            return article
            
        except Exception as e:
            print(f"    Error extracting article: {e}")
            return None
    
    def create_categories(self, articles):
        """Create categories in Strapi"""
        print("\n📁 Creating categories...")
        
        categories = {}
        unique_cats = set(a['category'] for a in articles)
        
        for cat in unique_cats:
            try:
                data = {
                    "data": {
                        "name": cat.replace('-', ' ').title(),
                        "description": f"{cat.title()} news from Karnataka"
                    }
                }
                
                response = requests.post(
                    f"{self.strapi_url}/api/categories",
                    json=data,
                    headers=self.headers,
                    timeout=10
                )
                
                if response.status_code in [200, 201]:
                    cat_id = response.json()['data']['id']
                    categories[cat] = cat_id
                    print(f"  ✅ Created category: {cat} (ID: {cat_id})")
                else:
                    print(f"  ⚠️  Failed to create category {cat}: {response.status_code}")
                    
            except Exception as e:
                print(f"  ❌ Error creating category {cat}: {e}")
        
        return categories
    
    def create_articles(self, articles, categories):
        """Create articles in Strapi"""
        print("\n📄 Creating articles...")
        
        for i, article in enumerate(articles):
            try:
                cat_id = categories.get(article['category'])
                
                data = {
                    "data": {
                        "title": article['title'],
                        "slug": article['slug'],
                        "description": article['description'],
                        "content": article['content'],
                        "status": "published",
                        "is_featured": i < 3,  # First 3 are featured
                        "publishedAt": article['publishedAt'],
                        **({'category': cat_id} if cat_id else {})
                    }
                }
                
                response = requests.post(
                    f"{self.strapi_url}/api/articles",
                    json=data,
                    headers=self.headers,
                    timeout=10
                )
                
                if response.status_code in [200, 201]:
                    print(f"  ✅ Created article: {article['title'][:50]}...")
                else:
                    print(f"  ⚠️  Failed to create article: {response.status_code}")
                    
            except Exception as e:
                print(f"  ❌ Error creating article: {e}")
            
            time.sleep(0.5)
    
    def run(self):
        """Run the scraper"""
        print("=" * 60)
        print("🚀 NewsKarnataka Sample Data Scraper")
        print("=" * 60)
        print()
        
        # Scrape articles
        articles = self.scrape_articles()
        
        if not articles:
            print("❌ No articles found to scrape")
            return False
        
        print(f"\n✅ Found {len(articles)} articles")
        
        # Create categories
        categories = self.create_categories(articles)
        
        # Create articles
        self.create_articles(articles, categories)
        
        print("\n" + "=" * 60)
        print("✅ Sample data creation complete!")
        print("=" * 60)
        
        return True


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python scrape-newskarnataka.py <strapi_url> <api_token>")
        print("Example: python scrape-newskarnataka.py http://103.191.208.235:1337 abc123...")
        sys.exit(1)
    
    strapi_url = sys.argv[1]
    api_token = sys.argv[2]
    
    scraper = NewsKarnatakaScraper(strapi_url, api_token)
    scraper.run()
