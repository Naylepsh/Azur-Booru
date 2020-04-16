import React, { Component } from "react";
import queryString from "query-string";
import SearchBar from "./searchBar";
import PostSidebar from "./postSidebar";
import Comment from "./common/comment";
import { getPost } from "../services/postService";
import { handleTagToggle, handleQueryChange } from "../utils/tagQueryHandlers";
import "../css/posts.css";

class Post extends Component {
  state = {
    post: {},
    tags: [],
    selectedTags: [],
    query: "",
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    let query = queryString.parse(this.props.location.search).tags;
    query = query ? query : "";
    const selectedTags = query.split();
    const { data } = await getPost(id);
    this.setState({
      post: this.mapToViewModel(data.post),
      tags: data.tags,
      selectedTags,
      query,
    });
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

  getTagNames = () => {
    return this.state.tags.map((tag) => tag.name);
  };

  handleTagToggle = (tagName) => {
    const { query, selectedTags } = handleTagToggle(tagName, [
      ...this.state.selectedTags,
    ]);

    this.setState({ selectedTags, query });
  };

  handleQueryChange = ({ currentTarget: input }) => {
    const query = input.value;
    const selectedTags = handleQueryChange(query, this.getTagNames());

    this.setState({ selectedTags, query });
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

    return (
      <section className="comments">
        <div className="comments-list">
          <ul>
            {post.comments.map((comment) => (
              <Comment
                id={comment._id}
                body={comment.body}
                score={comment.score}
                author={comment.author}
              />
            ))}
          </ul>
        </div>
      </section>
    );
  };

  render() {
    const { post, tags, selectedTags, query } = this.state;
    return (
      <div className="container">
        <SearchBar value={query} onChange={this.handleQueryChange} />
        <PostSidebar
          tags={tags}
          post={post}
          selectedTags={selectedTags}
          handleTagToggle={this.handleTagToggle}
        />
        <div id="content">
          {this.renderPostContent()}
          {this.renderComments()}
        </div>
      </div>
    );
  }
}

export default Post;
