import React, { Component } from "react";
import TagsSidebarSection from "./tagsSidebarSection";
import PostInfoSidebarSection from "./postInfoSidebarSection";
import OptionsSidebarSection from "./optionsSidebarSection";

class PostSidebar extends Component {
  state = {};
  render() {
    const { tags, post, selectedTags, handleTagToggle } = this.props;
    const { id, source, score, rating } = post;
    return (
      <aside className="sidebar">
        <TagsSidebarSection
          tags={tags}
          selectedTags={selectedTags}
          onClick={handleTagToggle}
        />
        <PostInfoSidebarSection
          id={id}
          source={source}
          score={score}
          rating={rating}
        />
        <OptionsSidebarSection id={id} />
      </aside>
    );
  }
}

export default PostSidebar;
