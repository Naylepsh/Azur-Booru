import React, { Component } from "react";
import queryString from "query-string";
import "./pagination.css";

const DEFAULT_PAGE_OFFSET = 5;
const PAGE_FIRST = "<<";
const PAGE_PREVIOUS = "<";
const PAGE_NEXT = ">";
const PAGE_LAST = ">>";

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
      pageOffset = DEFAULT_PAGE_OFFSET;
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

  isWithinBoundaries(page) {
    const { lastPage } = this.props;

    return page > 0 && page <= lastPage;
  }

  getLinkClass = (isActive = false) => {
    return "page " + (isActive ? "active-page" : "non-active-page");
  };

  createHref = (pageNumber) => {
    const query = { ...this.state.query };
    query.page = pageNumber;
    return `${this.state.path}?${queryString.stringify(query)}`;
  };

  createPageLink = (page, pageName = null, options = {}) => {
    return (
      this.isWithinBoundaries(page) && (
        <a
          key={page}
          href={this.createHref(page)}
          className={this.getLinkClass(options && options.isActive)}
        >
          {pageName || page}
        </a>
      )
    );
  };

  createPageArrow = (page, symbol) => {
    return this.createPageLink(page, symbol);
  };

  render() {
    const { currentPage, pageOffset } = this.state;
    const { lastPage } = this.props;
    const previousPages = [...new Array(pageOffset).keys()].map(
      (i) => Number(currentPage) - pageOffset + i
    );
    const nextPages = [...new Array(pageOffset).keys()].map(
      (i) => Number(currentPage) + i + 1
    );

    return (
      <section className="pagination">
        <span className="pages">
          {this.createPageArrow(1, PAGE_FIRST)}
          {this.createPageArrow(currentPage - 1, PAGE_PREVIOUS)}
          {previousPages.map((page) => this.createPageLink(page))}
          {this.createPageLink(currentPage, null, { isActive: true })}
          {nextPages.map((page) => this.createPageLink(page))}
          {this.createPageArrow(currentPage + 1, PAGE_NEXT)}
          {this.createPageArrow(lastPage, PAGE_LAST)}
        </span>
      </section>
    );
  }
}

export default Pagination;
