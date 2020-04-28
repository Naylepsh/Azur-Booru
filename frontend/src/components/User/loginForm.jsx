import React from "react";
import Form from "../common/Form/form";
import Joi from "@hapi/joi";
import "./userForm.css";
import { login } from "../../services/authService";

class LoginForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {},
  };

  schema = Joi.object().keys({
    username: Joi.string().required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
  });

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await login(data.username, data.password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
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
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
