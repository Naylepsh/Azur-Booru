import React, { Component } from "react";

class ToggableSidebarSection extends Component {
  state = {
    isCollapsed: false,
  };

  handleToggle = () => {
    const isCollapsed = !this.state.isCollapsed;
    this.setState({ isCollapsed });
  };

  getUlClasses = () => {
    return this.state.isCollapsed ? "hidden" : "";
  };

  render() {
    const { sectionClasses, name, renderItems } = this.props;

    return (
      <section className={sectionClasses} onClick={this.handleToggle}>
        <div className="sidebar-section-name">
          <h3>{name}</h3>
        </div>
        <ul className={this.getUlClasses()}>{renderItems()}</ul>
      </section>
    );
  }
}

export default ToggableSidebarSection;
