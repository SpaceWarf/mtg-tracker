import { Theme } from "@radix-ui/themes";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./assets/styles/index.scss";
import { Header } from "./components/Header.tsx";
import { PageWrapper } from "./components/PageWrapper.tsx";
import { DataContext } from "./contexts/DataContext.tsx";
import { Games } from "./pages/Games.tsx";
import { DbDeck } from "./state/Deck.ts";
import { DbGame } from "./state/Game.ts";
import { DbPlayer } from "./state/Player.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Main() {
  const [games, setGames] = useState<DbGame[]>([]);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [decks, setDecks] = useState<DbDeck[]>([]);

  return (
    <StrictMode>
      <Theme
        appearance="dark"
        accentColor="blue"
        grayColor="slate"
        scaling="90%"
      >
        <QueryClientProvider client={queryClient}>
          <DataContext.Provider
            value={{ games, setGames, players, setPlayers, decks, setDecks }}
          >
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
          </DataContext.Provider>
        </QueryClientProvider>
      </Theme>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Main />);
