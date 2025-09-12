import "@assets/styles/Header.scss";
import {
  DropdownMenu,
  Flex,
  IconButton,
  Select,
  TabNav,
} from "@radix-ui/themes";
import { useContext, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { Year } from "../state/Year";
import { Icon } from "./Common/Icon";
import { LoginModal } from "./LoginModal";

export function Header() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { windowWidth } = useWindowDimensions();

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

  if (windowWidth < 900) {
    return (
      <Flex className="app-header bg-gray-800">
        <Flex className="app-header-content" align="center" justify="between">
          <Flex align="center" justify="start" flexBasis="25%">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton variant="soft">
                  <Icon icon="bars" />
                </IconButton>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                <Link to="/">
                  <DropdownMenu.Item className="mb-1">
                    <Icon icon="dice" />
                    Games
                  </DropdownMenu.Item>
                </Link>
                <Link to="/players">
                  <DropdownMenu.Item className="mb-1">
                    <Icon icon="users" />
                    Players
                  </DropdownMenu.Item>
                </Link>
                <Link to="/decks">
                  <DropdownMenu.Item className="mb-1">
                    <Icon icon="cards-blank" />
                    Decks
                  </DropdownMenu.Item>
                </Link>
                <Link to="/game-changers">
                  <DropdownMenu.Item className="mb-1">
                    <Icon icon="gem" />
                    Game Changers
                  </DropdownMenu.Item>
                </Link>
                <Link to="/brackets">
                  <DropdownMenu.Item className="mb-1">
                    <Icon icon="brackets" />
                    Brackets
                  </DropdownMenu.Item>
                </Link>
                <Link to="/deck-validator">
                  <DropdownMenu.Item className="mb-1">
                    <Icon icon="check-circle" />
                    Deck Validator
                  </DropdownMenu.Item>
                </Link>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
          <Flex align="center">
            <img width="40px" src="/img/chalice.png"></img>
            {windowWidth > 500 && <p>Calice de Marbre</p>}
            <IconButton
              className="ml-[1px]"
              variant="ghost"
              color="gray"
              onClick={() =>
                window.open(
                  "https://github.com/SpaceWarf/mtg-tracker",
                  "_blank"
                )
              }
            >
              <Icon icon="github" type="brands" />
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
          <Flex flexBasis="25%" justify="end">
            <LoginModal />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex className="app-header bg-gray-800">
      <Flex className="app-header-content" align="center" justify="between">
        <Flex align="center" justify="start" flexBasis="25%">
          <img width="40px" src="/img/chalice.png"></img>
          {windowWidth > 1150 && <p>Calice de Marbre</p>}
          <IconButton
            className="ml-[1px]"
            variant="ghost"
            color="gray"
            onClick={() =>
              window.open("https://github.com/SpaceWarf/mtg-tracker", "_blank")
            }
          >
            <Icon icon="github" type="brands" />
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
              <Link to="/">
                <Icon className="mr-1" icon="dice" />
                Games
              </Link>
            </TabNav.Link>
            <TabNav.Link
              asChild
              active={location.pathname.includes("/players")}
            >
              <Link to="/players">
                <Icon className="mr-1" icon="users" />
                Players
              </Link>
            </TabNav.Link>
            <TabNav.Link asChild active={location.pathname.includes("/decks")}>
              <Link to="/decks">
                <Icon className="mr-1" icon="cards-blank" />
                Decks
              </Link>
            </TabNav.Link>
            <TabNav.Link
              asChild
              active={location.pathname.includes("/game-changers")}
            >
              <Link to="/game-changers">
                <Icon className="mr-1" icon="gem" />
                Game Changers
              </Link>
            </TabNav.Link>
            <TabNav.Link asChild active={location.pathname === "/brackets"}>
              <Link to="/brackets">
                <Icon className="mr-1" icon="brackets" />
                Brackets
              </Link>
            </TabNav.Link>
            <TabNav.Link
              asChild
              active={location.pathname.includes("/deck-validator")}
            >
              <Link to="/deck-validator">
                <Icon className="mr-1" icon="check-circle" />
                Deck Validator
              </Link>
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
    </Flex>
  );
}
