

"use client";

import { useState, KeyboardEvent, useEffect } from 'react';
import { BookOpenIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type Book = {
  title: string;
  authors?: string[];
  publishers?: string[];
  publish_date?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  cover?: string;
};

export default function Home() {
  const [isbn, setIsbn] = useState<string>('');
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('isbnSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('isbnSearchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const cleanIsbn = (isbn: string): string => {
    return isbn.replace(/[-\s]/g, '');
  };

  const validateIsbn = (isbn: string): boolean => {
    const cleaned = cleanIsbn(isbn);
    return cleaned.length === 10 || cleaned.length === 13;
  };

  const handleSearch = async () => {
    if (!isbn.trim()) {
      setError('Please enter an ISBN');
      return;
    }
    
    if (!validateIsbn(isbn)) {
      setError('Invalid ISBN format. Use 10 or 13 digits');
      return;
    }

    setLoading(true);
    setBook(null);
    setError(null);
    
    try {
      const cleanedIsbn = cleanIsbn(isbn);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/book/${cleanedIsbn}/`);
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Book not found');
      }
      
      const data: Book = await res.json();
      setBook(data);
      
      // Update search history
      setSearchHistory(prev => {
        const newHistory = [cleanedIsbn, ...prev.filter(h => h !== cleanedIsbn)];
        return newHistory.slice(0, 5); // Keep only last 5 searches
      });
    } catch (err: unknown) {
        if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('An unexpected error occurred');
  }
    
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setIsbn('');
    setBook(null);
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryClick = (isbn: string) => {
    setIsbn(isbn);
    // Trigger search after a small delay to ensure state update
    setTimeout(handleSearch, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex flex-col items-center">
      <div className="max-w-2xl w-full py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpenIcon className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BookFinder
            </h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Find books by ISBN number. Try 10-digit (eg. 0062316095) or 13-digit ISBNs (eg. 9780061120084)
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter ISBN number..."
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="ISBN search input"
            />
            {isbn && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className={` cursor-pointer w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white transition-all ${
              loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <>
                <svg className=" animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              'Find Book'
            )}
          </button>
        </div>

        {searchHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-5 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((histIsbn, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(histIsbn)}
                  className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  {histIsbn}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {book && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {book.cover ? (
                <div className="md:flex-shrink-0 flex items-center justify-center p-8 bg-gray-50">
                  <Image 
                    src={book.cover} 
                    width={500}
                    height={500}
                    alt={`Cover of ${book.title}`}
                    className="h-64 w-auto object-contain rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="md:flex-shrink-0 flex items-center justify-center p-8 bg-gray-50">
                  <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-xl w-48 h-64 flex items-center justify-center">
                    <BookOpenIcon className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
                  <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {book.isbn_10?.[0] ? 'ISBN-10' : 'ISBN-13'}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {book.authors && book.authors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Authors</h3>
                      <p className="text-gray-900">{book.authors.join(', ')}</p>
                    </div>
                  )}
                  
                  {book.publishers && book.publishers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Publisher</h3>
                      <p className="text-gray-900">{book.publishers.join(', ')}</p>
                    </div>
                  )}
                  
                  {book.publish_date && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Publication Date</h3>
                      <p className="text-gray-900">{book.publish_date}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    {book.isbn_10 && book.isbn_10.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">ISBN-10</h3>
                        <p className="text-gray-900">{book.isbn_10[0]}</p>
                      </div>
                    )}
                    
                    {book.isbn_13 && book.isbn_13.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">ISBN-13</h3>
                        <p className="text-gray-900">{book.isbn_13[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!book && !error && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
              <BookOpenIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Search by ISBN</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter a 10-digit or 13-digit ISBN number above to find book details.
              ISBNs can be found on the back cover of books, usually near the barcode.
            </p>
          </div>
        )}
      </div>
      
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        <p>BookFinder &copy; {new Date().getFullYear()} - Search books by ISBN (Sharan Panthi)</p>
      </footer>
    </div>
  );
}

