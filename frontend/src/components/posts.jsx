import React, { Component } from "react";
import "../css/posts.css";
import SearchBar from "./searchBar";
import PostsSidebar from "./postsSidebar";
import Thumbnails from "./common/thumbnails";
import { getPosts } from "../services/postService";

class Posts extends Component {
  state = {
    tags: [{ name: "tag1", occurences: 5 }],
    thumbnails: [
      { id: 1, source: "https://picsum.photos/200/200" },
      { id: 2, source: "https://picsum.photos/200/200" },
      { id: 3, source: "https://picsum.photos/200/200" },
      { id: 4, source: "https://picsum.photos/200/200" },
      { id: 5, source: "https://picsum.photos/200/200" },
      { id: 10, source: "https://picsum.photos/200/200" },
      { id: 20, source: "https://picsum.photos/200/200" },
      { id: 30, source: "https://picsum.photos/200/200" },
      { id: 40, source: "https://picsum.photos/200/200" },
      { id: 50, source: "https://picsum.photos/200/200" },
    ],
    url: "/",
  };

  async componentDidMount() {
    console.log("getting posts");
    const { data } = await getPosts();
    console.log("data: ", data);
  }

  render() {
    return (
      <div className="container text-center">
        <SearchBar />
        <PostsSidebar tags={this.state.tags} />
        <div id="content">
          <Thumbnails thumbnails={this.state.thumbnails} url={this.state.url} />
        </div>
      </div>
    );
  }
}

export default Posts;
