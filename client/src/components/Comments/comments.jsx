import React, { Component } from "react";
import Comment from "./../common/Comments/comment";
import { getComments } from "./../../services/commentService";

class Comments extends Component {
  state = {
    comments: [],
  };

  async componentDidMount() {
    const { data } = await getComments();
    const comments = data.comments;

    this.setState({ comments });
  }

  commentPreview = (comment) => {
    return (
      <div className="comment-preview">
        <div className="thumbnail">
          <a href={`/posts/${comment.post.id}`}>
            <img src={comment.post.thumbnailLink}></img>
          </a>
        </div>
        <Comment {...comment} />
      </div>
    );
  };

  render() {
    const { comments } = this.state;

    return (
      <div className="container">
        <section className="comments">
          {comments && comments.length > 0 && (
            <div className="commentsList">
              <ul>{comments.map(this.commentPreview)}</ul>
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default Comments;
