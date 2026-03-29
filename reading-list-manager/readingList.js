import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

const dataDir = 'reading-list-manager';
const filePath = path.join(dataDir, 'books.json');

// Place here the file operation functions for loading and saving books

export function loadBooks() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }

    const raw = fs.readFileSync(filePath, 'utf-8');

    if (!raw.trim()) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }

    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error('Books file contains invalid content');
    }

    return data;
  } catch (error) {
    console.error('Error reading books.json:', error.message);
    return [];
  }
}

export function saveBooks(books) {
  try {
    if (!Array.isArray(books)) {
      throw new Error('Books file contains invalid content');
    }

    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
    return 'Books saved';
  } catch (error) {
    return `Cannot write: ${error.message}`;
  }
}

export function addBook(book) {
  try {
    const books = loadBooks();

    const newId =
      books.length > 0 ? Math.max(...books.map((book) => book.id || 0)) + 1 : 1;
    const newBook = { id: newId, ...book };

    books.push(newBook);
    saveBooks(books);
    return 'Book successfully added';
  } catch (error) {
    return `Cannot append: ${error.message}`;
  }
}

export function getUnreadBooks() {
  return loadBooks().filter((book) => !book.read);
}

export function getBooksByGenre(genre) {
  return loadBooks().filter((book) => book.genre === genre);
}

export function markAsRead(id) {
  const updateForRead = loadBooks().map((book) =>
    book.id === id ? { ...book, read: true } : book
  );
  saveBooks(updateForRead);

  return updateForRead;
}

export function getTotalBooks() {
  return loadBooks().length;
}

export function hasUnreadBooks() {
  return loadBooks().some((book) => !book.read);
}

export function printAllBooks() {
  const books = loadBooks();
  let output = '\n📚 MY READING LIST 📚 \n\nAll books:\n\n';

  for (const book of books) {
    const { id, title, author, genre, read } = book;
    const readChalk = read ? chalk.green('📗 Read') : chalk.yellow('📕 Unread');
    const titleChalk = chalk.cyan(title);

    output += `${id}. ${titleChalk} by ${author} (${genre}) ${readChalk}\n`;
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
