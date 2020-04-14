import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar";
import Landing from "./components/landing";
import Posts from "./components/posts";
import Post from "./components/post";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route path="/posts/:id" component={Post} />
        <Route path="/posts" component={Posts} />
        <Route path="/" component={Landing} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
