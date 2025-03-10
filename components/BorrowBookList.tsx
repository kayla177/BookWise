// import React from "react";
// import BorrowBookCard from "@/components/BorrowBookCard";
//
// interface Props {
//   // "BorrowBook" are defined in types.d.ts
//   books: BorrowBook[];
// }
//
// const BorrowBookList = ({ books }: Props) => {
//   return (
//     <>
//       <h1 className="font-semibold text-light-100 text-3xl">Borrowed books</h1>
//       <section>
//         <ul className="book-list">
//           {books.map((book) => {
//             // Check if book is a BorrowBook (has a book field)
//             return <BorrowBookCard key={book.id} {...book} />;
//           })}
//         </ul>
//       </section>
//     </>
//   );
// };
// export default BorrowBookList;

import React from "react";
import BorrowBookCard from "@/components/BorrowBookCard";

interface Props {
  books: BorrowBook[];
}

const BorrowBookList = ({ books }: Props) => {
  return (
    <div>
      <h1 className="font-semibold text-light-100 text-3xl mb-5">
        Borrowed books
      </h1>
      <section>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BorrowBookCard key={book.id} {...book} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default BorrowBookList;
