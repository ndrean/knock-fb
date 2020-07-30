import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import FBLogin from "./FBLogin";
//import LoginForm from "./LoginForm";
import MyNavBar from "./nav";
import * as serviceWorker from "./serviceWorker";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <MyNavBar />
    {/* <LoginForm /> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
