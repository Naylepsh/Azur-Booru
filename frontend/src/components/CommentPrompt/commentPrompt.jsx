import React from "react";
import "./commentPrompt.css";

const CommentPrompt = ({ onSubmit }) => {
  return (
    <div className="comment-new">
      <div
        className="comment-prompt"
        contenteditable="true"
        data-text="Add a comment..."
      ></div>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
};

export default CommentPrompt;
