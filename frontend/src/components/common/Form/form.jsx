import React, { Component } from "react";
import Joi from "@hapi/joi";
import Input from "./Elements/input";
import TextArea from "./Elements/textArea";
import RadioFields from "./Elements/radioFields";
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
    event.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    console.log(input);
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleFileChange = (event, name) => {
    const currentTarget = { name, value: event.target.files[0] };
    this.handleChange({ currentTarget });
  };

  /*
   * Passing name to renderInput will mess up file upload.
   * That's because value={data.file} will return an object, which cannot be a html value.
   * Hence why such a ridiculous name is used instead.
   *
   * This onChange will override default renderInput's onChange
   * as long as {...rest} passed after default onChange
   */
  renderFileInput = (name, label, rest = {}) => {
    return this.renderInput("x-placeholder-name", label, "file", {
      ...rest,
      onChange: (event) => this.handleFileChange(event, name),
    });
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

  renderFieldSet = (name, label, items) => {
    const { data, errors } = this.state;

    return (
      <RadioFields
        label={label}
        name={name}
        selected={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
        items={items}
      />
    );
  };

  renderTextArea = (name, label) => {
    const { data, errors } = this.state;

    return (
      <TextArea
        label={label}
        name={name}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
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
