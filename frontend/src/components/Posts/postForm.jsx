import React, { Component } from "react";
import Joi from "@hapi/joi";
import Form from "../common/Form/form";

class PostForm extends Form {
  state = {
    data: {
      file: "",
      tags: "",
      source: "",
      rating: "",
    },
    errors: {},
  };

  schema = Joi.object().keys({
    file: Joi.required(),
    tags: Joi.string().required(),
    source: Joi.string(),
    rating: Joi.string(),
  });

  doSubmit = () => {
    console.log("submitting");
  };

  render() {
    const accept = "image/*";
    return (
      <div className="container">
        <form
          className="post-form"
          encType="multipart/form-data"
          onSubmit={this.handleSubmit}
        >
          {this.renderInput("file", "File", "file", { accept: "image/*" })}
          {this.renderInput("source", "Source")}
          {this.renderButton("Upload")}
        </form>
      </div>
    );
  }
}

export default PostForm;
