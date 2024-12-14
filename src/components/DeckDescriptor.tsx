import { DbDeck } from "../state/Deck";

type OwnProps = {
  deck: DbDeck;
};

export function DeckDescriptor(props: OwnProps) {
  return (
    <>
      <span>{props.deck.name}</span>
      <br />
      {props.deck.commander && (
        <span className="text-xs">[{props.deck.commander}]</span>
      )}
    </>
  );
}
