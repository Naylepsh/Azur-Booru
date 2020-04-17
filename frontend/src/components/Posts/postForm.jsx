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
    tags: Joi.string()
      .required()
      .custom(this.tagsValidator, "Check number of tags"),
    source: Joi.string().required(),
    rating: Joi.string().required(),
  });

  tagsValidator(value) {
    const minimalNumberOfTags = 5;
    const tags = value.split(" ");
    if (tags.length < minimalNumberOfTags) {
      throw new Error(`less than ${minimalNumberOfTags} tags`);
    }

    return value;
  }

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
          {this.renderFileInput("file", "File", { accept: "image/*" })}
          {this.renderInput("source", "Source")}
          {this.renderFieldSet("rating", "Rating", this.ratings)}
          {this.renderTextArea("tags", "Tags")}
          {this.renderButton("Upload")}
        </form>
      </div>
    );
  }
}

export default PostForm;
