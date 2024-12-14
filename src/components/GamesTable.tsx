import { Checkbox, Table } from "@radix-ui/themes";
import { DbGame } from "../state/Game";
import { DeckDescriptor } from "./DeckDescriptor";

type OwnProps = {
  games: DbGame[];
};

export function GamesTable({ games }: OwnProps) {
  return (
    <Table.Root variant="surface" size="1" layout="fixed">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell
            width="100px"
            align="center"
          ></Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="750px" align="center" colSpan={5}>
            Player 1
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="750px" align="center" colSpan={5}>
            Player 2
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="750px" align="center" colSpan={5}>
            Player 3
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="750px" align="center" colSpan={5}>
            Player 4
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            width="250px"
            align="center"
          ></Table.ColumnHeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Deck</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Started?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>T1 Sol Ring?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Won?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Deck</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Started?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>T1 Sol Ring?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Won?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Deck</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Started?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>T1 Sol Ring?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Won?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Deck</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Started?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>T1 Sol Ring?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Won?</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Comments</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {games.map((game) => (
          <Table.Row key={game.id}>
            <Table.RowHeaderCell width="350">{game.date}</Table.RowHeaderCell>
            <Table.Cell>{game.player1.playerObj?.name ?? ""}</Table.Cell>
            <Table.Cell>
              {game.player1.deckObj ? (
                <DeckDescriptor deck={game.player1.deckObj} />
              ) : (
                ""
              )}
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player1.started} />
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player1.t1SolRing} />
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player1.won} />
            </Table.Cell>
            <Table.Cell>{game.player2.playerObj?.name ?? ""}</Table.Cell>
            <Table.Cell>
              {game.player2.deckObj ? (
                <DeckDescriptor deck={game.player2.deckObj} />
              ) : (
                ""
              )}
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player2.started} />
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player2.t1SolRing} />
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player2.won} />
            </Table.Cell>
            <Table.Cell>{game.player3.playerObj?.name ?? ""}</Table.Cell>
            <Table.Cell>
              {game.player3.deckObj ? (
                <DeckDescriptor deck={game.player3.deckObj} />
              ) : (
                ""
              )}
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player3.started} />
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player3.t1SolRing} />
            </Table.Cell>
            <Table.Cell align="center">
              <Checkbox checked={game.player3.won} />
            </Table.Cell>
            <Table.Cell>{game.player4.playerObj?.name ?? ""}</Table.Cell>
            <Table.Cell>
              {game.player3.deckObj ? (
                <DeckDescriptor deck={game.player3.deckObj} />
              ) : (
                ""
              )}
            </Table.Cell>
            <Table.Cell>
              <Checkbox checked={game.player4.started} />
            </Table.Cell>
            <Table.Cell>
              <Checkbox checked={game.player4.t1SolRing} />
            </Table.Cell>
            <Table.Cell>
              <Checkbox checked={game.player4.won} />
            </Table.Cell>
            <Table.Cell>{game.comments}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
