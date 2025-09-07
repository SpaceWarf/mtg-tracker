import { faCodePullRequest, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cross2Icon, TextAlignMiddleIcon } from "@radix-ui/react-icons";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
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
import { VersionSelect } from "../Select/VersionSelect";
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

  return (
    <DataCard
      title="Version Manager"
      icon={<FontAwesomeIcon icon={faCodePullRequest} />}
    >
      <Flex direction="column" gap="5">
        <Flex gap="5" mb="3">
          <Flex direction="column" width="300px">
            <Heading className="mb-1" size="3">
              Version to merge
            </Heading>
            <VersionSelect
              deckId={deck.id}
              value={selectedVersions}
              onChange={setSelectedVersions}
              isMulti={true}
              disabled={merging}
            />
            {!areVersionsContinuous && selectedVersions.length > 1 && (
              <Text size="1" color="red" className="mt-1">
                Selected versions are not continuous.
              </Text>
            )}
            {usedVersion && (
              <Text size="1" color="red" className="mt-1">
                Version{" "}
                {(deck.versions || []).findIndex(
                  (version) => version.id === usedVersion
                ) + 2}{" "}
                is used in games and cannot be merged.
              </Text>
            )}
          </Flex>
          <Button
            className="h-10 mt-[24px]"
            onClick={handlePreviewMerge}
            disabled={!canMerge || merging || !!previewVersions}
          >
            <FontAwesomeIcon icon={faEye} />
            Preview Merge
          </Button>
          {previewVersions && (
            <Flex gap="5">
              <Button
                className="h-10 mt-[24px]"
                onClick={handleConfirmMerge}
                disabled={merging}
                loading={merging}
              >
                <TextAlignMiddleIcon />
                Confirm Merge
              </Button>
              <Button
                className="h-10 mt-[24px]"
                variant="outline"
                onClick={handleCancelMerge}
                disabled={merging}
              >
                <Cross2Icon />
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
        {!deck.versions && <Text>No versions to manage.</Text>}
      </Flex>
    </DataCard>
  );
}
