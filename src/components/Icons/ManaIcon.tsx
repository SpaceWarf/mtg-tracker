type OwnProps = {
  colour: string;
  size?: "large" | "small";
};

export function ManaIcon({ colour, size = "large" }: OwnProps) {
  function getSrc() {
    switch (colour) {
      case "White":
        return "/img/mana/W.svg";
      case "Blue":
        return "/img/mana/U.svg";
      case "Black":
        return "/img/mana/B.svg";
      case "Red":
        return "/img/mana/R.svg";
      case "Green":
        return "/img/mana/G.svg";
      default:
        return `/img/mana/${colour}.svg`;
    }
  }

  if (colour === "") {
    return <></>;
  }

  if (colour === "/") {
    return <span>//</span>;
  }

  return (
    <img
      width={size === "large" ? "18" : "14"}
      height={size === "large" ? "18" : "14"}
      src={getSrc()}
      alt={colour}
    />
  );
}
