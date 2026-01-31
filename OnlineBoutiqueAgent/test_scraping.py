import requests
from bs4 import BeautifulSoup
import re

base_url = "https://cymbal-shops.retail.cymbal.dev"
response = requests.get(base_url)
soup = BeautifulSoup(response.content, 'html.parser')

products = []
product_links = soup.find_all('a', href=True)

print(f"Total links found: {len(product_links)}")

for link in product_links:
    href = link.get('href')
    if href and href.startswith('/product/'):
        product_id = href.split('/')[-1]
        
        # Find the parent element
        parent = link.parent
        if parent:
            text_content = parent.get_text().strip()
            print(f"\nProduct ID: {product_id}")
            print(f"Parent text: {repr(text_content)}")
            
            # Look for price pattern
            price_match = re.search(r'\$(\d+\.?\d*)', text_content)
            price = price_match.group(0) if price_match else "N/A"
            
            # Extract product name
            if price_match:
                name = text_content[:price_match.start()].strip()
            else:
                name = text_content
            
            print(f"Extracted name: {repr(name)}")
            print(f"Extracted price: {price}")
            
            if name and name not in ["Hot Products", ""]:
                product_info = {
                    "id": product_id,
                    "name": name,
                    "price": price,
                    "url": f"{base_url}{href}"
                }
                products.append(product_info)

print(f"\n\nTotal products found: {len(products)}")
print("\nProducts:")
for p in products:
    print(f"  - {p['name']} ({p['price']}) - ID: {p['id']}")
