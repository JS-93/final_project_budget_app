import React from "react";
import App from "./components/App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom'
import store from "./store/store";
import { Provider } from "react-redux";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
<Provider store={store}>
<Router>
<App />
</Router>
</Provider>);
