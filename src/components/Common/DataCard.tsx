import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import "../../assets/styles/DataCard.scss";
import { Icon } from "./Icon";

type OwnProps = {
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "between";
  collapsable?: boolean;
  defaultCollapsed?: boolean;
  error?: boolean;
};

export function DataCard({
  className,
  title,
  icon,
  children,
  direction = "column",
  align = "start",
  collapsable,
  defaultCollapsed,
  error,
}: OwnProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  function handleCollapse() {
    if (collapsable) {
      setCollapsed(!collapsed);
    }
  }

  return (
    <Flex
      className={`data-card h-full ${className} ${error ? "error" : ""}`}
      direction={direction}
      justify={direction === "row" ? "between" : "start"}
      align={direction === "row" ? "center" : "start"}
    >
      {(title || icon) && (
        <>
          <Flex
            className={`title ${collapsable ? "collapsable" : ""} ${
              collapsed ? "collapsed" : ""
            }`}
            align="center"
            gap="3"
            mb={direction === "row" ? "0" : collapsed ? "0" : "5"}
            width="100%"
            onClick={handleCollapse}
          >
            {collapsable && <Icon icon="chevron-down" size="xs" />}
            {icon}
            <p>{title}</p>
          </Flex>
          {!collapsed && (
            <Flex
              direction={direction}
              width={direction === "row" ? "auto" : "100%"}
              height="100%"
              justify={align}
            >
              {children}
            </Flex>
          )}
        </>
      )}
      {!title && !icon && (
        <>
          <Flex
            className="title"
            align="center"
            gap="3"
            mb={direction === "row" ? "0" : "5"}
          >
            {icon}
            <p>{title}</p>
          </Flex>
          {!collapsed && (
            <Flex direction={direction} width="100%" justify={align}>
              {children}
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
}
