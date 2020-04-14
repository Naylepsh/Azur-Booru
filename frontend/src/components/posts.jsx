import React, { Component } from "react";
import "../css/posts.css";
import SearchBar from "./searchBar";

class Posts extends Component {
  state = {};
  render() {
    return (
      <div class="container text-center">
        <SearchBar />
      </div>
    );
  }
}

export default Posts;
