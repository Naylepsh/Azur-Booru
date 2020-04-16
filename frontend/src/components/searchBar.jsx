import React from "react";

const SearchBar = ({ value }) => {
  return (
    <React.Fragment>
      <form action="/posts" method="get" className="search-bar">
        <input
          id="search"
          type="text"
          name="tags"
          value={value}
          placeholder="Ex: 1girl blue_sky ocean"
        />
        <button className="search-button">Search</button>
      </form>
    </React.Fragment>
  );
};

export default SearchBar;
