import React from "react";

// TODO: can be later turned into common component?

const PostInfoSidebarSection = ({ id, source, score, rating }) => {
  return (
    <section className="sidebar-section-generic">
      <div className="sidebar-section-name">
        <h3>Information</h3>
      </div>
      <ul>
        <div>
          <li className="sidebar-section-generic-content">
            <span>Id:</span> <span id="post-id">{id}</span>
          </li>
        </div>
        <div>
          <li className="sidebar-section-generic-content">
            <span>Source:</span> <span id="post-source">{source}</span>
          </li>
        </div>
        <div>
          <li className="sidebar-section-generic-content">
            <span>Score:</span> <span id="post-score">{score}</span>
          </li>
        </div>
        <div>
          <li className="sidebar-section-generic-content">
            <span>Rating:</span> <span id="post-rating">{rating}</span>
          </li>
        </div>
      </ul>
    </section>
  );
};

export default PostInfoSidebarSection;
