

# books/views.py
from django.http import JsonResponse
import requests

def get_book_info(request, isbn):
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        book_key = f"ISBN:{isbn}"
        
        if book_key not in data:
            return JsonResponse({'error': 'Book not found'}, status=404)
            
        book_data = data[book_key]
        
        # Extract ISBNs
        identifiers = book_data.get('identifiers', {})
        isbn_10 = identifiers.get('isbn_10', [])
        isbn_13 = identifiers.get('isbn_13', [])
        
        # Extract cover image
        cover = book_data.get('cover', {})
        cover_url = cover.get('large', '') if cover else ''
        
        return JsonResponse({
            "title": book_data.get("title", ""),
            "authors": [author["name"] for author in book_data.get("authors", [])],
            "publishers": [pub["name"] for pub in book_data.get("publishers", [])],
            "publish_date": book_data.get("publish_date", ""),
            "isbn_10": isbn_10,
            "isbn_13": isbn_13,
            "cover": cover_url
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




