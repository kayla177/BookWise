"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

const SearchForm = ({
  query,
  setQuery,
  setSearchResults,
}: {
  query: string;
  setQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
}) => {
  const [search, setSearch] = useState(query);

  // ✅ Sync input with query when cleared
  useEffect(() => {
    setSearch(query);
  }, [query]);

  // Function to fetch search results
  const fetchSearchResults = async (query: string) => {
    setQuery(query);

    if (!query) return setSearchResults([]); // Reset if empty

    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setSearchResults(data);
  };

  // Debounce function to limit API calls
  const debouncedFetch = useCallback(
    debounce((query) => fetchSearchResults(query), 300), // 300ms delay
    [],
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <Input
        type="text"
        name="query"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
        placeholder="Search..."
      />
      <button type="submit" className="search-btn text-white">
        <Search className="size-5" />
      </button>
    </form>
  );
};

export default SearchForm;
