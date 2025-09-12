import { Flex, IconButton } from "@radix-ui/themes";
import { ReactElement, useEffect, useState } from "react";
import { Icon } from "../Common/Icon";
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
            {mute ? <Icon icon="volume-xmark" /> : <Icon icon="volume-high" />}
          </IconButton>
          <IconButton
            onClick={handleCancel}
            variant="surface"
            size="1"
            radius="full"
          >
            <Icon icon="xmark" />
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
          <Icon icon="caret-left" />
        </IconButton>
        <Flex>
          {Array(pageCount)
            .fill("")
            .map((_, idx) =>
              idx === page ? (
                <Icon icon="circle-fill" key={idx} size="xs" />
              ) : (
                <Icon icon="circle" key={idx} size="xs" />
              )
            )}
        </Flex>
        <IconButton
          disabled={page >= pageCount - 1}
          onClick={onNext}
          variant="ghost"
          size="1"
        >
          <Icon icon="caret-right" />
        </IconButton>
      </Flex>
      {children}
    </div>
  );
}
