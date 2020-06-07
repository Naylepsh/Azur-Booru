import React from "react";
import { Link } from "react-router-dom";
import "./thumbnails.css";

const getLinkToFullsize = (path, id) => {
  return `${path}/${id}`;
};

const Thumbnails = ({ thumbnails, path }) => {
  return (
    <section className="thumbnails">
      {thumbnails.map((thumbnail) => (
        <div key={thumbnail.id} className="thumbnail-preview">
          <Link to={getLinkToFullsize(path, thumbnail.id)}>
            <img src={thumbnail.source} alt={thumbnail.id} />
          </Link>
        </div>
      ))}
    </section>
  );
};

export default Thumbnails;
