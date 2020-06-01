import React, { Component } from "react";
import "./comment.css";
import { toggleVote, deleteComment } from "./../../../services/commentService";
import { handleInternalError } from "./../../../utils/responseErrorHandler";

const VOTE_NONE = "none";
const VOTE_DOWN = "down";
const VOTE_UP = "up";

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
      const { id } = this.props;
      let { score, vote: oldVote } = this.state;

      // TODO:
      // since post uses similar voting mechanic,
      // perhaphs it would make sense to create seperate vote handler
      // that given oldVote, newVote and oldScore returns newScore
      if (oldVote === VOTE_NONE) {
        if (voteType === VOTE_UP) {
          score++;
        } else {
          score--;
        }
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

      this.setState({ score, vote: voteType });

      await toggleVote(id, voteType);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // missing comment error can be ignored
      } else {
        handleInternalError();
      }
    }
  };

  render() {
    const score = this.state.score;
    const { id, body, author, userId, onDelete } = this.props;
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
              <button onClick={() => onDelete(id)}>Delete</button>
            </li>
          </menu>
        )}
      </li>
    );
  }
}

export default Comment;
