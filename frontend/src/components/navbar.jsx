import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="animenu">
      <Link className="navbar-brand" to="/">
        Azur-Booru
      </Link>
      <button className="animenu__btn">
        <Link id="mobile-menu-toggler">
          <i className="fas fa-bars"></i>
        </Link>
      </button>

      {/* <ul className="animenu__nav">
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
            href="#"
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
              <NavLink href="/logout" role="menuitem">
                Logout
              </NavLink>
            </li>
            <li>
              <NavLink href="/login" role="menuitem">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink href="/register" role="menuitem">
                Sign Up
              </NavLink>
            </li>
          </ul>
        </li>
      </ul> */}
    </nav>
  );
};

export default NavBar;
