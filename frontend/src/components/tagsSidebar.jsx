import React, { Component } from "react";

class TagsSidebar extends Component {
  state = {};

  render() {
    const { tags } = this.props;

    return (
      <section class="tags">
        <div class="sidebar-section-name">
          <h3>tags</h3>
        </div>
        <ul>
          {tags.map((tag) => (
            <div>
              <li class="tag">
                <a href="/posts?tags=<%= tag.name %>">{tag.name}</a>
                <span>{tag.occurences}</span>
              </li>
            </div>
          ))}
        </ul>
      </section>
    );
  }
}

export default TagsSidebar;
