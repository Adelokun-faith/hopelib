const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});



  document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();

    if (query === "") {
      alert("Please enter a search term");
      return;
    }
    // Open books menu and filter results
    const booksList = document.getElementById('booksList');
    const booksToggle = document.getElementById('booksToggle');
    if (booksList && booksToggle) {
      booksList.hidden = false;
      booksToggle.setAttribute('aria-expanded', 'true');
      filterBooks(query);
      // focus first matched item if present
      const first = booksList.querySelector('.book-item:not([hidden]) a');
      if (first) first.focus();
    }
  });

// --- Searchable books dropdown ---
const books = [
  'The Alchemist',
  'To Kill a Mockingbird',
  '1984',
  'Pride and Prejudice',
  'Moby Dick',
  'The Hobbit',
  'The Great Gatsby',
  'Brave New World',
  'Siddhartha',
  'The Catcher in the Rye',
  'Rich Dad Poor Dad'
];

// Optional detailed data for books (title used as key)
const booksData = {
  'The Alchemist': {desc: 'A fable about following your dream.'},
  'To Kill a Mockingbird': {desc: 'A novel about racial injustice in the Deep South.'},
  '1984': {desc: 'Dystopian novel about surveillance and totalitarianism.'},
  'Pride and Prejudice': {desc: 'A classic romance and social commentary.'},
  'Moby Dick': {desc: 'The epic tale of obsession and the sea.'},
  'The Hobbit': {desc: 'A fantasy adventure preceding The Lord of the Rings.'},
  'The Great Gatsby': {desc: 'A story of wealth, love, and the American Dream.'},
  'Brave New World': {desc: 'A dystopia exploring technology and control.'},
  'Siddhartha': {desc: 'A spiritual journey during the time of the Buddha.'},
  'The Catcher in the Rye': {desc: 'A teenaged narrator navigating alienation.'},
  'Rich Dad Poor Dad': {desc: 'Personal finance lessons contrasting two approaches to money.'}
};

function populateBooks() {
  const list = document.getElementById('booksList');
  if (!list) return;
  list.innerHTML = '';
  books.forEach(title => {
    const li = document.createElement('li');
    li.className = 'book-item';
    li.setAttribute('data-title', title.toLowerCase());
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = title;
    a.tabIndex = 0;
    // clicking a book opens it in the modal
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      showBook(title);
    });
    li.appendChild(a);
    list.appendChild(li);
  });
}

function showBook(title) {
  const modal = document.getElementById('bookModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCover = document.getElementById('modalCover');
  if (!modal || !modalTitle) return;
  modalTitle.textContent = title;
  const info = booksData[title] || {desc: 'No description available.'};
  modalDesc.textContent = info.desc;
  // Optionally set a cover if we had one; keeping default for now
  modal.hidden = false;
}

function hideBookModal() {
  const modal = document.getElementById('bookModal');
  if (modal) modal.hidden = true;
}

function filterBooks(query) {
  const q = String(query || '').toLowerCase();
  const list = document.getElementById('booksList');
  if (!list) return;
  const items = list.querySelectorAll('.book-item');
  items.forEach(item => {
    const title = item.getAttribute('data-title') || '';
    if (q === '' || title.includes(q)) {
      item.hidden = false;
    } else {
      item.hidden = true;
    }
  });
}

// Wire up search input realtime filtering and books toggle
document.addEventListener('DOMContentLoaded', () => {
  populateBooks();
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', (e) => filterBooks(e.target.value));
  }
  const booksToggle = document.getElementById('booksToggle');
  const booksList = document.getElementById('booksList');
  if (booksToggle && booksList) {
    booksToggle.addEventListener('click', () => {
      const isHidden = booksList.hidden;
      booksList.hidden = !isHidden;
      booksToggle.setAttribute('aria-expanded', String(!isHidden));
    });
  }
  // modal controls
  const modal = document.getElementById('bookModal');
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', hideBookModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideBookModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideBookModal();
  });
  // Close sidebar when clicking the main container
  const containerDiv = document.querySelector('.container');
  if (containerDiv) {
    containerDiv.addEventListener('click', () => {
      const sidebarEl = document.getElementById('sidebar');
      if (sidebarEl && sidebarEl.classList.contains('active')) {
        sidebarEl.classList.remove('active');
      }
    });
  }
});

