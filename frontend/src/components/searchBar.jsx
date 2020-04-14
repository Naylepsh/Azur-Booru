import React from "react";

const SearchBar = () => {
  return (
    <React.Fragment>
      <form action="/posts" method="get" className="search-bar">
        <input
          id="search"
          type="text"
          name="tags"
          placeholder="Ex: 1girl blue_sky ocean"
        />
        <button class="search-button">Search</button>
      </form>
    </React.Fragment>
  );
};

export default SearchBar;
