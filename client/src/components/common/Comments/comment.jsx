import React from "react";
import "./comment.css";

const Comment = ({ id, body, score, author, userId }) => {
  const isUserAuthorized = userId === author._id;
  const userAvatar = "/assets/default-avatar.jpg";

  return (
    <li className="comment">
      <span className="hidden comment-id">{id}</span>
      <div className="comment-author-avatar">
        <img src={userAvatar} alt={`${author.name}'s avatar`} />
      </div>
      <div className="comment-author-info">
        <a href="#">{author.name}</a>
      </div>
      <div className="comment-body">{body}</div>
      {isUserAuthorized && (
        <menu className="comment-menu">
          <li>
            Score: <span className="comment-score">{score}</span>
          </li>
          <li>
            <button className="comment-vote-up">Vote up</button>
          </li>
          <li>
            <button className="comment-vote-down">Vote down</button>
          </li>
          <li>
            <form
              action="/comments/<%= comment._id %>?_method=DELETE"
              method="POST"
            >
              <input
                type="hidden"
                name="postId"
                value="<%= comment.post._id %>"
              />
              <button>Delete</button>
            </form>
          </li>
        </menu>
      )}
    </li>
  );
};

export default Comment;
