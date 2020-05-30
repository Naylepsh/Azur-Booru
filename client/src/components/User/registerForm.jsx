import React from "react";
import Joi from "@hapi/joi";
import Form from "../common/Form/form";
import { register } from "../../services/userService";
import "./userForm.css";

class RegisterForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {},
  };

  schema = Joi.object().keys({
    username: Joi.string().min(5).required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
  });

  componentDidMount() {
    document.title = "Register";
  }

  doSubmit = async () => {
    try {
      await register(this.state.data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = err.response.data.message;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
