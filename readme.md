# ISBN Book Search App

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://isbn-book-search.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repo-blue)](https://github.com/codes-sharan/isbn-book-search)

A full-stack application that allows users to search book details by ISBN number. Built with Next.js (React) frontend and Django backend.

![App Screenshot](https://res.cloudinary.com/dpkihscr2/image/upload/v1754616635/isbn_lkiwfk.png)

## Features

- **ISBN Search**: Find books by 10-digit or 13-digit ISBN numbers
- **Book Details**: Display title, authors, publishers, publication date, and cover image
- **Recent Searches**: Automatically saves last 5 searches in local storage
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Validation**: Real-time ISBN format validation
- **Error Handling**: User-friendly error messages

## Tech Stack

### Frontend
- **Framework**: Next.js (React) with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Hooks
- **Build Tool**: Vite

### Backend
- **Framework**: Django
- **API Client**: Requests
- **Data Source**: Open Library API

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- pip

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/codes-sharan/isbn-book-search.git
cd isbn-book-search
