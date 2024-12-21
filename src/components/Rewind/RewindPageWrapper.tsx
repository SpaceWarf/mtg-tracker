import {
  CaretLeftIcon,
  CaretRightIcon,
  Cross2Icon,
  DotFilledIcon,
  DotIcon,
  SpeakerLoudIcon,
  SpeakerOffIcon,
} from "@radix-ui/react-icons";
import { Flex, IconButton } from "@radix-ui/themes";
import { ReactElement, useEffect, useState } from "react";
import soundfile from "/audio/last-christmas.mp3";

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
  const [audio] = useState(new Audio(soundfile));
  const [mute, setMute] = useState<boolean>(false);

  useEffect(() => {
    audio.volume = 0.02;
    audio.play();

    return () => {
      audio.pause();
    };
  }, [audio]);

  useEffect(() => {
    if (mute) {
      audio.volume = 0;
    } else {
      audio.volume = 0.02;
    }
  }, [mute, audio]);

  useEffect(() => {
    const lastEl = document.getElementById("AnimationEndTrigger");

    if (lastEl) {
      lastEl.addEventListener("animationend", () => {
        setTimeout(onNext, TIMINGS[page]);
      });
    }
  }, [page, onNext]);

  function handleCancel() {
    audio.pause();
    onCancel();
  }

  function toggleMute() {
    setMute(!mute);
  }

  return (
    <div className="RewindPageWrapper relative">
      <div className="absolute right-3 top-3 z-10">
        <Flex gap="2">
          <IconButton
            onClick={toggleMute}
            variant="surface"
            size="1"
            radius="full"
          >
            {mute ? (
              <SpeakerOffIcon width="12" height="12" />
            ) : (
              <SpeakerLoudIcon width="12" height="12" />
            )}
          </IconButton>
          <IconButton
            onClick={handleCancel}
            variant="surface"
            size="1"
            radius="full"
          >
            <Cross2Icon width="15" height="15" />
          </IconButton>
        </Flex>
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
