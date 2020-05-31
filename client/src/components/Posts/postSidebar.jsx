import React, { Component } from "react";
import TagsSidebarSection from "./tagsSidebarSection";
import PostInfoSidebarSection from "./postInfoSidebarSection";
import OptionsSidebarSection from "./optionsSidebarSection";

class PostSidebar extends Component {
  state = {};
  render() {
    const { tags, post, selectedTags, handleTagToggle, user } = this.props;
    const { id, source, score, rating } = post;
    return (
      <aside className="sidebar">
        <TagsSidebarSection
          tags={tags}
          url={"/posts"}
          selectedTags={selectedTags}
          onClick={handleTagToggle}
        />
        <PostInfoSidebarSection
          id={id}
          source={source}
          score={score}
          rating={rating}
        />
        <OptionsSidebarSection id={id} user={user} />
      </aside>
    );
  }
}

export default PostSidebar;
