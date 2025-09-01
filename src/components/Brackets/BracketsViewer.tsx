import "@assets/styles/BracketViewer.scss";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { BRACKET_DATA, BracketRuleIcon } from "../../state/BracketData";

const ICON_MAP: Record<BracketRuleIcon, React.ReactNode> = {
  [BracketRuleIcon.CROSS_CIRCLE]: <CrossCircledIcon width="18" height="18" />,
  [BracketRuleIcon.CHECK_CIRCLE]: <CheckCircledIcon width="18" height="18" />,
  [BracketRuleIcon.DOLLAR]: (
    <svg
      fill="#000000"
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8,16a1,1,0,0,0-2,0,5.006,5.006,0,0,0,5,5v1a1,1,0,0,0,2,0V21a5,5,0,0,0,0-10V5a3,3,0,0,1,3,3,1,1,0,0,0,2,0,5.006,5.006,0,0,0-5-5V2a1,1,0,0,0-2,0V3a5,5,0,0,0,0,10v6A3,3,0,0,1,8,16Zm5-3a3,3,0,0,1,0,6ZM8,8a3,3,0,0,1,3-3v6A3,3,0,0,1,8,8Z" />
    </svg>
  ),
};

export function BracketsViewer() {
  return (
    <Flex
      className="p-5 w-full max-w-[1750px] bracket-viewer"
      justify="center"
      gap="5"
    >
      {BRACKET_DATA.map((bracket, index) => (
        <Flex
          key={bracket.bracket}
          className="bracket-container"
          direction="column"
          align="center"
          justify="between"
          mt="7"
        >
          <Flex
            className="bracket-number-container"
            justify="center"
            align="center"
          >
            <Heading className="bracket-number">{index + 1}</Heading>
          </Flex>
          <Heading className="bracket-name">{bracket.bracket}</Heading>
          <Text className="bracket-description">{bracket.description}</Text>
          <div className="bracket-divider" />

          <Flex direction="column" gap="6">
            {bracket.rules.map((rule, index) => (
              <Flex
                key={`${bracket.bracket}-rule-${index}`}
                className="bracket-rule"
                align="center"
                gap="5"
              >
                <div className={rule.colour}>{ICON_MAP[rule.icon]}</div>
                <Text>{rule.text}</Text>
              </Flex>
            ))}
            <div className="bracket-bottom-decorator" />
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}
