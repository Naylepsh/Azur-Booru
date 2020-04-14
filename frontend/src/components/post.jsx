import React, { Component } from "react";
import SearchBar from "./searchBar";
import "../css/posts.css";
import PostSidebar from "./postSidebar";
import { getPost } from "../services/postService";

class Post extends Component {
  state = {
    post: {},
    tags: [],
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    const { data } = await getPost(id);

    this.setState({ post: data.post, tags: data.tags });
  }

  render() {
    const { post, tags } = this.state;
    return (
      <div className="container">
        <SearchBar />
        <PostSidebar tags={tags} post={post} />
      </div>
    );
  }
}

export default Post;
