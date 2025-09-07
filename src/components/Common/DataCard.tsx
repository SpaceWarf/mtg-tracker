import { Flex } from "@radix-ui/themes";
import "../../assets/styles/DataCard.scss";

type OwnProps = {
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "between";
};

export function DataCard({
  className,
  title,
  icon,
  children,
  direction = "column",
  align = "start",
}: OwnProps) {
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
            className="title"
            align="center"
            gap="3"
            mb={direction === "row" ? "0" : "5"}
          >
            {icon}
            <p>{title}</p>
          </Flex>
          <Flex
            direction={direction}
            width={direction === "row" ? "auto" : "100%"}
            justify={align}
          >
            {children}
          </Flex>
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
          <Flex direction={direction} width="100%" justify={align}>
            {children}
          </Flex>
        </>
      )}
    </Flex>
  );
}
