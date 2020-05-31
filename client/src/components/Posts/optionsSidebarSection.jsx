import React from "react";
import ToggableSidebarSection from "../common/Sidebars/toggableSidebarSection";
import { deletePost } from "../../services/postService";

const del = async (id) => {
  await deletePost(id);
  window.location = "/posts";
};

const renderItems = (id, user) => {
  return (
    <React.Fragment>
      {user && user.isLoggedIn && user.isAuthor && (
        <React.Fragment>
          <div>
            <li className="sidebar-section-generic-content">
              <a href={`/posts/${id}/edit`}>Edit</a>
            </li>
          </div>
          <div>
            <li className="sidebar-section-generic-content">
              <button id="delete-button" onClick={() => del(id)}>
                Delete
              </button>
            </li>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const OptionsSidebarSection = ({ id, user }) => {
  return (
    <ToggableSidebarSection
      sectionClasses="sidebar-section-generic"
      name="Options"
      renderItems={() => renderItems(id, user)}
    />
  );
};

export default OptionsSidebarSection;
