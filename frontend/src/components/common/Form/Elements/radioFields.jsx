import React from "react";

const RadioFields = ({ label, name, error, items, ...rest }) => {
  return (
    <div className="form-entry">
      <fieldset>
        <legend>{label}</legend>
        {items.map((item) => {
          return (
            <div key={item.label}>
              <input
                type="radio"
                name={name}
                id={item.label}
                {...rest}
                className="form-control"
              />
              <label htmlFor={item.label}>{item.label}</label>
            </div>
          );
        })}
      </fieldset>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default RadioFields;
