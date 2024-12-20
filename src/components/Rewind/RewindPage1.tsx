import "@assets/styles/Rewind.scss";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Heading } from "@radix-ui/themes";
import { DbDeck } from "../../state/Deck";
import { DbGame } from "../../state/Game";
import { DbPlayer } from "../../state/Player";
import { getAllGamesWithPlayer } from "../../utils/Player";

type OwnProps = {
  viewer: DbPlayer;
  players: DbPlayer[];
  games: DbGame[];
  decks: DbDeck[];
};

export function RewindPage1({ viewer, games }: OwnProps) {
  const gamesPlayed = getAllGamesWithPlayer(viewer, games);
  const uniqueDays = gamesPlayed.reduce(
    (uniqueDates: string[], game: DbGame) => {
      if (!uniqueDates.includes(game.date)) {
        return [...uniqueDates, game.date];
      }
      return uniqueDates;
    },
    []
  ).length;

  return (
    <div className="Page1 relative w-full h-full">
      <Avatar
        className="absolute top-24 left-28 w-80 h-80"
        src={`/img/pfp/${viewer.id}.webp`}
        fallback={<FontAwesomeIcon icon={faUser} />}
        radius="none"
      />
      <Heading
        className="RewindHeading Heading1 w-full"
        align="center"
        size="9"
      >
        Hi {viewer.name}
      </Heading>
      <Heading
        className="RewindHeading Heading2 w-full"
        align="center"
        size="6"
      >
        2024's been a busy year for our pod
      </Heading>
      <Heading
        className="RewindHeading Heading3 w-full"
        align="center"
        size="8"
      >
        Let's look at some stats!
      </Heading>
      <Heading
        className="RewindHeading Heading4 w-full"
        align="center"
        size="8"
      >
        You've played a whopping <b>{gamesPlayed.length} games</b> this year!
      </Heading>
      <Heading
        className="RewindHeading Heading5 w-full"
        align="center"
        size="5"
      >
        That's {uniqueDays} different days you spent around the people you love
      </Heading>
      <Heading
        className="RewindHeading Heading6 w-full"
        align="center"
        size="5"
      >
        or,
      </Heading>
      <Heading
        className="RewindHeading Heading7 w-full"
        align="center"
        size="5"
      >
        An average of {uniqueDays * 6} hours spent shuffling cards around a
        table
      </Heading>
      <Heading
        id="AnimationEndTrigger"
        className="RewindHeading Heading8 w-full"
        align="center"
        size="8"
      >
        Let's keep it going in the New Year 💪
      </Heading>
    </div>
  );
}
