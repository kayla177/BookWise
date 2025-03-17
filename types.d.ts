interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
  isLoanedBook?: boolean;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}

interface BorrowBook {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date | null;
  status: "BORROWED" | "RETURNED";
  createdAt: Date;

  // Join book details for display
  book: Book;
}

interface BorrowRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookAuthor: string;
  bookGenre: string;
  userId: string;
  userName: string;
  userEmail: string;
  borrowedDate: string;
  dueDate: string;
  returnDate: string;
  status: "Borrowed" | "Returned" | "Late Return";
}

// for print receipt and book-request
interface ReceiptData {
  receiptId: string;
  borrowInfo: {
    borrowDate: string;
    dueDate: string;
    returnDate?: string | null;
    duration: number;
  };
  book: {
    title: string;
    author: string;
    genre: string;
  };
  issuedAt: string;
}
