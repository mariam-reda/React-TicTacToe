// File bridges between React component (App.js) and web browser

//import React library; ReactDOM to communicate w/ browser; component styles; created components
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

//create root element + inject React components into HTML file
const root = createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);