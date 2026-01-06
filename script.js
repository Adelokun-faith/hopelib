const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});



  document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();

    // Open books menu and filter results (empty query will show all books)
    const booksList = document.getElementById('booksList');
    const booksToggle = document.getElementById('booksToggle');
    if (booksList && booksToggle) {
      booksList.hidden = false;
      booksToggle.setAttribute('aria-expanded', 'true');
      filterBooks(query);
        // find visible matches
        const visibles = booksList.querySelectorAll('.book-item:not([hidden]) a');
        if (visibles.length === 0) {
          alert('No books found');
          return;
        }
        // if exactly one match, open it directly
        if (visibles.length === 1) {
          visibles[0].click();
          return;
        }
        // otherwise focus the first matched item
        const first = visibles[0];
        if (first) first.focus();
    }
  });

// --- Searchable books dropdown ---
const books = [
  'Rich Dad Poor Dad'
];

// Minimal data for the single book
const booksData = {
  'Rich Dad Poor Dad': {desc: 'Rich Dad Poor Dad by Robert Kiyosaki teaches the difference between how the rich and the poor think about money. The book contrasts the financial mindset of the author’s educated but financially struggling “Poor Dad” with his friend’s wealthy, business-minded “Rich Dad"'},
  'Leaders Eat Last': {desc: 'Leaders Eat Last by Simon Sinek explains that great leadership is about serving and protecting people, not exercising authority. The book shows that when leaders put their teams first, they create trust, loyalty, and a safe work environment where people can perform at their best.'},
  'This Is Your Brain On Food': {desc: 'This Is Your Brain on Food by Dr. Uma Naidoo explains how what you eat directly affects your brain and mental health. The book shows the strong connection between nutrition and conditions like anxiety, depression, focus, and memory.'},
  'Meditations': {desc: 'Meditations by Marcus Aurelius is a collection of personal reflections on Stoic philosophy, focusing on self-discipline, resilience, and inner peace. The book teaches the importance of controlling your thoughts, accepting what you cannot change, and living with virtue and purpose.'},
  'Getting Things Done': {desc: 'Getting Things Done by David Allen presents a practical system for organizing tasks and reducing stress. The core idea is to get everything out of your mind and into a trusted system so you can focus clearly on what matters.'}
};

// Add descriptions for categories / other items
const categoryData = {
  'Leadership': {desc: 'Books about leadership, influence, and management.'},
  'Health': {desc: 'Books focused on physical and mental wellbeing.'},
  'Spirituality': {desc: 'Books exploring faith, meaning, and spiritual growth.'},
  'Time Management': {desc: 'Books with strategies to manage time and productivity.'}
};

// Books organized by category (populate category dropdowns)
const categoryBooks = {
  'Leadership': [ 'Leaders Eat Last' ],
  'Health': [ 'This Is Your Brain On Food' ],
  'Spirituality': [ 'Meditations' ],
  'Time Management': [ 'Getting Things Done' ]
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
  // If a PDF exists for this book, expose link in the modal
  const modalPdf = document.getElementById('modalPdf');
  if (modalPdf) {
    // use a URL-safe filename for the PDF
    const pdfFile = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '.pdf';
    const pdfPath = `books/${pdfFile}`;
    modalPdf.href = encodeURI(pdfPath);
    modalPdf.hidden = false;
  }
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
  // Category links open the modal with category info
  // Populate and wire category dropdowns
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    const cat = item.dataset.category;
    const toggle = item.querySelector('.category-toggle');
    const list = item.querySelector('.category-books');
    // populate list from categoryBooks
    if (list && categoryBooks[cat]) {
      categoryBooks[cat].forEach(title => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = title;
        a.addEventListener('click', (ev) => { ev.preventDefault(); showBook(title); });
        li.appendChild(a);
        list.appendChild(li);
      });
    }
    // toggle behavior
    if (toggle && list) {
      toggle.addEventListener('click', () => {
        const nowHidden = list.hidden;
        // close other open category lists
        document.querySelectorAll('.category-books').forEach(l => { if (l !== list) l.hidden = true; });
        list.hidden = !nowHidden;
      });
    }
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

  // Compact search behaviour for very small screens
  const searchContainer = document.querySelector('.search-container');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = searchContainer ? searchContainer.querySelector('button') : null;

  function updateCompact() {
    if (!searchContainer) return;
    if (window.innerWidth <= 360) {
      searchContainer.classList.add('compact');
    } else {
      searchContainer.classList.remove('compact');
      searchContainer.classList.remove('expanded');
    }
  }

  updateCompact();
  window.addEventListener('resize', updateCompact);

  if (searchBtn && searchInput && searchContainer) {
    searchBtn.addEventListener('click', (e) => {
      if (searchContainer.classList.contains('compact') && !searchContainer.classList.contains('expanded')) {
        e.preventDefault();
        searchContainer.classList.add('expanded');
        setTimeout(() => searchInput.focus(), 60);
      }
      // otherwise let the form submit handler run
    });

    searchInput.addEventListener('blur', () => {
      if (searchContainer.classList.contains('compact') && searchInput.value.trim() === '') {
        searchContainer.classList.remove('expanded');
      }
    });
  }
});

