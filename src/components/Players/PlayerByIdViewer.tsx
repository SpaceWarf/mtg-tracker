import {
  faDice,
  faHeart,
  faLayerGroup,
  faLeftLong,
  faPen,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Spinner,
  Tooltip,
} from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDecks } from "../../hooks/useDecks";
import { useGames } from "../../hooks/useGames";
import { usePlayers } from "../../hooks/usePlayers";
import { ArchidektService } from "../../services/Archidekt";
import { populatePlayer } from "../../utils/Player";
import { CommanderPreview } from "../Common/CommanderPreview";
import { DataCard } from "../Common/DataCard";
import { PlayerDeleteModal } from "./PlayerDeleteModal";
import { PlayerEditModal } from "./PlayerEditModal";
import { PlayerShowcase } from "./PlayerShowcase";
import { PlayerStatsSection } from "./PlayerStatsSection";

export function PlayerByIdViewer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { dbPlayers, loadingPlayers } = usePlayers();
  const { dbGames, loadingGames } = useGames();
  const { dbDecks, loadingDecks } = useDecks();

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const player = useMemo(() => {
    return dbPlayers?.find((player) => player.id === id);
  }, [dbPlayers, id]);

  const populatedPlayer = useMemo(() => {
    if (!player || !dbGames || !dbDecks) {
      return undefined;
    }
    return populatePlayer(player, dbGames, dbDecks);
  }, [player, dbGames, dbDecks]);

  const loading = useMemo(() => {
    return loadingPlayers || loadingGames || loadingDecks;
  }, [loadingPlayers, loadingGames, loadingDecks]);

  function handleSearchGames() {
    navigate(`/?players=${player?.id}`);
  }

  function handleSearchDecks() {
    navigate(`/decks?builder=${player?.id}`);
  }

  function handleArchidekt() {
    window.open(
      ArchidektService.getPlayerProfileUrl(player?.externalId ?? ""),
      "_blank"
    );
  }

  function handleEdit() {
    setEditModalOpen(true);
  }

  function handleDelete() {
    setDeleteModalOpen(true);
  }

  if (loading || !populatedPlayer) {
    return <Spinner mt="5" size="3" />;
  }

  return (
    <>
      {editModalOpen && (
        <PlayerEditModal
          open={editModalOpen}
          player={populatedPlayer}
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <PlayerDeleteModal
          open={deleteModalOpen}
          player={populatedPlayer}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}

      <div className="player-by-id-viewer p-5 w-full max-w-[1750px]">
        <Grid columns="1" gap="5">
          <DataCard direction="row">
            <Flex width="100%" gap="5" justify="between" wrap="wrap">
              <Flex gap="3">
                <Link to="/players">
                  <Button variant="soft" color="gray" size="3">
                    <FontAwesomeIcon icon={faLeftLong} />
                    Back
                  </Button>
                </Link>
              </Flex>

              <Flex gap="2" justify="end">
                <Tooltip content="View All Games">
                  <IconButton
                    variant="soft"
                    color="gray"
                    size="3"
                    onClick={handleSearchGames}
                  >
                    <FontAwesomeIcon icon={faDice} />
                  </IconButton>
                </Tooltip>
                <Tooltip content="View All Decks">
                  <IconButton
                    variant="soft"
                    color="gray"
                    size="3"
                    onClick={handleSearchDecks}
                  >
                    <FontAwesomeIcon icon={faLayerGroup} />
                  </IconButton>
                </Tooltip>
                {populatedPlayer.externalId && (
                  <Tooltip content="Open on Archidekt">
                    <IconButton
                      variant="soft"
                      color="gray"
                      size="3"
                      onClick={handleArchidekt}
                    >
                      <img
                        src="/img/logos/archidekt.webp"
                        width="18"
                        height="18"
                      />
                    </IconButton>
                  </Tooltip>
                )}
                {!!user && (
                  <Tooltip content="Edit Player">
                    <IconButton
                      variant="soft"
                      color="gray"
                      size="3"
                      onClick={handleEdit}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                  </Tooltip>
                )}
                {!!user && (
                  <Tooltip content="Delete Player">
                    <IconButton
                      variant="soft"
                      color="red"
                      size="3"
                      onClick={handleDelete}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Tooltip>
                )}
              </Flex>
            </Flex>
          </DataCard>

          <Grid gap="5" columns={{ initial: "1", sm: "5", lg: "7" }}>
            <Box gridColumn={{ initial: "span 1", sm: "span 2", lg: "span 2" }}>
              <div className="w-full">
                <PlayerShowcase player={populatedPlayer} />
              </div>
            </Box>

            <Grid
              gap="5"
              columns="1"
              gridColumn={{ initial: "span 1", sm: "span 3", lg: "span 5" }}
            >
              <PlayerStatsSection player={populatedPlayer} />
              {populatedPlayer.deckPlayedMap.size > 0 && (
                <DataCard
                  title="Most Played Decks"
                  icon={<FontAwesomeIcon icon={faHeart} />}
                >
                  <Flex justify="center">
                    <Grid
                      gap="5"
                      columns={{
                        initial: "1",
                        xs: "2",
                        lg: "4",
                        xl: "5",
                      }}
                    >
                      {Array.from(populatedPlayer.deckStatsMap.entries())
                        .sort(
                          (a, b) =>
                            b[1].played - a[1].played ||
                            b[1].won - a[1].won ||
                            a[1].lost - b[1].lost
                        )
                        .slice(0, 5)
                        .map(([deck, stats]) => (
                          <CommanderPreview
                            key={deck}
                            deck={deck}
                            won={stats.won}
                            lost={stats.lost}
                            good
                          />
                        ))}
                    </Grid>
                  </Flex>
                </DataCard>
              )}
              {populatedPlayer.deckStatsMap.size > 0 && (
                <DataCard
                  title="Best Decks"
                  icon={<FontAwesomeIcon icon={faStar} />}
                >
                  <Flex justify="center">
                    <Grid
                      gap="5"
                      columns={{
                        initial: "1",
                        xs: "2",
                        lg: "4",
                        xl: "5",
                      }}
                    >
                      {Array.from(populatedPlayer.deckStatsMap.entries())
                        .sort(
                          (a, b) =>
                            b[1].winRate - a[1].winRate ||
                            b[1].played - a[1].played ||
                            a[1].lost - b[1].lost
                        )
                        .slice(0, 5)
                        .map(([deck, stats]) => (
                          <CommanderPreview
                            key={deck}
                            deck={deck}
                            won={stats.won}
                            lost={stats.lost}
                            good
                          />
                        ))}
                    </Grid>
                  </Flex>
                </DataCard>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
