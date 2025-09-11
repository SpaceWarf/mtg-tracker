import { faDiceSix } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@radix-ui/themes";

export function GameStartIcon() {
  return (
    <Tooltip content="Started">
      <FontAwesomeIcon icon={faDiceSix} />
    </Tooltip>
  );
}
