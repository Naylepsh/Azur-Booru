import React, { Component } from "react";
import VotingButtonUp from "../VotingButtons/votingButtonUp";
import VotingButtonDown from "../VotingButtons/votingButtonDown";
import { voteUp, voteDown } from "./../../../services/commentService";
import { handleHttpError } from "./../../../utils/responseErrorHandler";
import { VOTE_NONE, VOTE_DOWN, VOTE_UP, castVote } from "../../../utils/voting";
import "./comment.css";

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

  voteDown = async () => {
    const handleVote = (oldVote, commentScore, commentId) => {
      voteDown(commentId);
      return castVote(oldVote, VOTE_DOWN, commentScore);
    };

    return this.vote(handleVote);
  };

  voteUp = async () => {
    const handleVote = (oldVote, commentScore, commentId) => {
      voteUp(commentId);
      return castVote(oldVote, VOTE_UP, commentScore);
    };

    return this.vote(handleVote);
  };

  vote = async (handleVote) => {
    try {
      const { score: oldScore, vote: oldVote } = this.state;
      const id = this.props.id;

      const { score, vote } = handleVote(oldVote, oldScore, id);

      this.setState({ score, vote });
    } catch (err) {
      handleHttpError(err);
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
            <VotingButtonUp
              isActive={this.state.vote === VOTE_UP}
              onClick={this.voteUp}
            />
            <VotingButtonDown
              isActive={this.state.vote === VOTE_DOWN}
              onClick={this.voteDown}
            />
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
