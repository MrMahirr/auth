import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

import { PrimeReactProvider } from "primereact/api";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <PrimeReactProvider>
                <App />
            </PrimeReactProvider>
        </BrowserRouter>
    </React.StrictMode>
);



