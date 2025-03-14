import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";

const Home = async () => {
  const session = await auth();
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  // const result = await db.select().from(users);
  // console.log(JSON.stringify(result, null, 2));

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      {/* in bookList, we use "slice(1)" to pass from the 2nd book*/}
      {/* the first book is already showed in the bookOverview*/}

      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};
export default Home;
