"use client";

import React, { useState, useEffect } from "react";
import BookList from "@/components/BookList";
import SearchForm from "@/components/SearchForm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [latestBooks, setLatestBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch latest books when the page loads
  useEffect(() => {
    const fetchLatestBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setLatestBooks(data);
      } catch (error) {
        console.error("Error fetching latest books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <p className="text-sm text-light-100 font-semibold">
          Discover Your Next Great Read:
        </p>
        <h3 className="mt-3 text-2xl text-white font-bold">
          Explore and Search for{" "}
          <span className="text-light-200">Any Book</span> In Our Library
        </h3>

        {/* ✅ Pass query state to SearchForm */}
        <SearchForm
          query={query}
          setQuery={setQuery}
          setSearchResults={setSearchResults}
        />
      </div>

      {/* Show real-time search results OR default latest books */}
      {query ? (
        searchResults.length > 0 ? (
          <BookList
            title={`Search Result for "${query}"`}
            books={searchResults}
            containerClassName="mt-28"
          />
        ) : (
          // **Empty State UI**
          <div className="flex flex-col items-center mt-20">
            <Image
              src="/images/no-books.png"
              alt="No book found"
              width={150}
              height={150}
              className="mb-5"
            />
            <h3 className="text-light-100 font-bold text-xl">
              No Results Found
            </h3>
            <p className="text-light-300 text-sm text-center max-w-md mt-2">
              We couldn’t find any books matching your search. Try using
              different keywords or check for typos.
            </p>
            <Button
              onClick={() => {
                setQuery(""); // ✅ Reset query
                setSearchResults([]); // ✅ Clear search results
                router.replace("/search"); // ✅ Redirect without history
              }}
              className="mt-5 px-6 py-3 bg-amber-300 text-dark-800 font-bold rounded-lg"
            >
              Clear Search
            </Button>
          </div>
        )
      ) : loading ? (
        <h3 className="text-light-100 font-bold mt-10 text-center">
          Loading books...
        </h3>
      ) : latestBooks.length > 0 ? (
        <BookList
          title="Latest Books"
          books={latestBooks}
          containerClassName="mt-28"
        />
      ) : (
        <h3 className="text-light-100 font-bold mt-10 text-center">
          No books available.
        </h3>
      )}
    </div>
  );
};

export default Page;
