import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { LoadScript } from "@react-google-maps/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_PLACES_API}
          libraries={["places"]}
        >
          <App />
        </LoadScript>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
