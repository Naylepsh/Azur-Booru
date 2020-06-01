import React, { Component } from "react";
import Comment from "../common/Comments/comment";
import Pagination from "../common/Pagination/pagination";
import { getComments } from "../../services/commentService";
import { handleInternalError } from "../../utils/responseErrorHandler";
import "./commentList.css";

class CommentList extends Component {
  state = {
    comments: [],
    currentPage: this.defaultPageNumber,
    lastPage: this.defaultPageNumber,
    query: "",
  };

  defaultPageNumber = 1;

  async componentDidMount() {
    document.title = "Comments";

    await this.loadComponentFromQuery();
  }

  // Reloads comments on query change.
  async componentDidUpdate(props, state) {
    if (props.location.search !== this.props.location.search) {
      await this.loadComponentFromQuery();
    }
  }

  async loadComponentFromQuery() {
    const query = this.props.location.search;

    try {
      const { data } = await getComments(this.props.location.search);
      this.setState({ ...this.mapToViewModel(data), query });
    } catch (err) {
      handleInternalError();
    }
  }

  mapToViewModel = (data) => {
    const { comments, pageInfo } = data;

    return {
      comments: comments.map(this.mapSingleCommentToViewModel),
      currentPage: pageInfo.currentPage,
      lastPage: pageInfo.lastPage,
    };
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
      voters: comment.voters,
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
    const { comments, query, lastPage } = this.state;
    console.log(lastPage);

    return (
      <div className="container">
        <section className="comments">
          {comments && comments.length > 0 && (
            <div className="commentsList">
              <ul>{comments.map(this.commentPreview)}</ul>
            </div>
          )}
          <Pagination path="/comments" query={query} lastPage={lastPage} />
        </section>
      </div>
    );
  }
}

export default CommentList;
