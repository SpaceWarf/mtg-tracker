import { Flex, TabNav } from "@radix-ui/themes";
import { ReactElement } from "react";
import { Link, useLocation } from "react-router";
import { LoginModal } from "./LoginModal";

type OwnProps = {
  children?: ReactElement;
};

export function Header({ children }: OwnProps) {
  const location = useLocation();

  return (
    <>
      <Flex className="p-3 bg-gray-800" align="end" justify="between">
        <Flex>
          <Flex className="mr-5" align="center">
            <img width="40px" src="/img/chalice.png"></img>
            <p>Calice de Marbre</p>
          </Flex>
          <nav>
            <TabNav.Root>
              <TabNav.Link asChild active={location.pathname === "/"}>
                <Link to="/">Games</Link>
              </TabNav.Link>
              <TabNav.Link asChild active={location.pathname === "/players"}>
                <Link to="/players">Players</Link>
              </TabNav.Link>
              <TabNav.Link asChild active={location.pathname === "/decks"}>
                <Link to="/decks">Decks</Link>
              </TabNav.Link>
            </TabNav.Root>
          </nav>
        </Flex>
        <div>
          <LoginModal />
        </div>
      </Flex>
      {children}
    </>
  );
}
