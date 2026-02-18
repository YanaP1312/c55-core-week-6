import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

const dataDir = 'reading-list-manager';
const filePath = path.join(dataDir, 'books.json');
const defaultArray = [];

function isDataFull(book) {
  const isDataFull = book.id && book.title && book.author && book.genre;
  return isDataFull;
}

// Place here the file operation functions for loading and saving books

export function loadBooks() {
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

export function saveBooks(books) {
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
//       read: true,
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

export function addBook(book) {
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
//     read: true,
//   })
// );

export function getUnreadBooks() {
  const books = loadBooks();
  const unreadBooks = books.filter((book) => !book.read);
  return unreadBooks;
}

// console.log('Get unread books:', getUnreadBooks());

export function getBooksByGenre(genre) {
  const books = loadBooks();
  const booksByGenre = books.filter((book) => book.genre === genre);
  return booksByGenre;
}

export function markAsRead(id) {
  const books = loadBooks();
  const updateForRead = books.map((book) => {
    if (book.id === id) {
      return { ...book, read: true };
    }
    return book;
  });
  return updateForRead;
}

export function getTotalBooks() {
  const books = loadBooks();
  return books.length;
}

// console.log('Total books:', getTotalBooks());

export function hasUnreadBooks() {
  const books = loadBooks();
  const hasUnreadBooks = books.some((book) => !book.read);
  return hasUnreadBooks;
}

// console.log('Has unread books?', hasUnreadBooks());

export function printAllBooks() {
  const books = loadBooks();
  let output = '\n📚 MY READING LIST 📚 \n\nAll books:\n\n';

  for (const book of books) {
    const { id, title, author, genre, read } = book;
    const readChalk = read ? chalk.green('📗 Read') : chalk.yellow('📕 Unread');
    const titleChalk = chalk.cyan(title);

    output += `${id + 1}. ${titleChalk} by ${author} (${genre}) ${readChalk}\n`;
  }

  return output;
}

export function printSummary() {
  const totalBooks = getTotalBooks();
  const unreadBooks = getUnreadBooks().length;
  const readBooks = totalBooks - unreadBooks;

  const output = `\n📊 SUMMARY 📊\n\n${chalk.bold(`Total Books: ${totalBooks}\nRead: ${readBooks}\nUnread: ${unreadBooks}`)}`;

  return output;
}
