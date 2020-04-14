import React, { Component } from "react";
import TagsSidebarSection from "./tagsSidebarSection";
import PostInfoSidebarSection from "./postInfoSidebarSection";

class PostsSidebar extends Component {
  state = {};
  render() {
    const { tags, post } = this.props;
    const { id, source, score, rating } = post;

    return (
      <aside className="sidebar">
        <TagsSidebarSection tags={tags} />
        <PostInfoSidebarSection
          id={id}
          source={source}
          score={score}
          rating={rating}
        />
      </aside>
    );
  }
}

export default PostsSidebar;