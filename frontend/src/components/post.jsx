import React, { Component } from "react";
import queryString from "query-string";
import SearchBar from "./searchBar";
import PostSidebar from "./postSidebar";
import Comment from "./common/comment";
import { getPost } from "../services/postService";
import { toggleInArray } from "../utils/iterable";
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
    const query = queryString.parse(this.props.location.search).tags;
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

  handleTagToggle = (tagName) => {
    let selectedTags = [...this.state.selectedTags];
    selectedTags = toggleInArray(tagName, selectedTags);

    this.setState({ selectedTags });
  };

  handleQueryChange = ({ currentTarget: input }) => {
    const query = input.value;
    const typedTags = query.split(" ");
    const tagNames = this.state.tags.map((tag) => tag.name);
    let selectedTags = [];
    for (const tag of typedTags) {
      if (tagNames.includes(tag)) {
        selectedTags.push(tag);
      }
    }

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
    // const query = selectedTags.join(" ");
    console.log(query);
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
