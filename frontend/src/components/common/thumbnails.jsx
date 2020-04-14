import React from "react";
import { Link } from "react-router-dom";

const getLinkToFullsize = (url, id) => {
  return `${url}/${id}`;
};

const Thumbnails = ({ thumbnails, url }) => {
  return (
    <section className="thumbnails">
      {thumbnails.map((thumbnail) => (
        <div key={thumbnail.id} className="thumbnail-preview">
          <Link to={getLinkToFullsize(url, thumbnail.id)}>
            <img src={thumbnail.source} alt={thumbnail.id} />
          </Link>
        </div>
      ))}
    </section>
  );
};

export default Thumbnails;
