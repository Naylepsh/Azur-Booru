import React, { Component } from "react";

class ToggableSidebarSection extends Component {
  state = {
    isCollapsed: true,
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
      <section className={sectionClasses}>
        <div className="sidebar-section-name" onClick={this.handleToggle}>
          <h3>{name}</h3>
        </div>
        <ul className={this.getUlClasses()}>{renderItems()}</ul>
      </section>
    );
  }
}

export default ToggableSidebarSection;
