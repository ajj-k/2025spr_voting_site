import { HashRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/ayapo" element={<App />}></Route>
      </Routes>
    </StrictMode>
  </HashRouter>
);
