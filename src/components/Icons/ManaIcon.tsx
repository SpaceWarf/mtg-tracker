import { useMemo } from "react";
import black from "/img/mana/B.png";
import green from "/img/mana/G.png";
import red from "/img/mana/R.png";
import blue from "/img/mana/U.png";
import white from "/img/mana/W.png";

type OwnProps = {
  colour: string;
  size?: "large" | "small";
};

export function ManaIcon({ colour, size = "large" }: OwnProps) {
  const src = useMemo(() => {
    switch (colour) {
      case "White":
        return white;
      case "Blue":
        return blue;
      case "Black":
        return black;
      case "Red":
        return red;
      case "Green":
        return green;
    }
  }, [colour]);

  return (
    <img
      width={size === "large" ? "18" : "14"}
      height={size === "large" ? "18" : "14"}
      src={src}
      alt={colour}
    />
  );
}
