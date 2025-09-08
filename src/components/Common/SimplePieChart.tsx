import { useMemo } from "react";
import { PieChart } from "./PieChart";

type OwnProps = {
  value: number;
  label: string;
  size?: "large" | "small";
  colours?: Record<string, string>;
};

export function SimplePieChart({
  value,
  label,
  size = "small",
  colours,
}: OwnProps) {
  const percent = useMemo(() => {
    return Math.round(value * 100);
  }, [value]);

  const winPercentColour = useMemo(() => {
    let match = "#5abe8c";

    if (colours) {
      Object.keys(colours)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .forEach((key) => {
          if (percent < parseInt(key)) {
            match = colours[key];
          }
        });
    }

    return match;
  }, [colours, percent]);

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
      value={percent}
      colour={winPercentColour}
      label={label}
      size={pieSize}
      thickness={pieThickness}
    />
  );
}
