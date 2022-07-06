const modal = document.querySelector("#modal");
const modalShow = document.querySelector("#show-modal");
const modalClose = document.querySelector("#close-modal");
const bookmarkForm = document.querySelector("#bookmark-form");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const bookmarksContainer = document.querySelector("#bookmarks-container");

let bookmarks = {};

// Show Modal (focus on Input), Close Modal

function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

function closeModal() {
  modal.classList.remove("show-modal");
}

// Modal Event Listeners 

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("click", (e) => (e.target === modal ? closeModal() : false));

// Build Bookmarks DOM

function buildBookmarks() {
  bookmarksContainer.textContent = '';
  // build items
  for (let bm in bookmarks) {
    const {name, url} = bookmarks[bm];
    // Item DIV
    const item = document.createElement('div');
    item.classList.add('item');
    // Close IMG
    const closeIcon = document.createElement('img');
    closeIcon.classList.add('trash');
    closeIcon.setAttribute('src', 'icons/trash.png');
    closeIcon.setAttribute('alt', 'DEL');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // Favicon / Link Container DIV
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;
    // Append to Bookmarks Container
    linkInfo.append(favicon, link, closeIcon);
    item.append(linkInfo);
    bookmarksContainer.appendChild(item);
  };
}
// Fetch Bookmarks

function fetchBookmarks() {
  // Get Bookmarks if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // create Bookmarks Array
    bookmarks = {
     'https://duckduckgo.com': {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com'
      }
    };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Delete Bookmarks

function deleteBookmark(url) {
  if (bookmarks[url]) {
    delete bookmarks[url];
  }
  // Update Bookmarks Array in Local Storage and Re Populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Handle Data from Form

function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (urlValue) {
    if (!urlValue.includes("http://") && !urlValue.includes("https://")) {
      urlValue = `https://${urlValue}`;
    }
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {  
    name: nameValue,
    url: urlValue
  }
  bookmarks[urlValue] = bookmark;
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();

}

function validate(nameValue, urlValue) {
  const urlExp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  let re = new RegExp(urlExp);

  if (!nameValue || !urlValue) {
    alert("Bitte fülle beide Felder aus!")
    return false;
  }

  if (!urlValue.match(re)) {
    alert("Bitte gib eine gültige Web-Adresse an!");
    return false;
  } 
  return true;
}; 


// Event Listener 

bookmarkForm.addEventListener("submit", storeBookmark);

// On Load, fetch Bookmarks

fetchBookmarks();
