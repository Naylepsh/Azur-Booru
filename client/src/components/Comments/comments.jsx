import React, { Component } from "react";
import Comment from "./../common/Comments/comment";
import { getComments } from "./../../services/commentService";

class Comments extends Component {
  state = {
    comments: [],
  };

  async componentDidMount() {
    const query = this.props.location.search;
    const { data } = await getComments(query);
    const comments = this.mapToViewModel(data);

    this.setState({ comments });
  }

  mapToViewModel = (data) => {
    const { comments } = data;

    return comments.map(this.mapSingleCommentToViewModel);
  };

  mapSingleCommentToViewModel = (comment) => {
    return {
      id: comment._id,
      body: comment.body,
      score: comment.score,
      author: comment.author,
      post: {
        id: comment.post._id,
        thumbnailLink: comment.post.thumbnailLink,
      },
    };
  };

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
