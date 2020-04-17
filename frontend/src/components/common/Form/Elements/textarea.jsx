import React from "react";

const TextArea = ({ label }) => {
  return (
    <div className="form-entry">
      <label htmlFor={label}>{label}</label>
      <textarea id={label}></textarea>
    </div>
  );
};

export default TextArea;
