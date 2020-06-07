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
import VotingButtonUp from "../common/VotingButtons/votingButtonUp";
import VotingButtonDown from "../common/VotingButtons/votingButtonDown";

const VOTE_UP = "up";
const VOTE_DOWN = "down";
const VOTE_NONE = "none";

class Post extends Component {
  state = {
    post: {},
    tags: [],
    selectedTags: [],
    query: "",
    vote: "",
  };

  async componentDidMount() {
    try {
      const id = this.props.match.params.id;
      document.title = id;

      let query = queryString.parse(this.props.location.search).tags;
      query = query ? query : "";
      const selectedTags = query.split();
      const { data } = await getPost(id);
      const post = this.mapToViewModel(data.post);

      const vote = this.getVote(post);

      this.setState({
        post,
        tags: data.tags,
        selectedTags,
        query,
        vote,
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return handleNotFound();
      }
      handleInternalError();
    }
  }

  getVote = (post) => {
    const userId = this.props.user && this.props.user._id;

    if (post.voters.up.includes(userId)) {
      return VOTE_UP;
    }
    if (post.voters.down.includes(userId)) {
      return VOTE_DOWN;
    }
    return VOTE_NONE;
  };

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

  handleVoteClick = async (voteType) => {
    try {
      const post = { ...this.state.post };
      let upvoters = [...post.voters.up];
      let downvoters = [...post.voters.down];
      const { user } = this.props;

      toggleVote(post.id, voteType);

      if (voteType === VOTE_UP) {
        upvoters = toggleInArray(user._id, upvoters);
        downvoters = removeFromArrayIfExists(user._id, downvoters);
      } else if (voteType === VOTE_DOWN) {
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
    const vote = this.state.vote;

    return (
      <section className="post-image">
        <img src={this.state.post.imageLink} alt="post" />
        <menu className="post-menu">
          <VotingButtonUp
            isActive={vote === VOTE_UP}
            onClick={() => this.handleVoteClick(VOTE_UP)}
          />
          <VotingButtonDown
            isActive={vote === VOTE_DOWN}
            onClick={() => this.handleVoteClick(VOTE_DOWN)}
          />
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
              showCommentPrompt={user.isLoggedIn}
              userId={this.props.user && this.props.user._id}
              postId={post.id}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Post;
