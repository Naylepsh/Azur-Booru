import React from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/Navbar/navbar";
import Landing from "./components/Landing/landing";
import Posts from "./components/Posts/posts";
import Post from "./components/Posts/post";
import PostForm from "./components/Posts/postForm";
import RegisterForm from "./components/User/registerForm";
import LoginForm from "./components/User/loginForm";
import Logout from "./components/User/logout";
import Comments from "./components/Comments/comments";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        {/* Random key as a way to force page reloading */}
        <Route path="/posts/new" component={PostForm} key={Math.random()} />
        <Route path="/posts/:id/edit" component={PostForm} />
        <Route path="/posts/:id" component={Post} />
        <Route path="/posts" component={Posts} />
        <Route path="/comments" component={Comments} />
        <Route path="/users/register" component={RegisterForm} />
        <Route path="/users/login" component={LoginForm} />
        <Route path="/users/logout" component={Logout} />
        <Route path="/" component={Landing} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
