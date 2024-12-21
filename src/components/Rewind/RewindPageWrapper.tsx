import {
  CaretLeftIcon,
  CaretRightIcon,
  Cross2Icon,
  DotFilledIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import { Flex, IconButton } from "@radix-ui/themes";
import { ReactElement, useEffect } from "react";

type OwnProps = {
  page: number;
  pageCount: number;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  children: ReactElement;
};

const TIMINGS: { [key: number]: number } = {
  0: 5000,
  1: 5000,
  2: 8000,
  3: 10000,
  4: 5000,
  5: 10000,
};

export function RewindPageWrapper({
  page,
  pageCount,
  onCancel,
  onPrevious,
  onNext,
  children,
}: OwnProps) {
  useEffect(() => {
    const lastEl = document.getElementById("AnimationEndTrigger");

    if (lastEl) {
      lastEl.addEventListener("animationend", () => {
        setTimeout(onNext, TIMINGS[page]);
      });
    }
  }, [page, onNext]);

  return (
    <div className="RewindPageWrapper relative">
      <div className="absolute right-3 top-3 z-10">
        <IconButton onClick={onCancel} variant="surface" size="1" radius="full">
          <Cross2Icon width="15" height="15" />
        </IconButton>
      </div>
      <Flex
        className="RewindPaginator absolute bottom-0 w-full px-3 py-1 z-10"
        justify="between"
        align="center"
      >
        <IconButton
          disabled={page <= 0}
          onClick={onPrevious}
          variant="ghost"
          size="1"
        >
          <CaretLeftIcon width="18" height="18" />
        </IconButton>
        <Flex>
          {Array(pageCount)
            .fill("")
            .map((_, idx) =>
              idx === page ? (
                <DotFilledIcon key={idx} width="10px" height="10px" />
              ) : (
                <DotIcon key={idx} width="10px" height="10px" />
              )
            )}
        </Flex>
        <IconButton
          disabled={page >= pageCount - 1}
          onClick={onNext}
          variant="ghost"
          size="1"
        >
          <CaretRightIcon width="18" height="18" />
        </IconButton>
      </Flex>
      {children}
    </div>
  );
}
