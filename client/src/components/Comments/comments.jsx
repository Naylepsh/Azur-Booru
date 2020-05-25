import React, { Component } from "react";
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

  render() {
    const { comments } = this.state;

    return (
      <div>
        {comments.map((comment) => (
          <p>{comment.body}</p>
        ))}
      </div>
    );
  }
}

export default Comments;
