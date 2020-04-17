import React from "react";
import Joi from "@hapi/joi";
import Form from "../common/Form/form";
import "./postForm.css";

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

  ratings = [
    { label: "Explicit", value: "explicit" },
    { label: "Questionable", value: "questionable" },
    { label: "Safe", value: "safe" },
  ];

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
    return (
      <div className="container">
        <form
          className="post-form"
          encType="multipart/form-data"
          onSubmit={this.handleSubmit}
        >
          {this.renderInput("file", "File", "file", { accept: "image/*" })}
          {this.renderInput("source", "Source")}
          {this.renderFieldSet(
            "rating",
            "Rating",
            this.ratings,
            this.ratings[1].value
          )}
          {this.renderTextArea("Tags")}
          {this.renderButton("Upload")}
        </form>
      </div>
    );
  }
}

export default PostForm;
