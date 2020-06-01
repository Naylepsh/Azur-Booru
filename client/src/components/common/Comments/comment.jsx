import React, { Component } from "react";
import "./comment.css";
import { toggleVote } from "./../../../services/commentService";
import { handleInternalError } from "./../../../utils/responseErrorHandler";

const VOTE_NONE = 0;
const VOTE_DOWN = -1;
const VOTE_UP = 1;

class Comment extends Component {
  state = {
    score: 0,
    vote: VOTE_NONE,
  };

  componentDidMount() {
    const { userId, score, voters } = this.props;
    let vote = VOTE_NONE;
    if (voters.up.includes(userId)) {
      vote = VOTE_UP;
    } else if (voters.down.includes(userId)) {
      vote = VOTE_DOWN;
    }

    this.setState({ score, vote });
  }

  sendVote = async (voteType) => {
    try {
      const { id, userId } = this.props;
      let { score, vote: oldVote } = this.state;
      let vote;

      await toggleVote(id, userId, voteType);

      // TODO:
      // since post uses similar voting mechanic,
      // perhaphs it would make sense to create seperate vote handler
      // that given oldVote, newVote and oldScore returns newScore
      if (oldVote === VOTE_NONE) {
        vote = voteType;
        score += voteType;
      } else if (oldVote === VOTE_DOWN) {
        if (voteType === VOTE_DOWN) {
          score += 1;
        } else {
          score += 2;
        }
      } else if (oldVote === VOTE_UP) {
        if (voteType === VOTE_UP) {
          score -= 1;
        } else {
          score -= 2;
        }
      }

      this.setState({ score, vote });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // missing comment error can be ignored
      } else {
        handleInternalError();
      }
    }
  };

  render() {
    const { body, score, author, userId } = this.props;
    const isUserAuthorized = userId === author._id;
    const userAvatar = "/assets/default-avatar.jpg";

    return (
      <li className="comment">
        <div className="comment-author-avatar">
          <img src={userAvatar} alt={`${author.name}'s avatar`} />
        </div>
        <div className="comment-author-info">
          <a href="#">{author.name}</a>
        </div>
        <div className="comment-body">{body}</div>
        {isUserAuthorized && (
          <menu className="comment-menu">
            <li>
              Score: <span className="comment-score">{score}</span>
            </li>
            <li>
              <button
                className="comment-vote-up"
                onClick={() => this.sendVote(VOTE_UP)}
              >
                Vote up
              </button>
            </li>
            <li>
              <button
                className="comment-vote-down"
                onClick={() => this.sendVote(VOTE_DOWN)}
              >
                Vote down
              </button>
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
        )}
      </li>
    );
  }
}

export default Comment;
