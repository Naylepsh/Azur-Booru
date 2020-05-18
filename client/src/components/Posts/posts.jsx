import React, { Component } from "react";
import queryString from "query-string";
import SearchBar from "../common/SearchBar/searchBar";
import PostsSidebar from "../postsSidebar";
import Thumbnails from "../common/Thumbnails/thumbnails";
import { getPosts } from "../../services/postService";
import {
  handleTagToggle,
  handleQueryChange,
} from "../../utils/tagQueryHandlers";
import "./posts.css";
import Pagination from "../common/Pagination/pagination";

class Posts extends Component {
  state = {
    posts: [],
    tags: [],
    thumbnails: [],
    pageInfo: {},
    url: "/posts",
    query: "",
    selectedTags: [],
  };

  async componentDidMount() {
    const { data } = await getPosts(this.props.location.search);
    let query = queryString.parse(this.props.location.search).tags;
    query = query ? query : "";
    const selectedTags = query.split();
    this.setState({ ...this.mapToViewModel(data), query, selectedTags });
  }

  mapToViewModel = (data) => {
    return {
      thumbnails: data.posts.map(this.getThumbnailInfoFromPost),
      posts: data.posts,
      tags: data.tags,
      tagsQuery: data.tagsQuery,
      pageInfo: data.pageInfo,
    };
  };

  getThumbnailInfoFromPost = (post) => {
    return {
      id: post._id,
      source: post.thumbnailLink,
    };
  };

  getTagNames = () => {
    return this.state.tags.map((tag) => tag.name);
  };

  handleTagToggle = (tagName) => {
    const { query, selectedTags } = handleTagToggle(tagName, [
      ...this.state.selectedTags,
    ]);

    this.setState({ selectedTags, query });
  };

  handleQueryChange = ({ currentTarget: input }) => {
    const query = input.value;
    const selectedTags = handleQueryChange(query, this.getTagNames());

    this.setState({ selectedTags, query });
  };

  render() {
    const { query, tags, thumbnails, url, selectedTags, pageInfo } = this.state;
    const { lastPage } = pageInfo;

    return (
      <div className="container text-center">
        <SearchBar value={query} onChange={this.handleQueryChange} />
        <PostsSidebar
          tags={tags}
          selectedTags={selectedTags}
          handleTagToggle={this.handleTagToggle}
        />
        <div id="content">
          <Thumbnails thumbnails={thumbnails} url={url} />
        </div>
        <Pagination
          lastPage={lastPage}
          path={"/posts"}
          query={this.props.location.search}
        />
      </div>
    );
  }
}

export default Posts;