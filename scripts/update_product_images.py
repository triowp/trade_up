from pathlib import Path
import json

path = Path('src/data/products.js')
text = path.read_text(encoding='utf-8')
start = text.index('[')
end = text.rindex(']') + 1
products = json.loads(text[start:end])
category_map = {
    'fruits': '/images/products/fruits.svg',
    'vegetables': '/images/products/vegetables.svg',
    'dairy': '/images/products/dairy.svg',
    'bakery': '/images/products/bakery.svg',
    'drinks': '/images/products/drinks.svg',
    'household': '/images/products/household.svg',
    'beauty': '/images/products/beauty.svg',
    'snacks': '/images/products/snacks.svg',
    'meat': '/images/products/meat.svg',
    'seafood': '/images/products/seafood.svg',
}
for product in products:
    product['image'] = category_map.get(product['category'], '/images/products/fruits.svg')

path.write_text('export const PRODUCTS = ' + json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Updated', len(products), 'products to use local images')
