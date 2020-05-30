import React from "react";

const CommentSearch = () => {
  document.title = "Search Comments";

  return (
    <div className="container">
      <form action="/comments" method="GET" className="comment-search-form">
        <div className="form-entry">
          <label htmlFor="body">Body</label>
          <input
            type="text"
            name="body"
            id="body"
            placeholder="Fragment of comment's body"
          />
        </div>
        <div className="form-entry">
          <label htmlFor="author">Author</label>
          <input type="text" name="author" id="author" placeholder="Author" />
        </div>
        <button>Search</button>
      </form>
    </div>
  );
};

export default CommentSearch;
