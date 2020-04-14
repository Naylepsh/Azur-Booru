import React from "react";

const OptionsSidebarSection = ({ id }) => {
  return (
    <section className="sidebar-section-generic">
      <div className="sidebar-section-name">
        <h3>Options</h3>
      </div>
      <ul>
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
      </ul>
    </section>
  );
};

export default OptionsSidebarSection;
