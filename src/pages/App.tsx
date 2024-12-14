import { BookmarkIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import "../assets/styles/App.scss";

export function App() {
  return (
    <Button>
      <BookmarkIcon /> Bookmark
    </Button>
  );
}
