import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import "../../assets/styles/DataCard.scss";

type OwnProps = {
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "between";
  collapsable?: boolean;
  defaultCollapsed?: boolean;
};

export function DataCard({
  className,
  title,
  icon,
  children,
  direction = "column",
  align = "start",
  collapsable = false,
  defaultCollapsed = false,
}: OwnProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  function handleCollapse() {
    if (collapsable) {
      setCollapsed(!collapsed);
    }
  }

  return (
    <Flex
      className={`data-card ${className}`}
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
            {collapsable && (
              <FontAwesomeIcon icon={faChevronDown} width="15" height="15" />
            )}
            {icon}
            <p>{title}</p>
          </Flex>
          {!collapsed && (
            <Flex
              direction={direction}
              width={direction === "row" ? "auto" : "100%"}
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
