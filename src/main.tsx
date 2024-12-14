import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.scss";
import { App } from "./pages/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="blue" grayColor="gray">
      <App />
      {/* <ThemePanel></ThemePanel> */}
    </Theme>
  </StrictMode>
);
