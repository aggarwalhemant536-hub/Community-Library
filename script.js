/* ==========================================================================
   Community Library Exchange - Main Application Script
   Author: Rahul Verma (1st Year B.Tech CSE)
   Description:
     A single-page web app for sharing books in a hostel or campus society.
     Uses localStorage for data persistence and vanilla JavaScript for all UI.
   ========================================================================== */

// --- GLOBAL VARIABLES & STATE ---
// Current logged-in student (simulated user for My Shelf)
const CURRENT_USER = "Rahul Verma";
const CURRENT_USER_CONTACT = "Hostel 2, Room 108 | rahul.verma@campus.edu";

// In-memory data arrays
let bookList = [];
let requestList = [];

// Track currently active book for modal actions (delete or borrow)
let activeBookIdForAction = null;

// --- INITIAL SAMPLE DATA (8-10 Diverse Campus Books) ---
const INITIAL_SAMPLE_BOOKS = [
  {
    id: "book_101",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen",
    genre: "Computer Science",
    condition: "Good",
    ownerName: "Rohan Sharma",
    contactInfo: "Hostel 4, Room 210 | rohan.cse@campus.edu",
    exchangeType: "Lend",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-20"
  },
  {
    id: "book_102",
    title: "Clean Code: Agile Software Craftsmanship",
    author: "Robert C. Martin",
    genre: "Computer Science",
    condition: "Good",
    ownerName: "Rahul Verma",
    contactInfo: "Hostel 2, Room 108 | rahul.verma@campus.edu",
    exchangeType: "Lend",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-21"
  },
  {
    id: "book_103",
    title: "Concepts of Physics (Volume 1)",
    author: "H.C. Verma",
    genre: "Science & Math",
    condition: "Fair",
    ownerName: "Priya Sen",
    contactInfo: "Hostel 1, Room 302 | priya.ece@campus.edu",
    exchangeType: "Swap",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-15"
  },
  {
    id: "book_104",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    condition: "Good",
    ownerName: "Neha Gupta",
    contactInfo: "Day Scholar | nehagupta99@gmail.com",
    exchangeType: "Lend",
    status: "Borrowed",
    borrowerName: "Kunal Bansal",
    addedDate: "2026-10-10"
  },
  {
    id: "book_105",
    title: "Digital Design & Computer Architecture",
    author: "David Harris & Sarah Harris",
    genre: "Computer Science",
    condition: "Fair",
    ownerName: "Rahul Verma",
    contactInfo: "Hostel 2, Room 108 | rahul.verma@campus.edu",
    exchangeType: "Lend",
    status: "Requested",
    borrowerName: "Sneha Patel",
    addedDate: "2026-10-19"
  },
  {
    id: "book_106",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    genre: "Computer Science",
    condition: "Good",
    ownerName: "Vikram Patel",
    contactInfo: "Hostel 5, Room 412 | vikram.patel@campus.edu",
    exchangeType: "Swap",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-22"
  },
  {
    id: "book_107",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    condition: "Good",
    ownerName: "Ananya Roy",
    contactInfo: "Hostel 1, Room 114 | ananya.mech@campus.edu",
    exchangeType: "Giveaway",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-12"
  },
  {
    id: "book_108",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    condition: "Worn",
    ownerName: "Tanmay Joshi",
    contactInfo: "Hostel 3, Room 205 | tanmay.civil@campus.edu",
    exchangeType: "Lend",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-14"
  },
  {
    id: "book_109",
    title: "Higher Engineering Mathematics",
    author: "B.S. Grewal",
    genre: "Science & Math",
    condition: "Worn",
    ownerName: "Rahul Verma",
    contactInfo: "Hostel 2, Room 108 | rahul.verma@campus.edu",
    exchangeType: "Giveaway",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-16"
  },
  {
    id: "book_110",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    condition: "Fair",
    ownerName: "Simran Kaur",
    contactInfo: "Hostel 6, Room 311 | simran.kaur@campus.edu",
    exchangeType: "Lend",
    status: "Available",
    borrowerName: "",
    addedDate: "2026-10-08"
  }
];

