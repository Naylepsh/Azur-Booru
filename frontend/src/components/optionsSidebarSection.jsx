import React from "react";
import ToggableSidebarSection from "./common/toggableSidebarSection";

const renderItems = (id) => {
  return (
    <React.Fragment>
      <div>
        <li className="sidebar-section-generic-content">
          <a href={`/posts/${id}/edit`}>Edit</a>
        </li>
      </div>
      <div>
        <li className="sidebar-section-generic-content">
          <form action={`/posts/${id}?_method=DELETE`} method="POST">
            <button id="delete-button">Delete</button>
          </form>
        </li>
      </div>
    </React.Fragment>
  );
};

const OptionsSidebarSection = ({ id }) => {
  return (
    <ToggableSidebarSection
      sectionClasses="sidebar-section-generic"
      name="Options"
      renderItems={() => renderItems(id)}
    />
  );
};

export default OptionsSidebarSection;
