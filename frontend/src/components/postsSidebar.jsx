import React, { Component } from "react";
import TagsSidebar from "./tagsSidebar";

class PostsSidebar extends Component {
  state = {};
  render() {
    return (
      <aside className="sidebar">
        <TagsSidebar tags={this.props.tags} />
      </aside>
    );
  }
}

export default PostsSidebar;
