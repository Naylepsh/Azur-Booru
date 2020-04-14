import React, { Component } from "react";
import ToggableSidebarSection from "./common/toggableSidebarSection";

class TagsSidebarSection extends Component {
  renderTags = (tags, url) => {
    return tags.map((tag) => (
      <div key={tag.name}>
        <li className="tag">
          <a href={`${url}?tags=${tag.name}`}>{tag.name}</a>
          <span>{tag.occurences}</span>
        </li>
      </div>
    ));
  };

  render() {
    const { tags, url } = this.props;

    return (
      <ToggableSidebarSection
        sectionClasses="tags"
        name="Tags"
        renderItems={() => this.renderTags(tags, url)}
      />
    );
  }
}

export default TagsSidebarSection;
