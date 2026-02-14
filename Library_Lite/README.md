library-lite/
├── backend/
├── frontend/
└── README.md

# Library Lite 📚

Library Lite is a small full‑stack web application for managing books, members, lending, waitlists, and reports.  
The project focuses on correctness, clean architecture, and core library workflows.

---

## Features

### 1. Books

- Add books with title, author, and tags
- Prevent duplicate book titles
- Search books by title (case‑insensitive)
- View book availability status

### 2. Lending & Waitlist

- Lend available books to members
- If a book is already loaned, members are added to a waitlist
- FIFO (first‑in‑first‑out) waitlist handling

### 3. Returns

- Return books from the Members page
- Automatically loan the book to the next waitlisted member (if any)
- If no waitlist exists, the book becomes available

### 4. Members

- Add and delete members
- View active loans per member

### 5. Reports

- Overdue report sorted by days overdue
- Top books report sorted by checkout count (with title as tie‑breaker)

### 6. Populate by Genre (Optional / Bonus)

- Populate the library using an LLM (Google Gemini)
- Enter a genre and automatically add books for that genre

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **LLM Integration:** Google Gemini

---

## Project Structure

library-lite/
├── backend/
│ ├── src/
│ └── app.js
├── frontend/
│ ├── src/
│ └── vite.config.js
└── README.md

---

## How to Run the Project

### Backend Setup

```bash
cd backend
npm install
npm run dev
Create a .env file in the backend root:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
Frontend Setup
cd frontend
npm install
npm run dev
Open the app in browser:

http://localhost:5173

Key Design Decisions
Return action is handled on the Members page for cleaner UX

Waitlist logic is fully handled in the backend

Auto‑loan happens only when a book is returned

Frontend remains thin and declarative

Assumptions
A member can have multiple active loans

Waitlist order is FIFO

Duplicate book titles are rejected

Unit tests were not implemented as they were optional per the assignment requirements.

```