// Initial sample request matching book_105 (owned by Rahul Verma)
const INITIAL_SAMPLE_REQUESTS = [
  {
    id: "req_201",
    bookId: "book_105",
    bookTitle: "Digital Design & Computer Architecture",
    ownerName: "Rahul Verma",
    requesterName: "Sneha Patel",
    requesterContact: "Hostel 1, Room 204 | 9876543210",
    message: "Hey Rahul! Need this for next week's Digital Electronics midterms. Can return right after the exam!",
    date: "2026-10-23",
    status: "Pending" // "Pending", "Accepted", "Declined"
  }
];

/* ==========================================================================
   INITIALIZATION FUNCTION (Runs when the HTML document is loaded)
   ========================================================================== */
window.addEventListener("DOMContentLoaded", function () {
  loadThemePreference();
  loadDataFromStorage();
  updateStats();
  renderHomeRecentBooks();
  renderBrowseBooks();
  renderMyShelf();
  renderRequests();
  updateNavBadges();
});

// --- LOCAL STORAGE HELPERS ---
// Function to load books and requests from browser storage
function loadDataFromStorage() {
  const storedBooks = localStorage.getItem("campus_library_books");
  const storedRequests = localStorage.getItem("campus_library_requests");

  if (storedBooks) {
    try {
      bookList = JSON.parse(storedBooks);
    } catch (e) {
      console.error("Error parsing stored books:", e);
      bookList = [...INITIAL_SAMPLE_BOOKS];
    }
  } else {
    // First time opening the app: preload sample books
    bookList = [...INITIAL_SAMPLE_BOOKS];
    saveBooksToStorage();
  }

  if (storedRequests) {
    try {
      requestList = JSON.parse(storedRequests);
    } catch (e) {
      console.error("Error parsing stored requests:", e);
      requestList = [...INITIAL_SAMPLE_REQUESTS];
    }
  } else {
    // First time opening the app: preload sample requests
    requestList = [...INITIAL_SAMPLE_REQUESTS];
    saveRequestsToStorage();
  }
}

// Function to save current book list to localStorage
function saveBooksToStorage() {
  localStorage.setItem("campus_library_books", JSON.stringify(bookList));
}

// Function to save current requests list to localStorage
function saveRequestsToStorage() {
  localStorage.setItem("campus_library_requests", JSON.stringify(requestList));
}

/* ==========================================================================
   SECTION NAVIGATION (Single Page Application Switcher)
   ========================================================================== */
function navigateTo(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".app-section");
  sections.forEach(function (sec) {
    sec.style.display = "none";
  });

  // Remove active class from all nav buttons
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (btn) {
    btn.classList.remove("active");
  });

  // Show target section and highlight active nav button
  const targetSection = document.getElementById(sectionName + "-section");
  const targetNav = document.getElementById("nav-" + sectionName);

  if (targetSection) {
    targetSection.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (targetNav) {
    targetNav.classList.add("active");
  }

  // Close mobile navigation menu if open
  const navMenu = document.getElementById("nav-menu");
  if (navMenu) {
    navMenu.classList.remove("open");
  }

  // Refresh relevant views when navigating
  if (sectionName === "home") {
    updateStats();
    renderHomeRecentBooks();
  } else if (sectionName === "browse") {
    renderBrowseBooks();
  } else if (sectionName === "shelf") {
    renderMyShelf();
  } else if (sectionName === "requests") {
    renderRequests();
  }

  updateNavBadges();
}

// Toggle mobile navigation menu dropdown
function toggleMobileMenu() {
  const navMenu = document.getElementById("nav-menu");
  if (navMenu) {
    navMenu.classList.toggle("open");
  }
}

// Update the badge counters in the navigation bar
function updateNavBadges() {
  const myShelfCount = bookList.filter(function (b) {
    return b.ownerName.toLowerCase().includes(CURRENT_USER.toLowerCase());
  }).length;

  const pendingRequestsCount = requestList.filter(function (r) {
    return r.status === "Pending" && r.ownerName.toLowerCase().includes(CURRENT_USER.toLowerCase());
  }).length;

  const shelfBadge = document.getElementById("my-shelf-count");
  if (shelfBadge) shelfBadge.textContent = myShelfCount;

  const reqBadge = document.getElementById("requests-count");
  if (reqBadge) reqBadge.textContent = pendingRequestsCount;
}

