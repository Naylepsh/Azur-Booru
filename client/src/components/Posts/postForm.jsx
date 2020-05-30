import React from "react";
import Joi from "@hapi/joi";
import Form from "../common/Form/form";
import { getPost, uploadPost } from "../../services/postService";
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
    _id: Joi.string().allow(""),
    file: Joi.object().custom(
      (value) => this.fileValidator(value),
      "Check file"
    ),
    tags: Joi.string()
      .required()
      .custom((value) => this.tagsValidator(value), "Check number of tags"),
    source: Joi.string().required(),
    rating: Joi.string().required(),
  });

  async componentDidMount() {
    try {
      const id = this.props.match.params.id;
      if (!id) {
        document.title = "Upload Post";
        return;
      }
      document.title = `Edit ${id}`;

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
      file: {},
      tags: tags,
      source: source,
      rating: post.rating,
    };
  };

  tagsValidator = (value) => {
    const minimalNumberOfTags = 5;
    const tags = value.split(" ");
    if (tags.length < minimalNumberOfTags) {
      throw new Error(`less than ${minimalNumberOfTags} tags`);
    }

    return value;
  };

  fileValidator = (value) => {
    if (this.state.data._id) {
      return value;
    }

    if (!value) {
      throw new Error("File is required");
    }

    return value;
  };

  doSubmit = async () => {
    try {
      await uploadPost(this.state.data);
      this.props.history.push("/posts");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log("400");
      } else if (err.response && err.response.status === 404) {
        console.log("not found");
      } else if (err.response && err.response.status === 401) {
        console.log("unauthorized");
      }
    }
  };

  render() {
    return (
      <div className="container">
        <form
          className="post-form"
          encType="multipart/form-data"
          onSubmit={this.handleSubmit}
        >
          {!this.state.data._id &&
            this.renderFileInput("file", "File", { accept: "image/*" })}
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
