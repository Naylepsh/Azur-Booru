import React, { Component } from "react";
import "./comment.css";
import { toggleVote } from "./../../../services/commentService";
import { handleInternalError } from "./../../../utils/responseErrorHandler";
import VotingButtonUp from "../VotingButtons/votingButtonUp";
import VotingButtonDown from "../VotingButtons/votingButtonDown";

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
      let vote;

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
        vote = voteType;
      } else if (oldVote === VOTE_DOWN) {
        if (voteType === VOTE_DOWN) {
          score += 1;
          vote = VOTE_NONE;
        } else {
          score += 2;
          vote = voteType;
        }
      } else if (oldVote === VOTE_UP) {
        if (voteType === VOTE_UP) {
          score -= 1;
          vote = VOTE_NONE;
        } else {
          score -= 2;
          vote = voteType;
        }
      }

      this.setState({ score, vote });

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
            <VotingButtonUp onClick={() => this.sendVote(VOTE_UP)} />
            <VotingButtonDown onClick={() => this.sendVote(VOTE_DOWN)} />
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
