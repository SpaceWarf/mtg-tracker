import "@assets/styles/Header.scss";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Select, TabNav, Text } from "@radix-ui/themes";
import { ReactElement, useContext, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { Year } from "../state/Year";
import { LoginModal } from "./LoginModal";

type OwnProps = {
  children?: ReactElement;
};

export function Header({ children }: OwnProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { year, setYear } = useContext(DataContext);

  useEffect(() => {
    const urlYear = searchParams.get("year");
    if (urlYear && Object.values<string>(Year).includes(urlYear)) {
      setYear(urlYear as Year);
    }
  }, [searchParams, setYear]);

  const handleChangeYear = (value: string) => {
    searchParams.set("year", value);
    setSearchParams(searchParams);
  };

  return (
    <>
      <Flex className="Header p-3 bg-gray-800" align="center" justify="between">
        <Flex align="center" justify="start" flexBasis="25%">
          <img width="40px" src="/img/chalice.png"></img>
          <Text>Calice de Marbre</Text>
          <IconButton
            className="ml-[1px]"
            variant="ghost"
            color="gray"
            onClick={() =>
              window.open("https://github.com/SpaceWarf/mtg-tracker", "_blank")
            }
          >
            <GitHubLogoIcon />
          </IconButton>
          <div className="mt-2 ml-3">
            <Select.Root value={year} onValueChange={handleChangeYear}>
              <Select.Trigger variant="ghost" />
              <Select.Content>
                {Object.values(Year).map((year) => (
                  <Select.Item key={year} value={year}>
                    {year}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Flex>
        <nav>
          <TabNav.Root>
            <TabNav.Link asChild active={location.pathname === "/"}>
              <Link to="/">Games</Link>
            </TabNav.Link>
            <TabNav.Link
              asChild
              active={location.pathname.includes("/players")}
            >
              <Link to="/players">Players</Link>
            </TabNav.Link>
            <TabNav.Link asChild active={location.pathname.includes("/decks")}>
              <Link to="/decks">Decks</Link>
            </TabNav.Link>
            <TabNav.Link
              asChild
              active={location.pathname.includes("/game-changers")}
            >
              <Link to="/game-changers">Game Changers</Link>
            </TabNav.Link>
            {/* <TabNav.Link asChild active={location.pathname === "/brackets"}>
              <Link to="/brackets">Brackets</Link>
            </TabNav.Link> */}
            <TabNav.Link
              asChild
              active={location.pathname.includes("/deck-validator")}
            >
              <Link to="/deck-validator">Deck Validator</Link>
            </TabNav.Link>
            {/* <TabNav.Link `asChild active={location.pathname === "/rewind"}>
              <Link to="/rewind">Rewind</Link>
            </TabNav.Link>` */}
          </TabNav.Root>
        </nav>
        <Flex flexBasis="25%" justify="end">
          <LoginModal />
        </Flex>
      </Flex>
      {children}
    </>
  );
}
