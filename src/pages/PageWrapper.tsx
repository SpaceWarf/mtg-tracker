import { Flex } from "@radix-ui/themes";
import { ReactElement } from "react";
import { Header } from "../components/Header";

type OwnProps = {
  children?: ReactElement;
};

export function PageWrapper({ children }: OwnProps) {
  return (
    <>
      <Header />
      <Flex direction="column" align="center">
        {children}
      </Flex>
    </>
  );
}
