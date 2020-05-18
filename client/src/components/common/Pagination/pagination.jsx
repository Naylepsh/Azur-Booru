import React, { Component } from "react";
import queryString from "query-string";

const default_page_offset = 5;

class Pagination extends Component {
  state = {
    currentPage: "",
    lastPage: "",
    pageOffset: "",
    path: "",
    query: "",
  };

  componentDidMount() {
    let currentPage;
    let { path, query, lastPage, pageOffset } = this.props;

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

    if (!lastPage) {
      lastPage = currentPage;
    }

    this.setState({
      currentPage: currentPage,
      lastPage,
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

  createPageLink = (page) => {
    return (
      page > 0 &&
      page <= this.state.lastPage && (
        <a key={page} href={this.createHref(page)}>
          {page}
        </a>
      )
    );
  };

  render() {
    const { currentPage, pageOffset } = this.state;
    const previousPages = [...new Array(pageOffset).keys()].map(
      (i) => currentPage - pageOffset + i
    );
    const nextPages = [...new Array(pageOffset).keys()].map(
      (i) => currentPage + i + 1
    );

    return (
      <section className="pagination">
        <span className="pages">{previousPages.map(this.createPageLink)}</span>
        <span className="pages">{this.createPageLink(currentPage)}</span>
        <span className="pages">{nextPages.map(this.createPageLink)}</span>
      </section>
    );
  }
}

export default Pagination;
