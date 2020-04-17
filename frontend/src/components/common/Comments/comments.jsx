import React from "react";
import Comment from "./comment";
import CommentPrompt from "./commentPrompt";
import "./comments.css";

const Comments = ({ comments, onSubmit }) => {
  return (
    <section className="comments">
      <div className="comments-list">
        <ul>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              body={comment.body}
              score={comment.score}
              author={comment.author}
            />
          ))}
        </ul>
      </div>
      <CommentPrompt onSubmit={onSubmit} />
    </section>
  );
};

export default Comments;
