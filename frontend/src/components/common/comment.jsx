import React, { Component } from "react";
import { getComment } from "../../services/commentService";

class Comment extends Component {
  state = {
    id: "",
    body: "",
    author: {},
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    const { data: comment } = await getComment(id);

    // temp author
    const author = { id: 1, name: "author1" };
    this.setState({ comment: mapToViewModel(comment, author) });
  }

  mapToViewModel = (comment, author) => {
    return {
      id: comment._id,
      body: comment.body,
      score: comment.score,
      author,
    };
  };

  render() {
    const { id, body, score, author } = this.state;

    return (
      <li class="comment">
        <span class="hidden comment-id">{id}</span>
        <div class="comment-author-avatar">
          <img
            src="/assets/default-avatar.jpg"
            alt="<%= comment.author.name %> avatar"
          />
        </div>
        <div class="comment-author-info">
          <a href="#">{author.name}</a>
        </div>
        <div class="comment-body">{body}</div>
        <menu class="comment-menu">
          <li>
            Score: <span class="comment-score">{score}</span>
          </li>
          <li>
            <button class="comment-vote-up">Vote up</button>
          </li>
          <li>
            <button class="comment-vote-down">Vote down</button>
          </li>
          <li>
            <form
              action="/comments/<%= comment._id %>?_method=DELETE"
              method="POST"
            >
              <input
                type="hidden"
                name="postId"
                value="<%= comment.post._id %>"
              />
              <button>Delete</button>
            </form>
          </li>
        </menu>
      </li>
    );
  }
}

export default Comment;
