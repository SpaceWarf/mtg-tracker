import { Flex, TabNav } from "@radix-ui/themes";
import { ReactElement } from "react";
import { useLocation } from "react-router";

type OwnProps = {
  children?: ReactElement;
};

export function Header({ children }: OwnProps) {
  const location = useLocation();

  return (
    <>
      <Flex className="p-3 mb-3 bg-gray-800" align="end">
        <Flex className="mr-5" align="center">
          <img width="40px" src="/src/assets/img/chalice.png"></img>
          <p>Calice de Marbre</p>
        </Flex>
        <nav>
          <TabNav.Root>
            <TabNav.Link href="/" active={location.pathname === "/"}>
              Games
            </TabNav.Link>
            <TabNav.Link
              href="/players"
              active={location.pathname === "/players"}
            >
              Players
            </TabNav.Link>
            <TabNav.Link href="/decks" active={location.pathname === "/decks"}>
              Decks
            </TabNav.Link>
          </TabNav.Root>
        </nav>
      </Flex>
      {children}
    </>
  );
}
