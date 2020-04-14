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

  renderPostContent() {
    return (
      <section className="post-image">
        <img src={this.state.post.imageLink} />
        <menu className="post-menu">
          <li>
            <button id="post-vote-up">Vote up</button>
          </li>
          <li>
            <button id="post-vote-down">Vote down</button>
          </li>
          <li>
            <button id="post-favorite">Favorite</button>
          </li>
        </menu>
      </section>
    );
  }

  render() {
    const { post, tags } = this.state;
    return (
      <div className="container">
        <SearchBar />
        <PostSidebar tags={tags} post={post} />
        <div id="content">{this.renderPostContent()}</div>
      </div>
    );
  }
}

export default Post;
