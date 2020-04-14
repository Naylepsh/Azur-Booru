import React, { Component } from "react";
import "../css/posts.css";
import SearchBar from "./searchBar";
import TagsSidebar from "./tagsSidebar";

class Posts extends Component {
  state = {
    tags: [{ name: "tag1", occurences: 5 }],
  };

  render() {
    return (
      <div class="container text-center">
        <SearchBar />
        <TagsSidebar tags={this.state.tags} />
      </div>
    );
  }
}

export default Posts;
