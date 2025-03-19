export const navigationLinks = [
  {
    href: "/library",
    label: "Library",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/books",
    text: "All Books",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/book-requests",
    text: "Borrow Requests",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
  {
    img: "/icons/clock.svg",
    route: "/admin/engagement-dashboard",
    text: "Engagement",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
  universityCard: "Upload University ID Card",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  universityId: "number",
  password: "password",
};

export const sampleBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fantasy / Fiction",
    rating: 4.6,
    total_copies: 20,
    available_copies: 10,
    description:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death.",
    color: "#1c1f40",
    cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death. A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself between life and death.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help / Productivity",
    rating: 4.9,
    total_copies: 99,
    available_copies: 50,
    description:
      "A revolutionary guide to making good habits, breaking bad ones, and getting 1% better every day.",
    color: "#fffdf6",
    cover: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A revolutionary guide to making good habits, breaking bad ones, and getting 1% better every day.",
  },
  {
    id: 3,
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    genre: "Computer Science / JavaScript",
    rating: 4.7,
    total_copies: 9,
    available_copies: 5,
    description:
      "An essential guide to understanding the core mechanisms of JavaScript, focusing on scope and closures.",
    color: "#f8e036",
    cover:
      "https://m.media-amazon.com/images/I/7186YfjgHHL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "An essential guide to understanding the core mechanisms of JavaScript, focusing on scope and closures.",
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Philosophy / Adventure",
    rating: 4.5,
    total_copies: 78,
    available_copies: 50,
    description:
      "A magical tale of Santiago, an Andalusian shepherd boy, who embarks on a journey to find a worldly treasure.",
    color: "#ed6322",
    cover:
      "https://m.media-amazon.com/images/I/61HAE8zahLL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A magical tale of Santiago, an Andalusian shepherd boy, who embarks on a journey to find a worldly treasure.",
  },
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Self-Help / Productivity",
    rating: 4.7,
    total_copies: 23,
    available_copies: 23,
    description:
      "Rules for focused success in a distracted world, teaching how to cultivate deep focus to achieve peak productivity.",
    color: "#ffffff",
    cover: "https://m.media-amazon.com/images/I/81JJ7fyyKyS.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "Rules for focused success in a distracted world, teaching how to cultivate deep focus to achieve peak productivity.",
  },
  {
    id: 6,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Computer Science / Programming",
    rating: 4.8,
    total_copies: 56,
    available_copies: 56,
    description:
      "A handbook of agile software craftsmanship, offering best practices and principles for writing clean and maintainable code.",
    color: "#080c0d",
    cover:
      "https://m.media-amazon.com/images/I/71T7aD3EOTL._UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A handbook of agile software craftsmanship, offering best practices and principles for writing clean and maintainable code.",
  },
  {
    id: 7,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    genre: "Computer Science / Programming",
    rating: 4.8,
    total_copies: 25,
    available_copies: 3,
    description:
      "A timeless guide for developers to hone their skills and improve their programming practices.",
    color: "#100f15",
    cover:
      "https://m.media-amazon.com/images/I/71VStSjZmpL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "A timeless guide for developers to hone their skills and improve their programming practices.",
  },
  {
    id: 8,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance / Self-Help",
    rating: 4.8,
    total_copies: 10,
    available_copies: 5,
    description:
      "Morgan Housel explores the unique behaviors and mindsets that shape financial success and decision-making.",
    color: "#ffffff",
    cover:
      "https://m.media-amazon.com/images/I/81Dky+tD+pL._AC_UF1000,1000_QL80_.jpg",
    video: "/sample-video.mp4?updatedAt=1722593504152",
    summary:
      "Morgan Housel explores the unique behaviors and mindsets that shape financial success and decision-making.",
  },
];

export const accountRequestsDev = [
  {
    id: "1",
    name: "Marc Atenson",
    email: "marcine@gmail.com",
    initials: "MA",
    bgColor: "#dcf2ff",
  },
  {
    id: "2",
    name: "Susan Drake",
    email: "contact@susandrake.io",
    initials: "SD",
    bgColor: "#e1e1ff",
  },
  {
    id: "3",
    name: "Ronald Richards",
    email: "ronaldrichard@gmail.com",
    initials: "RR",
    bgColor: "#ffefd5",
  },
  {
    id: "4",
    name: "Jane Cooper",
    email: "janecooper@proton.me",
    initials: "JC",
    bgColor: "#f5f5f5",
  },
  {
    id: "5",
    name: "Ian Warren",
    email: "wadewarren@mail.to",
    initials: "IW",
    bgColor: "#e6ffe6",
  },
  {
    id: "6",
    name: "Darrell Steward",
    email: "darrellsteward@gmail.com",
    initials: "DS",
    bgColor: "#ffe6e6",
  },
];

