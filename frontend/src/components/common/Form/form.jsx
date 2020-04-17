import React, { Component } from "react";
import Joi from "@hapi/joi";
import Input from "./Elements/input";
import FieldSet from "./Elements/fieldset";
import TextArea from "./Elements/textarea";
import "./form.css";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = this.schema.validate(this.state.data, options);

    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    console.log(errors);
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const key = { [name]: this.schema._ids._byKey.get(name).schema };
    const schema = Joi.object().keys(key);
    const { error } = schema.validate(obj);

    return error ? error.details[0].message : null;
  };

  handleSubmit = (event) => {
    console.log("handling submittion");
    event.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderInput = (name, label, type = "text", rest = {}) => {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        label={label}
        name={name}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
        {...rest}
      />
    );
  };

  renderFieldSet = (legendLabel, items, defaultValue) => {
    return (
      <FieldSet
        legendLabel={legendLabel}
        items={items}
        defaultValue={defaultValue}
      />
    );
  };

  renderTextArea = (label) => {
    return <TextArea label={label} />;
  };

  renderButton = (label) => {
    return (
      <button
        type="submit"
        // disabled={this.validate()}
        className="btn btn-primary"
      >
        {label}
      </button>
    );
  };
}

export default Form;
