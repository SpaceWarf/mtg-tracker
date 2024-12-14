import { faRing } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@radix-ui/themes";

export function SolRingIcon() {
  return (
    <Tooltip content="Played a turn 1 Sol Ring">
      <FontAwesomeIcon icon={faRing} />
    </Tooltip>
  );
}
