import React from "react";
import Form from "../common/Form/form";
import Joi from "@hapi/joi";
import "./userForm.css";
import { register } from "../../services/userService";

class RegisterForm extends Form {
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
    console.log("submitting");
    await register(this.state.data);
    console.log("request sent");
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
