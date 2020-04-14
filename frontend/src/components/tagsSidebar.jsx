import React, { Component } from "react";

class TagsSidebar extends Component {
  state = {};

  render() {
    const { tags } = this.props;

    return (
      <section className="tags">
        <div className="sidebar-section-name">
          <h3>tags</h3>
        </div>
        <ul>
          {tags.map((tag) => (
            <div key={tag.name}>
              <li className="tag">
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
