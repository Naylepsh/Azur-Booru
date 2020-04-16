import React from "react";

const Comment = ({ id, body, score, author }) => {
  return (
    <li class="comment">
      <span class="hidden comment-id">{id}</span>
      <div class="comment-author-avatar">
        <img
          src="/assets/default-avatar.jpg"
          alt="<%= comment.author.name %> avatar"
        />
      </div>
      <div class="comment-author-info">
        <a href="#">{author.name}</a>
      </div>
      <div class="comment-body">{body}</div>
      <menu class="comment-menu">
        <li>
          Score: <span class="comment-score">{score}</span>
        </li>
        <li>
          <button class="comment-vote-up">Vote up</button>
        </li>
        <li>
          <button class="comment-vote-down">Vote down</button>
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