export const accountRequestsDev2 = [
  {
    id: "1",
    fullName: "Darrell Steward",
    email: "darrellsteward@gmail.com",
    universityId: 90324423789,
    universityCard: "/path/to/id-card.jpg",
    dateJoined: "Dec 19 2023",
  },
  {
    id: "2",
    fullName: "Marc Atenson",
    email: "marcine@gmail.com",
    universityId: 45641243423,
    universityCard: "/path/to/id-card.jpg",
    dateJoined: "Dec 19 2023",
  },
  {
    id: "3",
    fullName: "Susan Drake",
    email: "contact@susandrake.io",
    universityId: 78316342289,
    universityCard: "/path/to/id-card.jpg",
    dateJoined: "Dec 19 2023",
  },
];

export const borrowRequestsDev = [
  {
    id: "1",
    title: "Inside Evil: Inside Evil Series, Book 1",
    coverUrl: "/books/covers/book1.jpg",
    coverColor: "#27364E",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    user: {
      name: "Darrell Stewards",
    },
    date: "12/01/24",
  },
  {
    id: "2",
    title: "Jayne Castle - People in Glass Houses",
    coverUrl: "/books/covers/book2.jpg",
    coverColor: "#67213B",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    user: {
      name: "Darrell Stewards",
    },
    date: "12/01/24",
  },
  {
    id: "3",
    title: "The Great Reclamation: A Novel",
    coverUrl: "/books/covers/book3.jpg",
    coverColor: "#27364E",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    user: {
      name: "Darrell Stewards",
    },
    date: "12/01/24",
  },
];

export const recentBooksDev = [
  {
    id: "1",
    title: "The Great Reclamation: A Novel by Rachel Heng",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    coverUrl: "/books/covers/book1.jpg",
    date: "12/01/24",
  },
  {
    id: "2",
    title: "Inside Evil: Inside Evil Series, Book 1",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    coverUrl: "/books/covers/book2.jpg",
    date: "12/01/24",
  },
  {
    id: "3",
    title: "Jayne Castle - People in Glass Houses",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    coverUrl: "/books/covers/book3.jpg",
    date: "12/01/24",
  },
  {
    id: "4",
    title: "The Great Reclamation: A Novel by Rachel Heng",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    coverUrl: "/books/covers/book1.jpg",
    date: "12/01/24",
  },
  {
    id: "5",
    title: "Inside Evil: Inside Evil Series, Book 1",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    coverUrl: "/books/covers/book2.jpg",
    date: "12/01/24",
  },
  {
    id: "6",
    title: "Jayne Castle - People in Glass Houses",
    author: "Rachel Heng",
    genre: "Strategic, Fantasy",
    coverUrl: "/books/covers/book3.jpg",
    date: "12/01/24",
  },
];

export const borrowRequestsDev2 = [
  {
    id: "1",
    bookId: "b1",
    bookTitle: "The Great Reclamation: A Memoir",
    bookCover: "/books/covers/book1.jpg",
    bookAuthor: "Sarah Johnson",
    bookGenre: "Memoir",
    userId: "u1",
    userName: "Darrell Steward",
    userEmail: "darrellsteward@gmail.com",
    borrowedDate: "Dec 19 2023",
    dueDate: "Dec 29 2023",
    returnDate: "Dec 31 2023",
    status: "Borrowed",
  },
  {
    id: "2",
    bookId: "b2",
    bookTitle: "Inside Evil: Inside Evil's Secret Story",
    bookCover: "/books/covers/book2.jpg",
    bookAuthor: "Michael Roberts",
    bookGenre: "True Crime",
    userId: "u2",
    userName: "Marc Atenson",
    userEmail: "marcine@gmail.com",
    borrowedDate: "Dec 21 2024",
    dueDate: "Jan 17 2024",
    returnDate: "Jan 12 2024",
    status: "Late Return",
  },
  {
    id: "3",
    bookId: "b3",
    bookTitle: "Jayne Castle - People Investigation",
    bookCover: "/books/covers/book3.jpg",
    bookAuthor: "Jayne Castle",
    bookGenre: "Mystery",
    userId: "u3",
    userName: "Susan Drake",
    userEmail: "contact@susandrake.io",
    borrowedDate: "Dec 31 2023",
    dueDate: "Jan 15 2023",
    returnDate: "Jan 25 2023",
    status: "Returned",
  },
  {
    id: "4",
    bookId: "b1",
    bookTitle: "The Great Reclamation: A Memoir",
    bookCover: "/books/covers/book1.jpg",
    bookAuthor: "Sarah Johnson",
    bookGenre: "Memoir",
    userId: "u4",
    userName: "David Smith",
    userEmail: "davidc@yahoo.com",
    borrowedDate: "Dec 19 2023",
    dueDate: "Dec 29 2023",
    returnDate: "Dec 31 2023",
    status: "Borrowed",
  },
];

export const statsDev = {
  borrowedBooks: { value: 145, change: 2 },
  totalUsers: { value: 317, change: 4 },
  totalBooks: { value: 163, change: 2 },
};
