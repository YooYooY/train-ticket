import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import "normalize.css/normalize.css";

import "./index.css";
import App from "./App";
import * as serviceWorker from "../serviceWorkerRegistration";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if ("production" === process.env.NODE_ENV) {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
