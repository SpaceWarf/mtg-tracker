import "@assets/styles/Header.scss";
import {
  faBars,
  faCheck,
  faDice,
  faGem,
  faLayerGroup,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  Flex,
  IconButton,
  Select,
  TabNav,
  Text,
} from "@radix-ui/themes";
import { useContext, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { DataContext } from "../contexts/DataContext";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { Year } from "../state/Year";
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
      <Flex className="Header p-3 bg-gray-800" align="center" justify="between">
        <Flex align="center" justify="start" flexBasis="25%">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="soft">
                <FontAwesomeIcon icon={faBars} />
              </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
              <Link to="/">
                <DropdownMenu.Item className="mb-1">
                  <FontAwesomeIcon className="mr-2" icon={faDice} /> Games
                </DropdownMenu.Item>
              </Link>
              <Link to="/players">
                <DropdownMenu.Item className="mb-1">
                  <FontAwesomeIcon className="mr-2" icon={faUser} /> Players
                </DropdownMenu.Item>
              </Link>
              <Link to="/decks">
                <DropdownMenu.Item className="mb-1">
                  <FontAwesomeIcon className="mr-2" icon={faLayerGroup} /> Decks
                </DropdownMenu.Item>
              </Link>
              <Link to="/game-changers">
                <DropdownMenu.Item className="mb-1">
                  <FontAwesomeIcon className="mr-2" icon={faGem} /> Game
                  Changers
                </DropdownMenu.Item>
              </Link>
              <Link to="/deck-validator">
                <DropdownMenu.Item className="mb-1">
                  <FontAwesomeIcon className="mr-2" icon={faCheck} /> Deck
                  Validator
                </DropdownMenu.Item>
              </Link>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
        <Flex align="center">
          <img width="40px" src="/img/chalice.png"></img>
          {windowWidth > 500 && <Text>Calice de Marbre</Text>}
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
        <Flex flexBasis="25%" justify="end">
          <LoginModal />
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex className="Header p-3 bg-gray-800" align="center" justify="between">
      <Flex align="center" justify="start" flexBasis="25%">
        <img width="40px" src="/img/chalice.png"></img>
        {windowWidth > 1050 && <Text>Calice de Marbre</Text>}
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
            <Link to="/">
              <FontAwesomeIcon className="mr-2" icon={faDice} />
              Games
            </Link>
          </TabNav.Link>
          <TabNav.Link asChild active={location.pathname.includes("/players")}>
            <Link to="/players">
              <FontAwesomeIcon className="mr-2" icon={faUsers} />
              Players
            </Link>
          </TabNav.Link>
          <TabNav.Link asChild active={location.pathname.includes("/decks")}>
            <Link to="/decks">
              <FontAwesomeIcon className="mr-2" icon={faLayerGroup} />
              Decks
            </Link>
          </TabNav.Link>
          <TabNav.Link
            asChild
            active={location.pathname.includes("/game-changers")}
          >
            <Link to="/game-changers">
              <FontAwesomeIcon className="mr-2" icon={faGem} />
              Game Changers
            </Link>
          </TabNav.Link>
          {/* <TabNav.Link asChild active={location.pathname === "/brackets"}>
              <Link to="/brackets">Brackets</Link>
            </TabNav.Link> */}
          <TabNav.Link
            asChild
            active={location.pathname.includes("/deck-validator")}
          >
            <Link to="/deck-validator">
              <FontAwesomeIcon className="mr-2" icon={faCheck} />
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
  );
}
