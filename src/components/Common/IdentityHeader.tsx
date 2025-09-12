import { Flex } from "@radix-ui/themes";
import { useMemo } from "react";
import { ManaIcon } from "./ManaIcon";

type OwnProps = {
  label: string;
};

export function IdentityHeader({ label }: OwnProps) {
  const parts = useMemo(() => {
    return label.split(" ");
  }, [label]);

  return (
    <Flex gap="2" align="center">
      <span>{parts[0]}</span>
      {parts[1] && (
        <Flex gap="1">
          {parts[1]
            .replaceAll(/\(|\)/g, "")
            .split("")
            .map((colour) => (
              <ManaIcon key={colour} colour={colour} size="small" />
            ))}
        </Flex>
      )}
    </Flex>
  );
}
