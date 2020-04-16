import React, { Component } from "react";
import "./commentPrompt.css";

class CommentPrompt extends Component {
  state = {
    body: "",
  };

  handleChange = (body) => {
    this.setState({ body });
  };

  render() {
    return (
      <div className="comment-new">
        <div
          className="comment-prompt"
          contentEditable="true"
          data-text="Add a comment..."
          onInput={({ target }) => this.handleChange(target.innerText)}
        ></div>
        <button onClick={() => this.props.onSubmit(this.state.body)}>
          Submit
        </button>
      </div>
    );
  }
}

export default CommentPrompt;
