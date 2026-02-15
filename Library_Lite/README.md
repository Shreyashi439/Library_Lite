Library Lite 📚

Library Lite is a small full-stack web application for managing books, members, lending, waitlists, and reports.
The project focuses on correctness, clean architecture, and core library workflows.

Project Structure
library-lite/
├── backend/
├── frontend/
└── README.md

Features
1. Books

Add books with title, author, and tags

Prevent duplicate book titles

Search books by title (case-insensitive)

View book availability status

2. Lending & Waitlist

Lend available books to members

If a book is already loaned, members are added to a waitlist

FIFO (first-in-first-out) waitlist handling

3. Returns

Return books from the Members page

Automatically loan the book to the next waitlisted member (if any)

If no waitlist exists, the book becomes available

4. Members

Add and delete members

View active loans per member

5. Reports

Overdue report sorted by days overdue

Top books report sorted by checkout count (with title as tie-breaker)

6. Populate by Genre (Optional / Bonus)

Populate the library using an LLM (Google Gemini)

Enter a genre and automatically add books for that genre

Tech Stack

Frontend: React + Vite

Backend: Node.js + Express

Database: Supabase (PostgreSQL)

LLM Integration: Google Gemini

📚 Database Schema

This project uses PostgreSQL as the backend database.

SQL Definition
-- =========================
-- BOOKS TABLE
-- =========================
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  tags text[],
  status text not null default 'AVAILABLE',
  checkout_count integer not null default 0,
  created_at timestamp default now()
);

-- Case-insensitive unique title
create unique index books_title_unique
on books (lower(title));


-- =========================
-- MEMBERS TABLE
-- =========================
create table members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  created_at timestamp default now()
);


-- =========================
-- LOANS TABLE
-- =========================
create table loans (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  loan_date date not null,
  due_date date not null,
  returned boolean not null default false
);


-- =========================
-- WAITLIST TABLE
-- =========================
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  position integer not null,
  created_at timestamp default now()
);

-- Prevent duplicate waitlist entries per book per member
create unique index unique_waitlist_entry
on waitlist (book_id, member_id);

🔎 Schema Overview
📘 Books

Stores all books in the catalog

Title is case-insensitive unique

Tracks availability status

Tracks total checkout count

👤 Members

Stores registered library members

📖 Loans

Tracks borrowed books

Links books and members

Supports cascade delete

⏳ Waitlist

Maintains queue order per book

Prevents duplicate member entries per book

How to Run the Project
Backend Setup
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


Open the app in your browser:

http://localhost:5173

Key Design Decisions

Return action is handled on the Members page for cleaner UX

Waitlist logic is fully handled in the backend

Auto-loan happens only when a book is returned

Frontend remains thin and declarative

Assumptions

A member can have multiple active loans

Waitlist order is FIFO

Duplicate book titles are rejected

Unit tests were not implemented as they were optional per the assignment requirements
