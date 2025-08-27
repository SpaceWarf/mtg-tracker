import {
  Cross2Icon,
  EyeOpenIcon,
  TextAlignMiddleIcon,
} from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import "../../assets/styles/VersionManagerModal.scss";
import { useGameChangers } from "../../hooks/useGameChangers";
import { useMousePosition } from "../../hooks/useMousePosition";
import { DeckService } from "../../services/Deck";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { DbDeck } from "../../state/Deck";
import { DeckVersion } from "../../state/DeckVersion";
import { mergeVersions, populateDeck } from "../../utils/Deck";
import { DeckHeader } from "../Decks/DeckHeader";
import { DeckVersionViewer } from "../Decks/DeckVersionViewer";
import { VersionSelect } from "../Select/VersionSelect";

type OwnProps = {
  open: boolean;
  deck: DbDeck;
  onClose: () => void;
};

export function VersionManagerModal({ open, deck, onClose }: OwnProps) {
  const navigate = useNavigate();
  const mousePosition = useMousePosition();
  const { gameChangers } = useGameChangers();

  const [merging, setMerging] = useState<boolean>(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [previewVersions, setPreviewVersions] = useState<DeckVersion[] | null>(
    null
  );

  const populatedDeck = useMemo(() => {
    if (!deck) {
      return undefined;
    }
    return populateDeck(deck, [], gameChangers);
  }, [deck, gameChangers]);

  const hasVersions = useMemo(() => {
    return deck && deck.versions;
  }, [deck]);

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
      .map((id) => deck.versions?.findIndex((v) => v.id === id))
      .filter((idx): idx is number => idx !== -1)
      .sort((a, b) => a - b);

    for (let i = 1; i < indices.length; i++) {
      if (indices[i] !== indices[i - 1] + 1) {
        return false;
      }
    }

    return true;
  }, [deck, selectedVersions]);

  const canMerge = useMemo(() => {
    return hasVersions && areVersionsContinuous;
  }, [hasVersions, areVersionsContinuous]);

  useEffect(() => {
    setPreviewVersions(null);
  }, [selectedVersions]);

  function handlePreviewMerge() {
    if (!deck || !deck.versions) {
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

  function handleOpenChange(open: boolean): void {
    if (!open) {
      onClose();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Description></Dialog.Description>

      <Dialog.Content
        className="version-manager-modal"
        maxWidth="calc(100vw - 45px)"
      >
        <Dialog.Title></Dialog.Title>

        {deck && populatedDeck && (
          <>
            <Flex gap="5">
              <DeckHeader deck={populatedDeck} />
              <Flex gap="5" align="end" mb="3">
                <Flex
                  direction="column"
                  width="300px"
                  mb={
                    !areVersionsContinuous && selectedVersions.length > 1
                      ? "0"
                      : "19px"
                  }
                >
                  <Heading className="mb-1" size="3">
                    Version to merge
                  </Heading>
                  <VersionSelect
                    deckId={deck.id}
                    value={selectedVersions}
                    onChange={setSelectedVersions}
                    isMulti={true}
                    disabled={!hasVersions || merging}
                  />
                  {!areVersionsContinuous && selectedVersions.length > 1 && (
                    <Text size="1" color="red" className="mt-1">
                      Selected versions are not continuous.
                    </Text>
                  )}
                </Flex>
                <Button
                  className="h-10 mb-[19px]"
                  onClick={handlePreviewMerge}
                  disabled={!canMerge || merging || !!previewVersions}
                >
                  <EyeOpenIcon />
                  Preview Merge
                </Button>
                {previewVersions && (
                  <Flex gap="5">
                    <Button
                      className="h-10 mb-[19px]"
                      onClick={handleConfirmMerge}
                      disabled={merging}
                      loading={merging}
                    >
                      <TextAlignMiddleIcon />
                      Confirm Merge
                    </Button>
                    <Button
                      className="h-10 mb-[19px]"
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
            </Flex>
            {previewVersions && (
              <div className="preview-container mt-5">
                <Heading className="mb-3">Preview</Heading>
                <Flex justify="center">
                  <DeckVersionViewer
                    deck={{
                      ...deck,
                      versions: previewVersions,
                    }}
                    sortCardsBy={CardSortFctKey.NAME_ASC}
                    mousePosition={mousePosition}
                    gameChangers={gameChangers}
                  />
                </Flex>
              </div>
            )}
            {deck.versions && (
              <Flex className="mt-5" justify="center">
                <DeckVersionViewer
                  deck={deck}
                  sortCardsBy={CardSortFctKey.NAME_ASC}
                  mousePosition={mousePosition}
                  gameChangers={gameChangers}
                />
              </Flex>
            )}
            {!deck.versions && <Text>No versions to manage.</Text>}
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
