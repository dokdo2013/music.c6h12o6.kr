import React from "react";
import ReactDOM from "react-dom";
import "./Fonts.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import Test from './Test';
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
