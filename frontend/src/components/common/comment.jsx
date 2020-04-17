import React from "react";

const Comment = ({ id, body, score, author }) => {
  return (
    <li className="comment">
      <span className="hidden comment-id">{id}</span>
      <div className="comment-author-avatar">
        <img
          src="/assets/default-avatar.jpg"
          alt="<%= comment.author.name %> avatar"
        />
      </div>
      <div className="comment-author-info">
        <a href="#">{author.name}</a>
      </div>
      <div className="comment-body">{body}</div>
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
    </li>
  );
};

export default Comment;