import { Flex } from "@radix-ui/themes";
import "../../assets/styles/NoResults.scss";
import noResultsImage from "/img/no-results.png";

export function NoResults() {
  return (
    <Flex className="no-results" justify="center" align="center" width="100%">
      <Flex
        className="data-card no-results max-w-[400px]"
        direction="column"
        align="center"
        gap="3"
      >
        <img src={noResultsImage} width="150px" alt="No results" />
        <p>No results found for the applied filters</p>
      </Flex>
    </Flex>
  );
}
