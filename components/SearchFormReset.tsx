"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const SearchFormReset = () => {
  const router = useRouter();

  const resetSearch = () => {
    router.push("/search"); // Clears query params
  };

  return (
    <button
      type="button"
      onClick={resetSearch}
      className="search-btn text-white"
    >
      <X className="size-5" />
    </button>
  );
};

export default SearchFormReset;
