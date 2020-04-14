import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar";
import Landing from "./components/landing";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Switch>
        <Route path="/" component={Landing} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
