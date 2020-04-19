import React from "react";
import "./searchBar.css";

const SearchBar = ({ value, onChange }) => {
  return (
    <React.Fragment>
      <form action="/posts" method="get" className="search-bar">
        <input
          id="search"
          type="text"
          name="tags"
          value={value}
          placeholder="Ex: 1girl blue_sky ocean"
          onChange={onChange}
        />
        <button className="search-button">Search</button>
      </form>
    </React.Fragment>
  );
};

export default SearchBar;
