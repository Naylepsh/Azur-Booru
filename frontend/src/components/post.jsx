import React, { Component } from "react";
import SearchBar from "./searchBar";
import "../css/posts.css";
import PostSidebar from "./postSidebar";
import { getPost } from "../services/postService";
import Comment from "./common/comment";

class Post extends Component {
  state = {
    post: {},
    tags: [],
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    const { data } = await getPost(id);
    this.setState({ post: this.mapToViewModel(data.post), tags: data.tags });
  }

  mapToViewModel = (post) => {
    return {
      id: post._id,
      imageLink: post.imageLink,
      source: post.source,
      score: post.score,
      rating: post.rating,
      comments: post.comments,
    };
  };

  renderPostContent() {
    return (
      <section className="post-image">
        <img src={this.state.post.imageLink} alt="post" />
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

  renderComments = () => {
    const { post } = this.state;
    if (!post || !post.comments) return;

    return post.comments.map((comment) => (
      <Comment
        id={comment._id}
        body={comment.body}
        score={comment.score}
        author={comment.author}
      />
    ));
  };

  render() {
    const { post, tags } = this.state;
    return (
      <div className="container">
        <SearchBar />
        <PostSidebar tags={tags} post={post} />
        <div id="content">
          {this.renderPostContent()}
          {this.renderComments()}
        </div>
      </div>
    );
  }
}

export default Post;
