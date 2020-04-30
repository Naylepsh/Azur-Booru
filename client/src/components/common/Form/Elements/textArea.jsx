import React from "react";

const TextArea = ({ label, name, value, error, ...rest }) => {
  return (
    <div className="form-entry">
      <label htmlFor={label}>{label}</label>
      <textarea name={name} id={label} value={value} {...rest}></textarea>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default TextArea;
