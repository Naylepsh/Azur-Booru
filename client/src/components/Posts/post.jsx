import React, { Component } from "react";
import queryString from "query-string";
import SearchBar from "../common/SearchBar/searchBar";
import PostSidebar from "./postSidebar";
import Comments from "../common/Comments/comments";
import { getPost, toggleVote } from "../../services/postService";
import { toggleInArray, removeFromArrayIfExists } from "../../utils/iterable";
import {
  handleTagToggle,
  handleQueryChange,
} from "../../utils/tagQueryHandlers";
import {
  handleInternalError,
  handleNotFound,
} from "../../utils/responseErrorHandler";
import "./posts.css";

class Post extends Component {
  state = {
    post: {},
    tags: [],
    selectedTags: [],
    query: "",
  };

  async componentDidMount() {
    try {
      const id = this.props.match.params.id;
      document.title = id;

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
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return handleNotFound();
      }

      handleInternalError();
    }
  }

  mapToViewModel = (post) => {
    return {
      id: post._id,
      imageLink: post.imageLink,
      source: post.source,
      score: post.score,
      rating: post.rating,
      comments: post.comments,
      voters: post.voters,
      author: { id: post.author.id, name: post.author.name },
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

  handleCommentSubmit = (value) => {
    // const { postId } = this.props;
    // get user
    // create comment
    // send post request to server
    // update state
    console.log(value);
  };

  handleVoteClick = async (voteType) => {
    try {
      const post = { ...this.state.post };
      let upvoters = [...post.voters.up];
      let downvoters = [...post.voters.down];
      const { user } = this.props;

      toggleVote(post.id, voteType);

      if (voteType === "up") {
        upvoters = toggleInArray(user._id, upvoters);
        downvoters = removeFromArrayIfExists(user._id, downvoters);
      } else if (voteType === "down") {
        downvoters = toggleInArray(user._id, downvoters);
        upvoters = removeFromArrayIfExists(user._id, upvoters);
      }

      post.voters = { up: upvoters, down: downvoters };
      post.score = upvoters.length - downvoters.length;
      this.setState({ post });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        handleNotFound();
      } else {
        handleInternalError();
      }
    }
  };

  renderPostContent() {
    return (
      <section className="post-image">
        <img src={this.state.post.imageLink} alt="post" />
        <menu className="post-menu">
          <li>
            <button
              id="post-vote-up"
              onClick={() => this.handleVoteClick("up")}
            >
              Vote up
            </button>
          </li>
          <li>
            <button
              id="post-vote-down"
              onClick={() => this.handleVoteClick("down")}
            >
              Vote down
            </button>
          </li>
          <li>
            <button id="post-favorite">Favorite</button>
          </li>
        </menu>
      </section>
    );
  }

  render() {
    const { post, tags, selectedTags, query } = this.state;
    const user = {
      isLoggedIn: this.props.user != null,
      isAuthor:
        post.author && this.props.user && this.props.user.id === post.author.id,
    };

    return (
      <div className="container">
        <SearchBar value={query} onChange={this.handleQueryChange} />
        <PostSidebar
          tags={tags}
          post={post}
          selectedTags={selectedTags}
          handleTagToggle={this.handleTagToggle}
          user={user}
        />
        <div id="content">
          {this.renderPostContent()}
          {post.comments && (
            <Comments
              comments={post.comments}
              onSubmit={this.handleCommentSubmit}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Post;
