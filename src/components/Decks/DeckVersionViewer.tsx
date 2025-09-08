import { ChevronUpIcon } from "@radix-ui/react-icons";
import { ChevronDownIcon, Flex } from "@radix-ui/themes";
import { useEffect, useMemo, useRef, useState } from "react";
import "../../assets/styles/DeckVersionViewer.scss";
import { CardDiff } from "../../state/CardDiff";
import { CardSortFctKey } from "../../state/CardSortFctKey";
import { CARD_SORT_FCTS } from "../../state/CardSortFcts";
import { DbDeck } from "../../state/Deck";
import { DeckCardDetails } from "../../state/DeckDetails";
import { MousePosition } from "../../state/MousePosition";
import { getLongDateString } from "../../utils/Date";
import { CardDiffViewer } from "../Cards/CardDiffViewer";

type OwnProps = {
  deck: DbDeck;
  sortCardsBy: CardSortFctKey;
  mousePosition: MousePosition;
  gameChangers: DeckCardDetails[];
  selectedVersionId?: string;
  preview?: boolean;
  onClickVersion?: (id: string) => void;
};

export function DeckVersionViewer({
  deck,
  sortCardsBy,
  mousePosition,
  gameChangers,
  selectedVersionId,
  preview,
  onClickVersion,
}: OwnProps) {
  const [overflowActive, setOverflowActive] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const overflowingDiv = useRef<HTMLDivElement | null>(null);

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
    ] as HTMLElement;

    if (el && overflowingDiv.current) {
      const divViewStart =
        overflowingDiv.current.offsetLeft + overflowingDiv.current.scrollLeft;
      const divViewEnd = divViewStart + overflowingDiv.current.clientWidth;
      const isInView =
        el.offsetLeft > divViewStart &&
        el.offsetLeft + el.clientWidth < divViewEnd;

      if (!isInView) {
        overflowingDiv.current.scrollTo({
          left:
            el.offsetLeft > overflowingDiv.current.scrollWidth
              ? el.offsetLeft + el.offsetWidth + 10
              : el.offsetLeft - 10,
        });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    function isOverflowing(divContainer: HTMLDivElement | null): boolean {
      if (divContainer)
        return divContainer.offsetHeight < divContainer.scrollHeight;
      return false;
    }

    if (isOverflowing(overflowingDiv.current)) {
      setOverflowActive(true);
    } else {
      setOverflowActive(false);
    }
  }, []);

  function getVersionDiff(index: number): CardDiff {
    return versions[index]?.cardDiff ?? { added: [], removed: [] };
  }

  function getVersionDate(index: number): string {
    return getLongDateString(versions[index]?.createdAt ?? "", false);
  }

  return (
    <div
      className={`deck-version-viewer-container ${preview ? "preview" : ""}`}
    >
      {preview && <p className="preview-heading mb-3">Preview</p>}
      <Flex
        ref={overflowingDiv}
        className={`deck-version-viewer ${expanded ? "expanded" : ""}`}
        pb="5"
      >
        <div>
          <div
            className={`version-card min-w-[250px] ${
              selectedIndex === -1 ? "selected" : ""
            } ${onClickVersion ? "selectable" : ""}`}
            onClick={() => onClickVersion?.(versions[0].id)}
          >
            <Flex align="end" gap="2">
              <p className="version-name">Version 1</p>
              <p className="version-date">
                {getLongDateString(deck.createdAt, false)}
              </p>
            </Flex>
          </div>
        </div>
        {deck.versions && deck.versions.length > 0 && (
          <div className="arrow-connector mt-6" />
        )}
        {versions.map((_, index) => (
          <Flex key={`version-${index}`}>
            <div>
              <div
                className={`version-card min-w-[250px] ${
                  index === selectedIndex ? "selected" : ""
                } ${onClickVersion ? "selectable" : ""}`}
                onClick={() =>
                  onClickVersion?.(versions[index + 1]?.id ?? "latest")
                }
              >
                <Flex align="end" gap="2" mb="3">
                  <p className="version-name">Version {index + 2}</p>
                  <p className="version-date">{getVersionDate(index)}</p>
                </Flex>
                <CardDiffViewer
                  added={getVersionDiff(index)
                    .added.map((diff) => ({
                      ...diff.card,
                      qty: diff.qty,
                    }))
                    .sort(
                      (a, b) =>
                        CARD_SORT_FCTS[sortCardsBy].sortFct(a, b) ||
                        a.name.localeCompare(b.name)
                    )}
                  removed={getVersionDiff(index)
                    .removed.map((diff) => ({
                      ...diff.card,
                      qty: diff.qty,
                    }))
                    .sort(
                      (a, b) =>
                        CARD_SORT_FCTS[sortCardsBy].sortFct(a, b) ||
                        a.name.localeCompare(b.name)
                    )}
                  mousePosition={mousePosition}
                  gameChangers={gameChangers}
                  direction="row"
                />
              </div>
            </div>
            {index !== latestIndex && <div className="arrow-connector mt-6" />}
          </Flex>
        ))}
      </Flex>
      {overflowActive && (
        <Flex
          className="expand"
          justify="center"
          align="center"
          onClick={() => setExpanded(!expanded)}
        >
          <Flex gap="2" align="center">
            {expanded ? (
              <p className="expand-text">see less</p>
            ) : (
              <p className="expand-text">see more</p>
            )}
            {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Flex>
        </Flex>
      )}
    </div>
  );
}
