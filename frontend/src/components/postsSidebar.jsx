import React, { Component } from "react";
import TagsSidebarSection from "./tagsSidebarSection";

class PostsSidebar extends Component {
  state = {};
  render() {
    const { tags } = this.props;

    return (
      <aside className="sidebar">
        <TagsSidebarSection tags={tags} />
      </aside>
    );
  }
}

export default PostsSidebar;
