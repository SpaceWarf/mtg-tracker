import { Flex } from "@radix-ui/themes";
import "../../assets/styles/PieChart.scss";

type OwnProps = {
  label: string;
  value: number;
  colour: string;
  size?: string;
  thickness?: string;
  animate?: boolean;
};

export function PieChart({
  value,
  colour,
  label,
  animate = true,
  size = "100px",
  thickness = "15px",
}: OwnProps) {
  return (
    <div
      className={`pie ${animate ? "animate" : ""}`}
      style={
        {
          ["--p" as string]: value,
          ["--c" as string]: colour,
          ["--w" as string]: size,
          ["--b" as string]: thickness,
        } as React.CSSProperties
      }
    >
      <Flex direction="column" align="center" gap="1">
        <p className="win-percent">{value}%</p>
        <p className="win-percent-label">{label}</p>
      </Flex>
    </div>
  );
}
