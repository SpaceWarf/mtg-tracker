import { faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@radix-ui/themes";

export function GameStartIcon() {
  return (
    <Tooltip content="Started the game">
      <FontAwesomeIcon icon={faDice} />
    </Tooltip>
  );
}