/* ==========================================================================
   HOME SECTION: STATS & RECENT BOOKS
   ========================================================================== */
function updateStats() {
  const total = bookList.length;
  const available = bookList.filter(function (b) { return b.status === "Available"; }).length;
  const borrowed = bookList.filter(function (b) { return b.status === "Borrowed"; }).length;
  const requested = bookList.filter(function (b) { return b.status === "Requested"; }).length;

  document.getElementById("stat-total-books").textContent = total;
  document.getElementById("stat-available-books").textContent = available;
  document.getElementById("stat-borrowed-books").textContent = borrowed;
  document.getElementById("stat-requested-books").textContent = requested;
}

function renderHomeRecentBooks() {
  const recentGrid = document.getElementById("recent-books-grid");
  if (!recentGrid) return;

  // Clone and sort by addedDate descending
  const sortedBooks = [...bookList].sort(function (a, b) {
    return new Date(b.addedDate) - new Date(a.addedDate);
  });

  // Take the 3 most recently added books
  const recent3 = sortedBooks.slice(0, 3);
  recentGrid.innerHTML = "";

  recent3.forEach(function (book) {
    const card = createBookCardElement(book, false);
    recentGrid.appendChild(card);
  });
}

/* ==========================================================================
   BROWSE SECTION: SEARCH, FILTER, SORT & RENDER
   ========================================================================== */
function handleSearchFilterChange() {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search-btn");

  if (clearBtn) {
    clearBtn.style.display = searchInput.value.trim().length > 0 ? "block" : "none";
  }

  renderBrowseBooks();
}

function clearSearch() {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search-btn");
  searchInput.value = "";
  if (clearBtn) clearBtn.style.display = "none";
  renderBrowseBooks();
}

function resetFilters() {
  document.getElementById("search-input").value = "";
  document.getElementById("filter-genre").value = "All";
  document.getElementById("filter-status").value = "All";
  document.getElementById("sort-by").value = "newest";
  const clearBtn = document.getElementById("clear-search-btn");
  if (clearBtn) clearBtn.style.display = "none";
  renderBrowseBooks();
}

