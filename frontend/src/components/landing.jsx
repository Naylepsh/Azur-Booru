import React from "react";
import "../css/landing.css";
import SearchBar from "./searchBar";

const Landing = () => {
  return (
    <section class="container text-center">
      <h1>
        <a href="/posts">
          'Refreshed' take on classic boorus with Azur Lane theme
        </a>
      </h1>
      <p>tfw no cute botes to hold signs</p>
      <SearchBar />
    </section>
  );
};

export default Landing;
