import React from "react";

const RadioFields = ({ label, name, error, items, ...rest }) => {
  return (
    <div className="form-entry">
      <fieldset>
        <legend>{label}</legend>
        {items.map((item) => {
          return (
            <div>
              <input
                type="radio"
                name={name}
                id={item.name}
                {...rest}
                className="form-control"
              />
              <label htmlFor={item.name}>{item.label}</label>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
          );
        })}
      </fieldset>
    </div>
  );
};

export default RadioFields;
