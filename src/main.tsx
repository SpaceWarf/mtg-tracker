import { Theme } from "@radix-ui/themes";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import "./assets/styles/index.scss";
import "./assets/styles/tailwind.css";
import { Alert } from "./components/Alert.tsx";
import { AlertProvider } from "./contexts/AlertProvider.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { DataProvider } from "./contexts/DataProvider.tsx";
import { Brackets } from "./pages/Brackets.tsx";
import { DeckById } from "./pages/DeckById.tsx";
import { Decks } from "./pages/Decks.tsx";
import { DeckValidator } from "./pages/DeckValidator.tsx";
import { GameChangers } from "./pages/GameChangers.tsx";
import { Games } from "./pages/Games.tsx";
import { PlayerById } from "./pages/PlayerById.tsx";
import { Players } from "./pages/Players.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Main() {
  return (
    <Theme appearance="dark" accentColor="blue" grayColor="slate" scaling="90%">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DataProvider>
            <AlertProvider>
              <div id="mtg-tracker">
                <Alert />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Games />} />
                    <Route path="/players" element={<Players />} />
                    <Route path="/players/:id" element={<PlayerById />} />
                    <Route path="/decks" element={<Decks />} />
                    <Route path="/decks/:id" element={<DeckById />} />
                    <Route path="/game-changers" element={<GameChangers />} />
                    <Route path="/deck-validator" element={<DeckValidator />} />
                    <Route path="/brackets" element={<Brackets />} />
                    {/* <Route path="/rewind" element={<Rewind />} /> */}
                  </Routes>
                </BrowserRouter>
              </div>
            </AlertProvider>
          </DataProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Theme>
  );
}

createRoot(document.getElementById("root")!).render(<Main />);
