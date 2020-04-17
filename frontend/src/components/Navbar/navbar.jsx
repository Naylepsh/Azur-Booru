import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./navbar.css";

class Navbar extends Component {
  state = {
    isNavActive: false,
  };

  handleNavToggle = () => {
    let { isNavActive } = this.state;
    isNavActive = !isNavActive;
    this.setState({ isNavActive });
  };

  getNavClass = () => {
    const { isNavActive } = this.state;
    return isNavActive ? "animenu__nav animenu__nav--active" : "animenu__nav";
  };

  render() {
    return (
      <nav className="animenu">
        <Link id="animenu__brand" to="/">
          Azur-Booru
        </Link>
        <button
          id="mobile-menu-toggler"
          className="animenu__btn"
          onClick={this.handleNavToggle}
        >
          <i className="fa fa-bars" aria-hidden="true"></i>
        </button>

        <ul className={this.getNavClass()}>
          <li>
            <Link
              to="/posts"
              className="animenu__nav__hasDropdown"
              aria-haspopup="true"
            >
              Posts
            </Link>
            <ul
              className="animenu__nav__dropdown"
              aria-label="submenu"
              role="menu"
            >
              <li>
                <NavLink to="/posts" role="menuitem">
                  List
                </NavLink>
              </li>
              <li>
                <NavLink to="/posts/new" role="menuitem">
                  Upload
                </NavLink>
              </li>
              <li>
                <NavLink to="/" role="menuitem">
                  Hot
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="/comments"
              className="animenu__nav__hasDropdown"
              aria-haspopup="true"
            >
              Comments
            </Link>
            <ul
              className="animenu__nav__dropdown"
              aria-label="submenu"
              role="menu"
            >
              <li>
                <NavLink to="/comments" role="menuitem">
                  List
                </NavLink>
              </li>
              <li>
                <NavLink to="/comments/search" role="menuitem">
                  Search
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="#"
              className="animenu__nav__hasDropdown"
              aria-haspopup="true"
            >
              Tags
            </Link>
            <ul
              className="animenu__nav__dropdown"
              aria-label="submenu"
              role="menu"
            >
              <li>
                <NavLink to="#" role="menuitem">
                  List
                </NavLink>
              </li>
              <li>
                <NavLink to="#" role="menuitem">
                  Search
                </NavLink>
              </li>
              <li>
                <NavLink to="#" role="menuitem">
                  Aliases
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <Link
              to="/"
              className="animenu__nav__hasDropdown"
              aria-haspopup="true"
            >
              My Account
            </Link>
            <ul
              className="animenu__nav__dropdown"
              aria-label="submenu"
              role="menu"
            >
              <li>
                <NavLink to="/logout" role="menuitem">
                  Logout
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" role="menuitem">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" role="menuitem">
                  Sign Up
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
