import React, { Component } from "react";
import queryString from "query-string";
import "./pagination.css";

const default_page_offset = 5;

class Pagination extends Component {
  state = {
    currentPage: 1,
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

  getLinkClass = (pageNumber) => {
    return (
      "page " +
      (pageNumber === this.state.currentPage
        ? "active-page"
        : "non-active-page")
    );
  };

  createHref = (pageNumber) => {
    const query = { ...this.state.query };
    query.page = pageNumber;
    return `${this.state.path}?${queryString.stringify(query)}`;
  };

  createPageLink = (page, lastPage) => {
    return (
      page > 0 &&
      page <= lastPage && (
        <a
          key={page}
          href={this.createHref(page)}
          className={this.getLinkClass(page)}
        >
          {page}
        </a>
      )
    );
  };

  render() {
    const { lastPage } = this.props;
    const { currentPage, pageOffset } = this.state;
    const previousPages = [...new Array(pageOffset).keys()].map(
      (i) => Number(currentPage) - pageOffset + i
    );
    const nextPages = [...new Array(pageOffset).keys()].map(
      (i) => Number(currentPage) + i + 1
    );

    return (
      <section className="pagination">
        <span className="pages">
          {previousPages.map((page) => this.createPageLink(page, lastPage))}
          {this.createPageLink(currentPage, lastPage)}
          {nextPages.map((page) => this.createPageLink(page, lastPage))}
        </span>
      </section>
    );
  }
}

export default Pagination;
