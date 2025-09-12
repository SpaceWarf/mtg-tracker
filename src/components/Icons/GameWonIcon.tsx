import { Tooltip } from "@radix-ui/themes";
import { Icon } from "../Common/Icon";

export function GameWonIcon() {
  return (
    <Tooltip content="Won">
      <Icon color="gold" icon="crown" />
    </Tooltip>
  );
}
