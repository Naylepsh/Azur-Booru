import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/navbar";
import Landing from "./components/landing";
import Posts from "./components/Posts/posts";
import Post from "./components/Posts/post";
import PostForm from "./components/Posts/postForm";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route path="/posts/new" component={PostForm} />
        <Route path="/posts/:id" component={Post} />
        <Route path="/posts" component={Posts} />
        <Route path="/" component={Landing} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
