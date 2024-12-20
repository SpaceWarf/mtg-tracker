import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./assets/styles/index.scss";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { DataProvider } from "./contexts/DataProvider.tsx";
import { Decks } from "./pages/Decks.tsx";
import { Games } from "./pages/Games.tsx";
import { Players } from "./pages/Players.tsx";
import { Rewind } from "./pages/Rewind.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Main() {
  return (
    <StrictMode>
      <Theme
        appearance="dark"
        accentColor="blue"
        grayColor="slate"
        scaling="90%"
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <DataProvider>
              <div id="mtg-tracker">
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Games />} />
                    <Route path="/players" element={<Players />} />
                    <Route path="/decks" element={<Decks />} />
                    <Route path="/rewind" element={<Rewind />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </DataProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Theme>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Main />);
