import { Icon } from "../Common/Icon";

type OwnProps = {
  highlighted: boolean;
  direction: "asc" | "desc";
};

export function SortHighlightIcon({ highlighted, direction }: OwnProps) {
  return (
    highlighted && (
      <>
        {direction === "asc" && <Icon icon="caret-up" />}
        {direction === "desc" && <Icon icon="caret-down" />}
      </>
    )
  );
}
