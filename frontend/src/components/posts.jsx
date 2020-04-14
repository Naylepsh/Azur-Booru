import React, { Component } from "react";
import "../css/posts.css";
import SearchBar from "./searchBar";
import PostsSidebar from "./postsSidebar";
import Thumbnails from "./common/thumbnails";
import { getPosts } from "../services/postService";

class Posts extends Component {
  state = {
    posts: [],
    tags: [],
    thumbnails: [],
    pageInfo: {},
    url: "/posts",
  };

  async componentDidMount() {
    const { data } = await getPosts();
    this.setState(this.mapToViewModel(data));
  }

  mapToViewModel = (data) => {
    return {
      thumbnails: data.posts.map(this.getThumbnailInfoFromPost),
      posts: data.posts,
      tags: data.tags,
      tagsQuery: data.tagsQuery,
      pageInfo: data.pageInfo,
    };
  };

  getThumbnailInfoFromPost = (post) => {
    return {
      id: post._id,
      source: post.thumbnailLink,
    };
  };

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
