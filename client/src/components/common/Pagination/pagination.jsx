import React, { Component } from "react";
import queryString from "query-string";

const default_page_offset = 5;

class Pagination extends Component {
  state = {
    currentPage: "",
    lastPage: "",
    pageOffset: "",
  };

  componentDidMount() {
    let currentPage;
    let lastPage;
    let pageOffset;

    const { query } = this.props;
    if (!query) {
      currentPage = 1;
      lastPage = currentPage;
      pageOffset = default_page_offset;
    } else {
      let currentPage = queryString.parse(this.props.query).page;
      if (!currentPage) {
        currentPage = 1;
      }

      lastPage = this.props.lastPage;
      if (!lastPage) {
        lastPage = currentPage;
      }

      pageOffset = this.props.pageOffset;
      if (!pageOffset) {
        pageOffset = default_page_offset;
      }
    }

    this.setState({ currentPage, lastPage, pageOffset });
  }

  createHref = (pageNumber) => {
    return `/posts?page=${pageNumber}`;
  };

  createPageLink = (page) => {
    return (
      page > 0 && (
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
      </section>
    );
  }
}

export default Pagination;