function renderBrowseBooks() {
  const grid = document.getElementById("browse-books-grid");
  const emptyState = document.getElementById("browse-empty-state");
  const countBar = document.getElementById("browse-results-count");
  if (!grid) return;

  const searchQuery = document.getElementById("search-input").value.trim().toLowerCase();
  const selectedGenre = document.getElementById("filter-genre").value;
  const selectedStatus = document.getElementById("filter-status").value;
  const sortBy = document.getElementById("sort-by").value;

  // 1. Filter books
  let filtered = bookList.filter(function (book) {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.ownerName.toLowerCase().includes(searchQuery);

    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === "All" || book.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  // 2. Sort books
  filtered.sort(function (a, b) {
    if (sortBy === "newest") {
      return new Date(b.addedDate) - new Date(a.addedDate);
    } else if (sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    } else if (sortBy === "author") {
      return a.author.localeCompare(b.author);
    }
    return 0;
  });

  // 3. Render HTML
  grid.innerHTML = "";
  countBar.textContent = `Showing ${filtered.length} of ${bookList.length} books`;

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    grid.style.display = "none";
  } else {
    emptyState.style.display = "none";
    grid.style.display = "grid";

    filtered.forEach(function (book) {
      const card = createBookCardElement(book, false);
      grid.appendChild(card);
    });
  }
}

/* ==========================================================================
   MY SHELF SECTION: BOOKS LISTED BY CURRENT USER
   ========================================================================== */
function renderMyShelf() {
  const shelfGrid = document.getElementById("my-shelf-grid");
  const emptyState = document.getElementById("shelf-empty-state");
  if (!shelfGrid) return;

  const myBooks = bookList.filter(function (book) {
    return book.ownerName.toLowerCase().includes(CURRENT_USER.toLowerCase());
  });

  shelfGrid.innerHTML = "";

  if (myBooks.length === 0) {
    emptyState.style.display = "block";
    shelfGrid.style.display = "none";
  } else {
    emptyState.style.display = "none";
    shelfGrid.style.display = "grid";

    myBooks.forEach(function (book) {
      const card = createBookCardElement(book, true);
      shelfGrid.appendChild(card);
    });
  }
}

/* ==========================================================================
   REUSABLE BOOK CARD COMPONENT CREATOR
   isMyShelfCard: boolean (true adds Edit/Delete/Mark Returned buttons)
   ========================================================================== */
function createBookCardElement(book, isMyShelfCard) {
  const card = document.createElement("div");
  card.className = "book-card";

  // Badges based on status
  let statusBadgeClass = "badge-available";
  let statusText = "🟢 Available";
  if (book.status === "Requested") {
    statusBadgeClass = "badge-requested";
    statusText = "🟠 Requested";
  } else if (book.status === "Borrowed") {
    statusBadgeClass = "badge-borrowed";
    statusText = "🔴 Borrowed";
  }

  // Exchange Type Badge
  let exchangeBadgeClass = "badge-lend";
  if (book.exchangeType === "Swap") exchangeBadgeClass = "badge-swap";
  if (book.exchangeType === "Giveaway") exchangeBadgeClass = "badge-giveaway";

  // Card Content
  card.innerHTML = `
    <div class="card-top">
      <div class="card-badges">
        <span class="badge ${statusBadgeClass}">${statusText}</span>
        <span class="badge badge-genre">🏷️ ${escapeHtml(book.genre)}</span>
        <span class="badge ${exchangeBadgeClass}">🔄 ${escapeHtml(book.exchangeType)}</span>
        <span class="badge badge-condition">✨ ${escapeHtml(book.condition)}</span>
      </div>
      <h3 class="book-title">${escapeHtml(book.title)}</h3>
      <p class="book-author">by <strong>${escapeHtml(book.author)}</strong></p>
    </div>

    <div class="book-details">
      <div class="detail-line">
        <span>👤</span>
        <span>Owner: <strong>${escapeHtml(book.ownerName)}</strong></span>
      </div>
      <div class="detail-line">
        <span>📍</span>
        <span>Contact: ${escapeHtml(book.contactInfo)}</span>
      </div>
      ${book.borrowerName ? `
      <div class="detail-line">
        <span>🤝</span>
        <span>With: <strong>${escapeHtml(book.borrowerName)}</strong></span>
      </div>` : ""}
    </div>

    <div class="card-actions" id="actions-${book.id}">
      <!-- Buttons will be attached below -->
    </div>
  `;

  const actionsContainer = card.querySelector(`#actions-${book.id}`);

  if (isMyShelfCard) {
    // Buttons for "My Shelf" view
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-secondary btn-sm";
    editBtn.innerHTML = "✏️ Edit";
    editBtn.onclick = function () { openEditModal(book.id); };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.innerHTML = "🗑️ Delete";
    deleteBtn.onclick = function () { openDeleteModal(book.id); };

    actionsContainer.appendChild(editBtn);
    actionsContainer.appendChild(deleteBtn);

    // If currently borrowed or requested, show "Mark as Returned"
    if (book.status === "Borrowed" || book.status === "Requested") {
      const returnBtn = document.createElement("button");
      returnBtn.className = "btn btn-success btn-sm";
      returnBtn.innerHTML = "🔄 Mark as Returned";
      returnBtn.onclick = function () { markBookAsReturned(book.id); };
      actionsContainer.appendChild(returnBtn);
    }
  } else {
    // Buttons for "Browse" and "Home" view
    const isOwner = book.ownerName.toLowerCase().includes(CURRENT_USER.toLowerCase());

    if (isOwner) {
      const ownerTag = document.createElement("button");
      ownerTag.className = "btn btn-secondary btn-sm";
      ownerTag.innerHTML = "📖 Your Book (View Shelf)";
      ownerTag.onclick = function () { navigateTo("shelf"); };
      actionsContainer.appendChild(ownerTag);
    } else if (book.status === "Available") {
      const requestBtn = document.createElement("button");
      requestBtn.className = "btn btn-primary btn-sm";
      requestBtn.innerHTML = "🤝 Request to Borrow";
      requestBtn.onclick = function () { openBorrowModal(book.id); };
      actionsContainer.appendChild(requestBtn);
    } else if (book.status === "Requested") {
      const reqBtn = document.createElement("button");
      reqBtn.className = "btn btn-secondary btn-sm";
      reqBtn.disabled = true;
      reqBtn.innerHTML = "⏳ Borrow Request Pending";
      actionsContainer.appendChild(reqBtn);
    } else {
      const borrBtn = document.createElement("button");
      borrBtn.className = "btn btn-secondary btn-sm";
      borrBtn.disabled = true;
      borrBtn.innerHTML = "🚫 Currently Borrowed";
      actionsContainer.appendChild(borrBtn);
    }
  }

  return card;
}

/* ==========================================================================
   REQUESTS SECTION: VIEW & MANAGE BORROW REQUESTS
   ========================================================================== */
function renderRequests() {
  const container = document.getElementById("requests-list-container");
  const emptyState = document.getElementById("requests-empty-state");
  if (!container) return;

  container.innerHTML = "";

  if (requestList.length === 0) {
    emptyState.style.display = "block";
    container.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  container.style.display = "flex";

  // Show newest requests first
  const reversedRequests = [...requestList].reverse();

  reversedRequests.forEach(function (req) {
    const card = document.createElement("div");
    card.className = "request-card";

    let statusBadge = `<span class="badge badge-requested">Pending</span>`;
    if (req.status === "Accepted") {
      statusBadge = `<span class="badge badge-available">Accepted</span>`;
    } else if (req.status === "Declined") {
      statusBadge = `<span class="badge badge-borrowed">Declined</span>`;
    }

    card.innerHTML = `
      <div class="request-info">
        <div class="request-header">
          <span class="request-title">📖 ${escapeHtml(req.bookTitle)}</span>
          ${statusBadge}
        </div>
        <p class="request-meta">
          From: <strong>${escapeHtml(req.requesterName)}</strong> &bull; Contact: ${escapeHtml(req.requesterContact)}
        </p>
        <p class="request-meta">
          Date: ${escapeHtml(req.date)} &bull; Book Owner: <strong>${escapeHtml(req.ownerName)}</strong>
        </p>
        ${req.message ? `<div class="request-message-quote">"${escapeHtml(req.message)}"</div>` : ""}
      </div>
      <div class="request-actions" id="req-actions-${req.id}">
        <!-- Action buttons inserted below -->
      </div>
    `;

    const actionsDiv = card.querySelector(`#req-actions-${req.id}`);

    if (req.status === "Pending") {
      // Accept button
      const acceptBtn = document.createElement("button");
      acceptBtn.className = "btn btn-success btn-sm";
      acceptBtn.innerHTML = "✅ Accept";
      acceptBtn.onclick = function () { handleAcceptRequest(req.id); };

      // Decline button
      const declineBtn = document.createElement("button");
      declineBtn.className = "btn btn-secondary btn-sm";
      declineBtn.innerHTML = "❌ Decline";
      declineBtn.onclick = function () { handleDeclineRequest(req.id); };

      actionsDiv.appendChild(acceptBtn);
      actionsDiv.appendChild(declineBtn);
    } else if (req.status === "Accepted") {
      actionsDiv.innerHTML = `<span class="text-muted"><small>Handover coordinated</small></span>`;
    } else {
      actionsDiv.innerHTML = `<span class="text-muted"><small>Request closed</small></span>`;
    }

    container.appendChild(card);
  });
}

// Handler: Accept a request
function handleAcceptRequest(requestId) {
  const req = requestList.find(function (r) { return r.id === requestId; });
  if (!req) return;

  req.status = "Accepted";

  // Find corresponding book and update to Borrowed
  const book = bookList.find(function (b) { return b.id === req.bookId; });
  if (book) {
    book.status = "Borrowed";
    book.borrowerName = req.requesterName;
  }

  saveRequestsToStorage();
  saveBooksToStorage();
  updateStats();
  renderRequests();
  renderBrowseBooks();
  renderMyShelf();
  updateNavBadges();

  showToast(`Accepted request from ${req.requesterName}! Book marked as Borrowed.`, "success");
}

// Handler: Decline a request
function handleDeclineRequest(requestId) {
  const req = requestList.find(function (r) { return r.id === requestId; });
  if (!req) return;

  req.status = "Declined";

  // Find corresponding book and revert back to Available if it was Requested
  const book = bookList.find(function (b) { return b.id === req.bookId; });
  if (book && book.status === "Requested") {
    book.status = "Available";
    book.borrowerName = "";
  }

  saveRequestsToStorage();
  saveBooksToStorage();
  updateStats();
  renderRequests();
  renderBrowseBooks();
  renderMyShelf();
  updateNavBadges();

  showToast(`Request from ${req.requesterName} was declined. Book is Available.`, "info");
}

/* ==========================================================================
   ADD A BOOK SECTION: VALIDATION & FORM SUBMISSION
   ========================================================================== */
function handleBookSubmit(event) {
  event.preventDefault();

  // Clear existing errors
  clearErrors();

  // Gather values
  const title = document.getElementById("book-title").value.trim();
  const author = document.getElementById("book-author").value.trim();
  const genre = document.getElementById("book-genre").value;
  const condition = document.getElementById("book-condition").value;
  const exchangeType = document.getElementById("book-exchange-type").value;
  const ownerName = document.getElementById("book-owner-name").value.trim();
  const contactInfo = document.getElementById("book-contact").value.trim();

  let hasError = false;

  // Validation checks with friendly student-like messages
  if (!title) {
    showError("book-title", "err-title", "Please enter the book's title.");
    hasError = true;
  }

  if (!author) {
    showError("book-author", "err-author", "Please specify the author's name.");
    hasError = true;
  }

  if (!genre) {
    showError("book-genre", "err-genre", "Please select a genre / subject category.");
    hasError = true;
  }

  if (!condition) {
    showError("book-condition", "err-condition", "Please select the condition of your book.");
    hasError = true;
  }

  if (!exchangeType) {
    showError("book-exchange-type", "err-exchange", "Please choose an exchange type (Lend, Swap, or Giveaway).");
    hasError = true;
  }

  if (!ownerName) {
    showError("book-owner-name", "err-owner", "Please provide your name.");
    hasError = true;
  }

  if (!contactInfo) {
    showError("book-contact", "err-contact", "Please provide a contact method (Hostel room, phone, or email).");
    hasError = true;
  }

  if (hasError) return;

  // Create new book object with unique Date.now() timestamp ID
  const newBook = {
    id: "book_" + Date.now(),
    title: title,
    author: author,
    genre: genre,
    condition: condition,
    exchangeType: exchangeType,
    ownerName: ownerName,
    contactInfo: contactInfo,
    status: "Available",
    borrowerName: "",
    addedDate: new Date().toISOString().split("T")[0]
  };

  // Add to beginning of bookList
  bookList.unshift(newBook);
  saveBooksToStorage();

  // Reset form inputs (preserve user name and contact for convenience)
  document.getElementById("book-title").value = "";
  document.getElementById("book-author").value = "";
  document.getElementById("book-genre").value = "";
  document.getElementById("book-condition").value = "";
  document.getElementById("book-exchange-type").value = "";

  showToast(`🎉 "${newBook.title}" added to campus library!`, "success");

  // Update views
  updateStats();
  renderBrowseBooks();
  renderMyShelf();
  updateNavBadges();

  // Navigate to My Shelf to see the newly added book
  setTimeout(function () {
    navigateTo("shelf");
  }, 400);
}

function resetAddForm() {
  document.getElementById("add-book-form").reset();
  // Restore default student values
  document.getElementById("book-owner-name").value = CURRENT_USER;
  document.getElementById("book-contact").value = CURRENT_USER_CONTACT;
  clearErrors();
}

function showError(inputId, errorSpanId, message) {
  const input = document.getElementById(inputId);
  const span = document.getElementById(errorSpanId);
  if (input) input.classList.add("input-error");
  if (span) span.textContent = message;
}

function clearErrors() {
  const errorInputs = document.querySelectorAll(".input-error");
  errorInputs.forEach(function (el) {
    el.classList.remove("input-error");
  });

  const errorSpans = document.querySelectorAll(".error-msg");
  errorSpans.forEach(function (span) {
    span.textContent = "";
  });
}

/* ==========================================================================
   BORROW REQUEST MODAL
   ========================================================================== */
function openBorrowModal(bookId) {
  const book = bookList.find(function (b) { return b.id === bookId; });
  if (!book) return;

  activeBookIdForAction = bookId;

  // Populate preview inside modal
  const preview = document.getElementById("borrow-modal-preview");
  preview.innerHTML = `
    <strong>📖 ${escapeHtml(book.title)}</strong><br>
    <small>by ${escapeHtml(book.author)} &bull; Owner: <strong>${escapeHtml(book.ownerName)}</strong></small><br>
    <small class="text-muted">Hostel Contact: ${escapeHtml(book.contactInfo)}</small>
  `;

  // Default borrower info
  document.getElementById("borrower-name").value = "";
  document.getElementById("borrower-contact").value = "";
  document.getElementById("borrow-message").value = "";

  document.getElementById("borrow-modal").style.display = "flex";
}

function closeBorrowModal() {
  document.getElementById("borrow-modal").style.display = "none";
  activeBookIdForAction = null;
}

function handleBorrowSubmit(event) {
  event.preventDefault();

  const borrowerName = document.getElementById("borrower-name").value.trim();
  const borrowerContact = document.getElementById("borrower-contact").value.trim();
  const message = document.getElementById("borrow-message").value.trim();

  if (!borrowerName || !borrowerContact) {
    alert("Please fill in your name and contact info!");
    return;
  }

  const book = bookList.find(function (b) { return b.id === activeBookIdForAction; });
  if (!book) return;

  // 1. Update book status to "Requested"
  book.status = "Requested";
  book.borrowerName = borrowerName;
  saveBooksToStorage();

  // 2. Create new Request record
  const newRequest = {
    id: "req_" + Date.now(),
    bookId: book.id,
    bookTitle: book.title,
    ownerName: book.ownerName,
    requesterName: borrowerName,
    requesterContact: borrowerContact,
    message: message || "Hey! I would like to borrow your book.",
    date: new Date().toISOString().split("T")[0],
    status: "Pending"
  };

  requestList.push(newRequest);
  saveRequestsToStorage();

  closeBorrowModal();
  updateStats();
  renderBrowseBooks();
  renderHomeRecentBooks();
  renderRequests();
  updateNavBadges();

  showToast(`Borrow request sent to ${book.ownerName}! 🚀`, "success");
}

/* ==========================================================================
   EDIT BOOK MODAL
   ========================================================================== */
function openEditModal(bookId) {
  const book = bookList.find(function (b) { return b.id === bookId; });
  if (!book) return;

  document.getElementById("edit-book-id").value = book.id;
  document.getElementById("edit-title").value = book.title;
  document.getElementById("edit-author").value = book.author;
  document.getElementById("edit-genre").value = book.genre;
  document.getElementById("edit-condition").value = book.condition;
  document.getElementById("edit-exchange-type").value = book.exchangeType;
  document.getElementById("edit-status").value = book.status;
  document.getElementById("edit-contact").value = book.contactInfo;

  document.getElementById("edit-modal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
}

function handleEditSubmit(event) {
  event.preventDefault();

  const bookId = document.getElementById("edit-book-id").value;
  const book = bookList.find(function (b) { return b.id === bookId; });
  if (!book) return;

  book.title = document.getElementById("edit-title").value.trim();
  book.author = document.getElementById("edit-author").value.trim();
  book.genre = document.getElementById("edit-genre").value;
  book.condition = document.getElementById("edit-condition").value;
  book.exchangeType = document.getElementById("edit-exchange-type").value;
  book.status = document.getElementById("edit-status").value;
  book.contactInfo = document.getElementById("edit-contact").value.trim();

  // If status reverted to Available, clear borrower
  if (book.status === "Available") {
    book.borrowerName = "";
  }

  saveBooksToStorage();
  closeEditModal();
  updateStats();
  renderBrowseBooks();
  renderMyShelf();
  renderHomeRecentBooks();
  updateNavBadges();

  showToast("Book details updated successfully! ✅", "success");
}

/* ==========================================================================
   DELETE BOOK MODAL & HANDLERS
   ========================================================================== */
function openDeleteModal(bookId) {
  const book = bookList.find(function (b) { return b.id === bookId; });
  if (!book) return;

  activeBookIdForAction = bookId;
  document.getElementById("delete-book-title").textContent = `"${book.title}"`;

  const confirmBtn = document.getElementById("confirm-delete-btn");
  confirmBtn.onclick = function () {
    confirmDeleteBook();
  };

  document.getElementById("delete-modal").style.display = "flex";
}

function closeDeleteModal() {
  document.getElementById("delete-modal").style.display = "none";
  activeBookIdForAction = null;
}

function confirmDeleteBook() {
  if (!activeBookIdForAction) return;

  const bookToDelete = bookList.find(function (b) { return b.id === activeBookIdForAction; });
  const title = bookToDelete ? bookToDelete.title : "Book";

  // Remove from bookList
  bookList = bookList.filter(function (b) { return b.id !== activeBookIdForAction; });
  saveBooksToStorage();

  // Close modal
  closeDeleteModal();

  // Refresh views
  updateStats();
  renderBrowseBooks();
  renderMyShelf();
  renderHomeRecentBooks();
  updateNavBadges();

  showToast(`"${title}" was removed from your shelf.`, "info");
}

/* ==========================================================================
   MARK AS RETURNED HANDLER
   ========================================================================== */
function markBookAsReturned(bookId) {
  const book = bookList.find(function (b) { return b.id === bookId; });
  if (!book) return;

  book.status = "Available";
  book.borrowerName = "";
  saveBooksToStorage();

  // Also close active requests for this book
  requestList.forEach(function (r) {
    if (r.bookId === bookId && (r.status === "Pending" || r.status === "Accepted")) {
      r.status = "Completed";
    }
  });
  saveRequestsToStorage();

  updateStats();
  renderMyShelf();
  renderBrowseBooks();
  renderHomeRecentBooks();
  renderRequests();
  updateNavBadges();

  showToast(`"${book.title}" is now marked as returned and Available!`, "success");
}

/* ==========================================================================
   DARK MODE TOGGLE & PERSISTENCE
   ========================================================================== */
function loadThemePreference() {
  const savedTheme = localStorage.getItem("campus_library_theme") || "light";
  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    updateThemeButtonUI(true);
  } else {
    document.body.removeAttribute("data-theme");
    updateThemeButtonUI(false);
  }
}

function toggleDarkMode() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("campus_library_theme", "light");
    updateThemeButtonUI(false);
    showToast("Switched to Light Mode ☀️", "info");
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("campus_library_theme", "dark");
    updateThemeButtonUI(true);
    showToast("Switched to Dark Mode 🌙", "info");
  }
}

function updateThemeButtonUI(isDark) {
  const icon = document.getElementById("theme-icon");
  const text = document.getElementById("theme-text");
  if (isDark) {
    if (icon) icon.textContent = "☀️";
    if (text) text.textContent = "Light";
  } else {
    if (icon) icon.textContent = "🌙";
    if (text) text.textContent = "Dark";
  }
}

/* ==========================================================================
   RESET DEMO DATA HANDLER
   ========================================================================== */
function confirmResetDemoData() {
  const confirmAction = confirm(
    "Reset all data to the initial 10 sample books and sample requests? This will clear any new books you added."
  );

  if (confirmAction) {
    bookList = [...INITIAL_SAMPLE_BOOKS];
    requestList = [...INITIAL_SAMPLE_REQUESTS];
    saveBooksToStorage();
    saveRequestsToStorage();

    updateStats();
    renderHomeRecentBooks();
    renderBrowseBooks();
    renderMyShelf();
    renderRequests();
    updateNavBadges();

    showToast("Demo data has been reset to default campus books! 📚", "info");
  }
}

/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  // Auto-dismiss after 3.2 seconds
  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/* ==========================================================================
   SECURITY / UTILITY: Escape HTML to prevent injection
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
