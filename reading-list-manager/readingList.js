import fs from 'node:fs';
import path from 'node:path';

const dataDir = 'reading-list-manager';
const filePath = path.join(dataDir, 'books.json');
const defaultArray = [];

function isDataFull(book) {
  const isDataFull = book.id && book.title && book.author && book.genre;
  return isDataFull;
}

// Place here the file operation functions for loading and saving books

function loadBooks() {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!Array.isArray(data)) {
      throw new Error("Books file doesn't contain an array");
    }

    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Books file not found');
      fs.writeFileSync(filePath, JSON.stringify(defaultArray, null, 2));
      return defaultArray;
    } else if (error.name === 'SyntaxError') {
      console.log('Invalid JSON. Resetting...');
      fs.writeFileSync(filePath, JSON.stringify(defaultArray, null, 2));
      return defaultArray;
    } else {
      return `Unexpected error: ${error.message}`;
    }
  }
}

// console.log(loadBooks());

function saveBooks(books) {
  try {
    if (!Array.isArray(books)) {
      throw new Error("Books file doesn't contain an array");
    }

    if (!books.every((book) => isDataFull(book))) {
      throw new Error('Book must has id, title, author and genre');
    }

    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
    return 'Books saved';
  } catch (error) {
    return `Cannot write: ${error.message}`;
  }
}

// console.log(
//   saveBooks([
//     {
//       id: 1,
//       title: 'Kobzar',
//       author: 'Taras Shevchenko',
//       genre: 'Poetry',
//       read: false,
//     },
//     {
//       id: 2,
//       title: 'Forest Song',
//       author: 'Lesya Ukrainka',
//       genre: 'Drama',
//       read: false,
//     },
//     {
//       id: 3,
//       title: 'The Enchanted Desna',
//       author: 'Oleksandr Dovzhenko',
//       genre: 'Memoir',
//       read: false,
//     },
//     {
//       id: 4,
//       title: 'The City',
//       author: 'Valerian Pidmohylny',
//       genre: 'Novel',
//       read: false,
//     },
//     {
//       id: 5,
//       title: 'Marusia Churai',
//       author: 'Lina Kostenko',
//       genre: 'Historical Novel',
//       read: false,
//     },
//   ])
// );

function addBook(book) {
  try {
    if (!isDataFull(book)) {
      throw new Error('Book must has id, title, author and genre');
    }
    const books = loadBooks();

    if (books.some((item) => item.id === book.id)) {
      throw new Error(`Book with ${book.id} already exists`);
    }

    books.push(book);
    saveBooks(books);
    return 'Book successfully added';
  } catch (error) {
    return `Cannot append: ${error.message}`;
  }
}

// console.log(
//   addBook({
//     id: 6,
//     title: 'Death and the Penguin',
//     author: 'Andrey Kurkov',
//     genre: 'Novel',
//     read: false,
//   })
// );

function getUnreadBooks() {
  // TODO: Implement this function using filter()
}

function getBooksByGenre(genre) {
  // TODO: Implement this function using filter()
}

function markAsRead(id) {
  // TODO: Implement this function using map()
}

function getTotalBooks() {
  // TODO: Implement this function using length
}

function hasUnreadBooks() {
  // TODO: Implement this function using some()
}

function printAllBooks() {
  // TODO: Implement this function
  // Loop through and display with chalk
  // Use green for read books, yellow for unread
  // Use cyan for titles
}

function printSummary() {
  // TODO: Implement this function
  // Show statistics with chalk
  // Display total books, read count, unread count
  // Use bold for stats
}
