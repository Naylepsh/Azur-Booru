import React, { Component } from "react";
import SearchBar from "../common/SearchBar/searchBar";
import "./landing.css";

class Landing extends Component {
  componentDidMount() {
    this.changeBackground("landing-page-bg");
  }

  componentWillUnmount() {
    this.changeBackground("");
  }

  changeBackground = (className) => {
    document.body.className = className;
  };

  render() {
    return (
      <section className="static-index container">
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
