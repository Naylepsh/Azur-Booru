import React, { Component } from "react";
import "../css/landing.css";
import SearchBar from "./common/SearchBar/searchBar";

class Landing extends Component {
  componentDidMount() {
    this.changeBackground();
  }

  changeBackground = () => {
    document.body.className = "landing-page-bg";
  };

  render() {
    return (
      <section class="static-index container">
        <h1>
          <a href="/posts">
            'Refreshed' take on classic boorus with Azur Lane theme
          </a>
        </h1>
        <p>tfw no cute botes to hold signs</p>
        <SearchBar />
      </section>
    );
  }
}

export default Landing;
