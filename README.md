# 📚 CampusLib Exchange — Community Library Web App

> A lightweight, single-page web application built with plain HTML, CSS, and Vanilla JavaScript for students and residents in hostels, housing societies, or college campuses to share, lend, borrow, and swap books.

---

## 👨‍💻 Project Overview
* **Author:** Rahul Verma
* **Branch & Year:** B.Tech Computer Science & Engineering (1st Year)
* **Tech Stack:** Plain HTML5, CSS3, Vanilla JavaScript (ES6) — No frameworks, no external libraries, no backend required!
* **Storage:** Browser `localStorage` (persists state across page refreshes)

---

## 🎯 Key Features

### 1. 🏠 Home Page & Live Dashboard
- Welcoming hero banner with quick call-to-actions.
- Live statistic counters updated in real-time:
  - **Total Books** in library
  - **Available to Borrow**
  - **Currently Borrowed**
  - **Active Requests**
- "Recently Added Books" section showcasing the latest additions from campus peers.

### 2. 🔍 Browse & Search Catalog
- Responsive card grid displaying book titles, authors, categories, conditions, and owner contact details.
- **Live Search**: Instant filtering as you type across book title, author, and owner name.
- **Multi-Filter Dropdowns**: Filter by genre (*Computer Science, Science & Math, Fiction, Non-Fiction, Sci-Fi, Self-Help, Exam Prep*) and availability status (*Available, Requested, Borrowed*).
- **Sort By**: Newest additions, Title (A-Z), Title (Z-A), or Author name.
- Color-coded status badges:
  - 🟢 **Available**
  - 🟠 **Requested**
  - 🔴 **Borrowed**
- Clear empty state message when no books match filters.

### 3. ➕ Add a Book (Sharing Form)
- Input fields for:
  - Book Title
  - Author Name
  - Genre / Category
  - Condition (*Good, Fair, Worn*)
  - Exchange Type (*Lend, Swap, Giveaway*)
  - Owner Name & Hostel Contact Information
- Full client-side validation with friendly inline error messages.
- Generates a unique ID using `Date.now()`.
- Automatically updates stats, catalog, and routes to "My Shelf".

### 4. 📖 My Shelf (Personal Collection)
- Displays all books listed by the current student.
- **Edit Details**: Modal popup allowing updates to book details, condition, and status.
- **Delete Book**: Confirmation popup with safety check before permanent deletion.
- **Mark as Returned**: One-click action for books currently on loan, instantly resetting them to "Available" for the next peer.

### 5. 📥 Borrow & Swap Requests
- Clicking **"Request to Borrow"** on any available book opens an interactive modal to submit your name, hostel room/phone, and an optional message.
- The book status updates to **Requested**.
- The book owner can review all requests in the **Requests** tab and click:
  - **Accept**: Changes book status to **Borrowed** and records the borrower.
  - **Decline**: Reverts book status back to **Available**.

### 6. 🌙 Dark Mode Support
- Clean toggle in the navigation bar to switch between Light and Dark themes.
- Theme preference is remembered in `localStorage` across visits.

### 7. 🔄 Reset Demo Data
- Pre-loads **10 diverse campus sample books** (Algorithms, Clean Code, Physics, Sapiens, etc.) on first launch.
- A "Reset Demo Data" button in the footer lets you restore the initial sample dataset at any time.

---

## 📁 File Structure

```text
community-library/
│
├── index.html       # Single-page application structure & modals
├── style.css        # Clean CSS with responsive layouts & dark mode themes
├── script.js        # Pure vanilla JavaScript logic & localStorage handler
└── README.md        # Project documentation
```

---

## 🚀 How to Run

1. **No installation, no npm, and no server required!**
2. Simply navigate to the project directory:
   ```bash
   cd "c:/Users/aggar/Downloads/community library"
   ```
3. Double-click `index.html` to open it in any web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
4. Alternatively, right-click `index.html` and choose **"Open with" &rarr; [Your Favorite Browser]**.

---

## 🔮 Future Improvements (Roadmap)
- **User Authentication & Profiles:** Implement campus email login (`@campus.edu`) and role-based permissions using Firebase or Supabase.
- **Backend & Database:** Connect to Node.js/Express with MongoDB or PostgreSQL for multi-user synchronization across different devices.
- **Real-Time Push Notifications:** In-app and WhatsApp/email alerts when someone requests or accepts a book loan.
- **Book Cover Uploads:** Allow users to upload or capture real book condition photos using cloud storage (Cloudinary / AWS S3).
- **QR Code Borrowing:** Generate unique QR codes pasted inside book covers that can be scanned for instant checkout and return tracking.
- **Due Date Reminders:** Automated reminders before the 14-day borrowing period expires.
