import { Box, Button, Flex } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useGameChangers } from "../../hooks/useGameChangers";
import { useGames } from "../../hooks/useGames";
import { useMousePosition } from "../../hooks/useMousePosition";
import { DeckService } from "../../services/Deck";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { DeckWithStats } from "../../state/Deck";
import { DeckVersion } from "../../state/DeckVersion";
import { mergeVersions } from "../../utils/Deck";
import { DataCard } from "../Common/DataCard";
import { Icon } from "../Common/Icon";
import { VersionSelect } from "../Common/Select/VersionSelect";
import { DeckVersionViewer } from "./DeckVersionViewer";

type OwnProps = {
  deck: DeckWithStats;
};

export function DeckVersionManagerSection({ deck }: OwnProps) {
  const navigate = useNavigate();
  const mousePosition = useMousePosition();
  const { gameChangers } = useGameChangers();
  const { dbGames } = useGames();

  const [merging, setMerging] = useState<boolean>(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [previewVersions, setPreviewVersions] = useState<DeckVersion[] | null>(
    null
  );

  const areVersionsContinuous = useMemo(() => {
    if (
      !deck ||
      !deck.versions ||
      deck.versions.length === 0 ||
      selectedVersions.length <= 1
    ) {
      return false;
    }

    const indices: number[] = selectedVersions
      .map((id) => (deck.versions || []).findIndex((v) => v.id === id))
      .sort((a, b) => a - b);

    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        return false;
      }
    }

    return true;
  }, [deck, selectedVersions]);

  const usedVersion = useMemo(() => {
    return selectedVersions.find((version) =>
      dbGames?.some(
        (game) =>
          game.player1.deckVersion === version ||
          game.player2.deckVersion === version ||
          game.player3.deckVersion === version ||
          game.player4.deckVersion === version
      )
    );
  }, [dbGames, selectedVersions]);

  const canMerge = useMemo(() => {
    return areVersionsContinuous && !usedVersion;
  }, [areVersionsContinuous, usedVersion]);

  function handlePreviewMerge() {
    if (!deck || !deck.versions) {
      return;
    }

    if (selectedVersions.includes("initial")) {
      setPreviewVersions(
        deck.versions.filter(
          (version) => !selectedVersions.includes(version.id)
        )
      );
      return;
    }

    const versionsToAggregate = deck.versions.filter((v) =>
      selectedVersions.includes(v.id)
    );
    const mergedVersion = mergeVersions(versionsToAggregate);
    let updatedVersions = [];

    if (
      mergedVersion.cardDiff.added.length === 0 &&
      mergedVersion.cardDiff.removed.length === 0
    ) {
      updatedVersions = deck.versions.filter(
        (v) => !selectedVersions.includes(v.id)
      );
    } else {
      updatedVersions = [
        ...deck.versions.slice(
          0,
          deck.versions.findIndex((v) => v.id === selectedVersions[0])
        ),
        mergedVersion,
        ...deck.versions.slice(
          deck.versions.findIndex((v) => v.id === selectedVersions[0]) +
            versionsToAggregate.length
        ),
      ];
    }

    setPreviewVersions(updatedVersions);
  }

  async function handleConfirmMerge() {
    if (!deck || !previewVersions) {
      return;
    }

    setMerging(true);
    await DeckService.update(deck.id, {
      ...deck,
      versions: previewVersions,
    });

    setMerging(false);
    navigate(0);
  }

  async function handleCancelMerge() {
    setPreviewVersions(null);
  }

  function handleVersionChange(value: string[]) {
    setSelectedVersions(
      value.sort((a, b) => {
        const indexA = (deck.versions || []).findIndex((v) => v.id === a);
        const indexB = (deck.versions || []).findIndex((v) => v.id === b);
        return indexA - indexB;
      })
    );
    setPreviewVersions(null);
  }

  return (
    <DataCard title="Version Manager" icon={<Icon icon="code-pull-request" />}>
      <Flex direction="column" gap="5">
        <Flex gap="5" mb="3" wrap="wrap">
          <Box width={{ initial: "100%", xs: "300px" }}>
            <p className="field-label mb-1">Version to merge</p>
            <VersionSelect
              deckId={deck.id}
              value={selectedVersions}
              onChange={handleVersionChange}
              isMulti={true}
              disabled={merging}
            />
            {!areVersionsContinuous && selectedVersions.length > 1 && (
              <p className="text-warning mt-1">
                Selected versions are not continuous.
              </p>
            )}
            {usedVersion && (
              <p className="text-warning mt-1">
                Version{" "}
                {(deck.versions || []).findIndex(
                  (version) => version.id === usedVersion
                ) + 2}{" "}
                is used in games and cannot be merged.
              </p>
            )}
          </Box>
          <Button
            className="h-10"
            mt={{ initial: "0", xs: "24px" }}
            onClick={handlePreviewMerge}
            disabled={!canMerge || merging || !!previewVersions}
          >
            <Icon icon="eye" />
            Preview Merge
          </Button>
          {previewVersions && (
            <Flex gap="5">
              <Button
                className="h-10"
                mt={{ initial: "0", xs: "24px" }}
                onClick={handleConfirmMerge}
                disabled={merging}
                loading={merging}
              >
                <Icon icon="code-pull-request" />
                Confirm Merge
              </Button>
              <Button
                className="h-10"
                mt={{ initial: "0", xs: "24px" }}
                variant="outline"
                onClick={handleCancelMerge}
                disabled={merging}
              >
                <Icon icon="xmark" />
                Cancel
              </Button>
            </Flex>
          )}
        </Flex>
        {previewVersions && (
          <DeckVersionViewer
            deck={{
              ...deck,
              versions: previewVersions,
            }}
            sortCardsBy={CardSortFctKey.NAME_ASC}
            mousePosition={mousePosition}
            gameChangers={gameChangers}
            preview
          />
        )}
        {deck.versions && (
          <DeckVersionViewer
            deck={deck}
            sortCardsBy={CardSortFctKey.NAME_ASC}
            mousePosition={mousePosition}
            gameChangers={gameChangers}
          />
        )}
        {!deck.versions && <p>No versions to manage.</p>}
      </Flex>
    </DataCard>
  );
}
