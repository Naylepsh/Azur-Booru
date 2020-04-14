import React from "react";
import ToggableSidebarSection from "./common/toggableSidebarSection";

// TODO: can be later turned into common component?

const renderItems = (id, source, score, rating) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

const PostInfoSidebarSection = ({ id, source, score, rating }) => {
  return (
    <ToggableSidebarSection
      sectionClasses="sidebar-section-generic"
      name="Information"
      renderItems={() => renderItems(id, source, score, rating)}
    />
  );
};

export default PostInfoSidebarSection;
