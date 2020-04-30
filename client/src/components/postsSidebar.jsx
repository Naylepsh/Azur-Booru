import React, { Component } from "react";
import TagsSidebarSection from "./tagsSidebarSection";

class PostsSidebar extends Component {
  state = {};
  render() {
    const { tags, selectedTags, handleTagToggle } = this.props;

    return (
      <aside className="sidebar">
        <TagsSidebarSection
          tags={tags}
          selectedTags={selectedTags}
          onClick={handleTagToggle}
        />
      </aside>
    );
  }
}

export default PostsSidebar;
