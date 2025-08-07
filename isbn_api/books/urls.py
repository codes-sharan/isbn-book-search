# books/urls.py
from django.urls import path
from .views import get_book_info

urlpatterns = [
    path('book/<str:isbn>/', get_book_info),
]


