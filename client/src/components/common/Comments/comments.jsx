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
              id={comment._id}
              key={comment._id}
              body={comment.body}
              score={comment.score}
              author={comment.author}
              voters={comment.voters}
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
