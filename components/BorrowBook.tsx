"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface BorrowBookProps {
  userId: string;
  bookId: string;
}

const BorrowBook = ({ userId, bookId }: BorrowBookProps) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    setBorrowing(true);

    try {
      // await for server action
      const result = await borrowBook({ bookId, userId });

      if (result.success) {
        toast.success("Success", {
          description: "Book borrowed successfully",
        });

        router.push("/my-profile");
      } else {
        toast.error("Error", {
          description: result.error || "An unexpected error occurred",
        });
      }
    } catch (error) {
      console.error("Borrowing failed: ", error);
      toast.error("Error", {
        description: "An unexpected error occurred while borrowing the book",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button
      className="book-overview_btn"
      onClick={handleBorrow}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing..." : "Borrow Book"}
      </p>
    </Button>
  );
};

export default BorrowBook;

// "use client";

//  !!! eligibility check version, not enable it for now.

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { borrowBook } from "@/lib/actions/book";
//
// interface BorrowBookProps {
//   userId: string;
//   bookId: string;
//   borrowingEligibility: {
//     isEligible: boolean;
//     message: string;
//   };
// }
//
// const BorrowBook = ({
//   userId,
//   bookId,
//   borrowingEligibility: { isEligible, message },
// }: BorrowBookProps) => {
//   const router = useRouter();
//   const [borrowing, setBorrowing] = useState(false);
//
//   const handleBorrow = async () => {
//     if (!isEligible) {
//       toast.error("Error", {
//         description: message,
//       });
//       return;
//     }
//
//     setBorrowing(true);
//
//     try {
//       // await for server action
//       const result = await borrowBook({ bookId, userId });
//       // console.log("[BORROWBOOK] Borrow API Response:", result);
//
//       if (result.success) {
//         toast.success("Success", {
//           description: "Book borrowed successfully",
//         });
//
//         router.push("/my-profile");
//       } else {
//         toast.error("Error", {
//           description: result.error,
//         });
//       }
//     } catch (error) {
//       console.error("Borrowing failed: ", error);
//       toast.error("Error", {
//         description: "An unexpected error occurred while borrowing the book",
//       });
//     } finally {
//       setBorrowing(false);
//     }
//   };
//
//   return (
//     //   if we are currently borrowing, the button will be disabled
//     <Button
//       className="book-overview_btn"
//       onClick={handleBorrow}
//       disabled={borrowing}
//     >
//       <Image src="/icons/book.svg" alt="book" width={20} height={20} />
//       <p className="font-bebas-neue text-xl text-dark-100">
//         {borrowing ? "Borrowing..." : "Borrow Book"}
//       </p>
//     </Button>
//   );
// };
// export default BorrowBook;
