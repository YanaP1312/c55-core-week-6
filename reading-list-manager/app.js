// This is the entrypoint for your application.
// node app.js

import {
  getBooksByGenre,
  loadBooks,
  markAsRead,
  printAllBooks,
  printSummary,
} from './readingList.js';

// TODO: Implement the main application logic here
// 1. Load books on startup
// 2. Display all books
// 3. Show summary statistics
// 4. Add example of filtering by genre or read/unread status
// 5. Add example of marking a book as read

// console.log('📚 MY READING LIST 📚\n');

// Your implementation here
console.log(loadBooks());
console.log(printAllBooks());
console.log(printSummary());
console.log('Get books by novel genre:', getBooksByGenre('Novel'));
console.log('After read update:', markAsRead(1));
