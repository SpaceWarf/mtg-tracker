import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./assets/styles/index.scss";
import { Games } from "./pages/Games.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="blue" grayColor="gray">
      <QueryClientProvider client={queryClient}>
        <div id="mtg-tracker" className="p-5">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Games />} />
            </Routes>
          </BrowserRouter>
          {/* <ThemePanel></ThemePanel> */}
        </div>
      </QueryClientProvider>
    </Theme>
  </StrictMode>
);
