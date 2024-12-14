import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./assets/styles/index.scss";
import { Header } from "./components/Header.tsx";
import { PageWrapper } from "./components/PageWrapper.tsx";
import { Games } from "./pages/Games.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="blue" grayColor="slate">
      <QueryClientProvider client={queryClient}>
        <div id="mtg-tracker">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Games />
                  </PageWrapper>
                }
              />
              <Route path="/players" element={<Header></Header>} />
              <Route path="/decks" element={<Header></Header>} />
            </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </Theme>
  </StrictMode>
);
