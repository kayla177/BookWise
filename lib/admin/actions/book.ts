"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";

const createBook = async (params: BookParams) => {
  try {
    // since just create, all copies are available
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    console.log("book created: ", JSON.parse(JSON.stringify(newBook)));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook)),
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "An error occurred while creating book",
    };
  }
};

export default createBook;
