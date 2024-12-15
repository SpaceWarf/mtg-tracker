import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";

type OwnProps = {
  highlighted: boolean;
  direction: "asc" | "desc";
};

export function SortHighlightIcon({ highlighted, direction }: OwnProps) {
  return (
    highlighted && (
      <>
        {direction === "asc" && <CaretUpIcon width="20px" height="20px" />}
        {direction === "desc" && <CaretDownIcon width="20px" height="20px" />}
      </>
    )
  );
}
