import "@assets/styles/Rewind.scss";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Flex, Heading, Select, Spinner } from "@radix-ui/themes";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { RewindPage1 } from "./RewindPage1";
import { RewindPage2 } from "./RewindPage2";
import { RewindPage3 } from "./RewindPage3";
import { RewindPage4 } from "./RewindPage4";
import { RewindPage5 } from "./RewindPage5";
import { RewindPage6 } from "./RewindPage6";
import { RewindPage7 } from "./RewindPage7";
import { RewindPage8 } from "./RewindPage8";
import { RewindPageWrapper } from "./RewindPageWrapper";

const PAGES = [
  RewindPage1,
  RewindPage2,
  RewindPage3,
  RewindPage4,
  RewindPage5,
  RewindPage6,
  RewindPage7,
  RewindPage8,
];

export function RewindViewer() {
  const { dbGames, loadingGames } = useGames();
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbDecks, loadingDecks } = useDecks();
  const [player, setPlayer] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  function handleStartRewind() {
    setStarted(true);
  }

  function handlePreviousPage() {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  function handleNextPage() {
    if (page < PAGES.length - 1) {
      setPage(page + 1);
    }
  }

  function handleCancel() {
    setStarted(false);
    setPage(0);
  }

  if (loadingGames || loadingPlayers || loadingDecks) {
    return <Spinner className="mt-5" size="3" />;
  }

  if (started && dbPlayers && dbGames && dbDecks) {
    const viewer = dbPlayers.find((dbPlayer) => dbPlayer.id === player);
    const Component = PAGES[page];

    return viewer ? (
      <RewindPageWrapper
        page={page}
        pageCount={PAGES.length}
        onCancel={handleCancel}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      >
        <Component
          viewer={viewer}
          players={dbPlayers}
          games={dbGames}
          decks={dbDecks}
        />
      </RewindPageWrapper>
    ) : (
      <p>Something went wrong...</p>
    );
  }

  return (
    <Flex
      className="RewindWrapper p-5"
      direction="column"
      align="center"
      justify="center"
      gap="5"
    >
      <Flex direction="column" justify="center">
        <Heading size="6" className="mb-1">
          Who is watching?
        </Heading>
        <Select.Root
          size="3"
          value={player}
          onValueChange={(value) => setPlayer(value)}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              {cloneDeep(dbPlayers)
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((player) => (
                  <Select.Item key={player.id} value={player.id}>
                    {player.name}
                  </Select.Item>
                ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Button size="3" disabled={!player} onClick={handleStartRewind}>
        <FontAwesomeIcon icon={faFilm} />
        Watch!
      </Button>
    </Flex>
  );
}
