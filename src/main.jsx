import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

function genId(prefix) {
  return `${prefix}_${Date.now().toString(36).toUpperCase()}`;
}

window.addEventListener("error", (event) => {
  const id = genId("ERR_GLOBAL");
  console.error(`[${id}] Erro global não tratado:`, {
    message: event.message,
    source:  event.filename,
    line:    event.lineno,
    col:     event.colno,
    error:   event.error,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  const id = genId("ERR_PROMISE");
  console.error(`[${id}] Promise rejeitada sem tratamento:`, event.reason);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
