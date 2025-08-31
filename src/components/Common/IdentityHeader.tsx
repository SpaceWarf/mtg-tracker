import { Flex } from "@radix-ui/themes";
import { ManaIcon } from "../Icons/ManaIcon";

type OwnProps = {
  label: string;
};

export function IdentityHeader({ label }: OwnProps) {
  return (
    <Flex gap="2" align="center">
      <span>{label.split(" ")[0]}</span>
      <Flex gap="1">
        {label
          .split(" ")[1]
          .replaceAll(/\(|\)/g, "")
          .split("")
          .map((colour) => (
            <ManaIcon colour={colour} size="small" />
          ))}
      </Flex>
    </Flex>
  );
}
