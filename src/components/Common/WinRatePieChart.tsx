import { useMemo } from "react";
import { DeckWithStats } from "../../state/Deck";
import { PieChart } from "./PieChart";

type OwnProps = {
  deck: DeckWithStats;
  size?: "large" | "small";
};

export function WinRatePieChart({ deck, size = "small" }: OwnProps) {
  const winPercent = useMemo(() => {
    return Math.round(deck.winRate * 100);
  }, [deck.winRate]);

  const winPercentColour = useMemo(() => {
    if (winPercent < 25) {
      return "#d84242";
    }

    if (winPercent < 50) {
      return "orange";
    }

    return "green";
  }, [winPercent]);

  const pieSize = useMemo(() => {
    if (size === "large") {
      return "200px";
    }

    return "110px";
  }, [size]);

  const pieThickness = useMemo(() => {
    if (size === "large") {
      return "26px";
    }

    return "16px";
  }, [size]);

  return (
    <PieChart
      value={winPercent}
      colour={winPercentColour}
      label="Win Rate"
      size={pieSize}
      thickness={pieThickness}
    />
  );
}
