import React from "react";

const Input = ({ label, name, error, ...rest }) => {
  return (
    <div className="form-entry">
      <label htmlFor={name}>{label}</label>
      <input name={name} id={name} {...rest} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
