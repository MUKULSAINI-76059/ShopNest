import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import {Provider} from "react-redux"
import store from "./redux/store";
import "./style/global.css"

const apiUrl = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const nativeFetch = window.fetch.bind(window);

window.fetch = (input, init) => {
  if (apiUrl && typeof input === "string" && input.startsWith("/api")) {
    return nativeFetch(`${apiUrl}${input}`, init);
  }

  return nativeFetch(input, init);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </Provider>,
);
