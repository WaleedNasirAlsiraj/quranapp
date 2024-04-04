const handleBookmarks = (surahNumber, ayahNumber) => {
    // Get bookmarks from localStorage
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  
    // Check if the bookmark exists
    const index = bookmarks.findIndex(bookmark => bookmark.surah === surahNumber && bookmark.ayah === ayahNumber);
  
    if (index !== -1) {
      // Bookmark exists, remove it
      bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      return false
    } else {
      // Bookmark doesn't exist, add it
      bookmarks.push({ surah: surahNumber, ayah: ayahNumber });
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      return true
    }
  
    
  };
  
  export { handleBookmarks };
  