import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@radix-ui/themes";

export function GameWonIcon() {
  return (
    <Tooltip content="Won the game">
      <FontAwesomeIcon color="gold" icon={faCrown} />
    </Tooltip>
  );
}
