import React, { Component } from "react";
import Comment from "./comment";
import CommentPrompt from "./commentPrompt";
import { postComment, deleteComment } from "./../../../services/commentService";
import { handleHttpError } from "./../../../utils/responseErrorHandler";
import "./comment.css";

class Comments extends Component {
  state = {
    comments: [],
  };

  componentDidMount() {
    const comments = this.props.comments;

    this.setState({ comments });
  }

  handleCommentSubmit = async (commentBody) => {
    try {
      const postId = this.props.postId;
      const userId = this.props.user._id;

      const { data: comment } = await postComment(postId, userId, commentBody);

      comment.author = { name: "You", _id: userId }; // temporary solution -- load name from /profile maybe?
      const comments = { ...this.state.comments };
      comments.push(comment);
      this.setState({ comments });
    } catch (err) {
      handleHttpError();
    }
  };

  handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);

      const oldComments = [...this.state.comments];
      const comments = oldComments.filter(
        (comment) => comment._id !== commentId
      );

      this.setState({ comments });
    } catch (err) {
      // do nothing atm
    }
  };

  render() {
    const { showCommentPrompt, userId } = this.props;
    const comments = this.state.comments;

    return (
      <section className="comments">
        <div className="comments-list">
          <ul>
            {comments.map((comment) => (
              <Comment
                id={comment._id}
                key={comment._id}
                body={comment.body}
                score={comment.score}
                author={comment.author}
                voters={comment.voters}
                userId={userId}
                onDelete={this.handleCommentDelete}
              />
            ))}
          </ul>
        </div>
        {showCommentPrompt && (
          <CommentPrompt onSubmit={this.handleCommentSubmit} />
        )}
      </section>
    );
  }
}

export default Comments;
