import { Tooltip } from "@radix-ui/themes";
import { Icon } from "../Common/Icon";

export function GameStartIcon() {
  return (
    <Tooltip content="Started">
      <Icon icon="dice-six" />
    </Tooltip>
  );
}
