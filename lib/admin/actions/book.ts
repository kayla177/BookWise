"use server";

const createBook = async (params: BookParams) => {
  try {
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "An error occurred while creating book",
    };
  }
};
