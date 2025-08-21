import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useMemo } from "react";
import "../../assets/styles/DeckVersionViewer.scss";
import { CardDiff } from "../../state/CardDiff";
import { DbDeck } from "../../state/Deck";
import { DeckCardDetails } from "../../state/DeckDetails";
import { MousePosition } from "../../state/MousePosition";
import { getLongDateString } from "../../utils/Date";
import { CardDiffViewer } from "../Cards/CardDiffViewer";

type OwnProps = {
  deck: DbDeck;
  mousePosition: MousePosition;
  gameChangers: DeckCardDetails[];
  selectedVersionId: string;
  onClickVersion: (id: string) => void;
};

export function DeckVersionViewer({
  deck,
  mousePosition,
  gameChangers,
  selectedVersionId,
  onClickVersion,
}: OwnProps) {
  const versions = useMemo(() => {
    return deck.versions ?? [];
  }, [deck]);
  const latestIndex = useMemo(() => {
    return versions.length - 1;
  }, [versions]);
  const selectedIndex = useMemo(() => {
    if (selectedVersionId === "latest") {
      return latestIndex;
    }
    return (
      versions.findIndex((version) => version.id === selectedVersionId) - 1
    );
  }, [versions, selectedVersionId, latestIndex]);

  useEffect(() => {
    const el = document.querySelectorAll(".deck-version-viewer .rt-Card")[
      selectedIndex + 1
    ];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedIndex]);

  function getVersionDiff(index: number): CardDiff {
    return versions[index]?.cardDiff ?? { added: [], removed: [] };
  }

  function getVersionDate(index: number): string {
    return getLongDateString(versions[index]?.createdAt ?? "", false);
  }

  return (
    <Flex className="deck-version-viewer" overflow="scroll" pb="5">
      <div>
        <Card className={`w-[225px] ${selectedIndex === -1 ? "selected" : ""}`}>
          <Flex
            align="end"
            gap="2"
            mb="3"
            onClick={() => onClickVersion(versions[0].id)}
            style={{ cursor: "pointer" }}
          >
            <Heading>Version 1</Heading>
            <Text>{getLongDateString(deck.createdAt, false)}</Text>
          </Flex>
        </Card>
      </div>
      <div className="arrow-connector mt-6" />
      {versions.map((_, index) => (
        <>
          <div>
            <Card
              className={`w-[350px] ${
                index === selectedIndex ? "selected" : ""
              }`}
            >
              <Flex
                align="end"
                gap="2"
                mb="3"
                onClick={() =>
                  onClickVersion(versions[index + 1]?.id ?? "latest")
                }
                style={{ cursor: "pointer" }}
              >
                <Heading>Version {index + 2}</Heading>
                <Text>{getVersionDate(index)}</Text>
              </Flex>
              <CardDiffViewer
                added={getVersionDiff(index).added.map((diff) => ({
                  ...diff.card,
                  qty: diff.qty,
                }))}
                removed={getVersionDiff(index).removed.map((diff) => ({
                  ...diff.card,
                  qty: diff.qty,
                }))}
                mousePosition={mousePosition}
                gameChangers={gameChangers}
              />
            </Card>
          </div>
          {index !== latestIndex && <div className="arrow-connector mt-6" />}
        </>
      ))}
    </Flex>
  );
}
