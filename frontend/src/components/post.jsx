import React, { Component } from "react";
import SearchBar from "./searchBar";
import "../css/posts.css";
import PostSidebar from "./postSidebar";

class Post extends Component {
  state = {};
  render() {
    const tags = [{ name: "tag1", occurences: 1 }];
    const post = { id: 1, source: "danbooru", score: 5, rating: "safe" };
    return (
      <div className="container">
        <SearchBar />
        <PostSidebar tags={tags} post={post} />
      </div>
    );
  }
}

export default Post;
