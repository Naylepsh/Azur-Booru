import React, { Component } from "react";
import Comment from "./../common/Comments/comment";
import { getComments } from "./../../services/commentService";
import queryString from "query-string";

class Comments extends Component {
  state = {
    comments: [],
    currentPage: this.defaultPageNumber,
  };

  defaultPageNumber = 1;

  async componentDidMount() {
    const query = queryString.parse(this.props.location.search);

    let currentPage = query.page;
    if (!currentPage) {
      currentPage = this.defaultPageNumber;
    }
    query["page"] = currentPage;

    const { data } = await getComments(queryString.stringify(query));
    const comments = this.mapToViewModel(data);

    this.setState({ comments, currentPage });
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
      <div key={comment.id} className="comment-preview">
        <div className="thumbnail">
          <a href={`/posts/${comment.post.id}`}>
            <img src={comment.post.thumbnailLink} alt={comment.id}></img>
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
