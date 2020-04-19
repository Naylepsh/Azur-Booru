import React from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "./components/Navbar/navbar";
import Landing from "./components/Landing/landing";
import Posts from "./components/Posts/posts";
import Post from "./components/Posts/post";
import PostForm from "./components/Posts/postForm";
import RegisterForm from "./components/User/registerForm";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route path="/posts/new" component={PostForm} />
        <Route path="/posts/:id/edit" component={PostForm} />
        <Route path="/posts/:id" component={Post} />
        <Route path="/posts" component={Posts} />
        <Route path="/user/register" component={RegisterForm} />
        <Route path="/" component={Landing} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
