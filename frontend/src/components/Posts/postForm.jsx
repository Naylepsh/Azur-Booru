import React from "react";
import Joi from "@hapi/joi";
import Form from "../common/Form/form";
import { getPost } from "../../services/postService";
import "./postForm.css";

class PostForm extends Form {
  state = {
    data: {
      _id: "",
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
    _id: Joi.string(),
    file: Joi.required(),
    tags: Joi.string()
      .required()
      .custom(this.tagsValidator, "Check number of tags"),
    source: Joi.string().required(),
    rating: Joi.string().required(),
  });

  async componentDidMount() {
    try {
      const id = this.props.match.params.id;
      if (!id) return;

      const { data } = await getPost(id);
      this.setState({ data: this.mapToViewModel(data.post) });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return this.props.history.replace("/not-found");
      }
    }
  }

  mapToViewModel = (post) => {
    const tags = post.tags.map((tag) => tag.name).join(" ");
    const source = post.source ? post.source : "";
    return {
      _id: post._id,
      file: "",
      tags: tags,
      source: source,
      rating: post.rating,
    };
  };

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
