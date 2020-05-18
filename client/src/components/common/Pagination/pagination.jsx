import React, { Component } from "react";
import queryString from "query-string";

const default_page_offset = 5;

class Pagination extends Component {
  state = {
    currentPage: "",
    pageOffset: "",
    path: "",
    query: "",
  };

  componentDidMount() {
    let currentPage;
    let { path, query, pageOffset } = this.props;

    query = queryString.parse(query);

    if (!pageOffset) {
      pageOffset = default_page_offset;
    }

    if (!query) {
      currentPage = 1;
    } else {
      currentPage = query.page;
      if (!currentPage) {
        currentPage = 1;
      }
    }

    this.setState({
      currentPage: currentPage,
      pageOffset,
      query,
      path,
    });
  }

  createHref = (pageNumber) => {
    const query = { ...this.state.query };
    query.page = pageNumber;
    return `${this.state.path}?${queryString.stringify(query)}`;
  };

  createPageLink = (page, lastPage) => {
    return (
      page > 0 &&
      page <= lastPage && (
        <a key={page} href={this.createHref(page)}>
          {page}
        </a>
      )
    );
  };

  render() {
    const { lastPage } = this.props;
    const { currentPage, pageOffset } = this.state;
    const previousPages = [...new Array(pageOffset).keys()].map(
      (i) => currentPage - pageOffset + i
    );
    const nextPages = [...new Array(pageOffset).keys()].map(
      (i) => currentPage + i + 1
    );

    return (
      <section className="pagination">
        <span className="pages">
          {previousPages.map((page) => this.createPageLink(page, lastPage))}
        </span>
        <span className="pages">
          {this.createPageLink(currentPage, lastPage)}
        </span>
        <span className="pages">
          {nextPages.map((page) => this.createPageLink(page, lastPage))}
        </span>
      </section>
    );
  }
}

export default Pagination;
