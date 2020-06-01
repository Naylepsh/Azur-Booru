import React from "react";
import Comment from "./comment";
import CommentPrompt from "./commentPrompt";
import "./comment.css";

const Comments = ({ comments, onSubmit, showCommentPrompt, userId }) => {
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
              userId={userId}
            />
          ))}
        </ul>
      </div>
      {showCommentPrompt && <CommentPrompt onSubmit={onSubmit} />}
    </section>
  );
};

export default Comments;
