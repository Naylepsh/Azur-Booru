import React, { Component } from "react";
import ToggableSidebarSection from "./common/toggableSidebarSection";

class TagsSidebarSection extends Component {
  getTagClass = (tagName) => {
    const { selectedTags } = this.props;
    return selectedTags.includes(tagName) ? "tag active-tag" : "tag";
  };

  renderTags = () => {
    const { tags, url, onClick } = this.props;
    return tags.map((tag) => (
      <div key={tag.name}>
        <li
          className={this.getTagClass(tag.name)}
          onClick={() => onClick(tag.name)}
        >
          <a href={`${url}?tags=${tag.name}`}>{tag.name}</a>
          <span>{tag.occurences}</span>
        </li>
      </div>
    ));
  };

  render() {
    return (
      <ToggableSidebarSection
        sectionClasses="tags"
        name="Tags"
        renderItems={() => this.renderTags()}
      />
    );
  }
}

export default TagsSidebarSection;
