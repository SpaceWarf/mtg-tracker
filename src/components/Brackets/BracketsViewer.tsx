import "@assets/styles/BracketViewer.scss";
import { Flex, Grid } from "@radix-ui/themes";
import { BRACKET_DATA, BracketRuleIcon } from "../../state/BracketData";
import { getBracketName } from "../../utils/Bracket";
import { Icon } from "../Common/Icon";

const ICON_MAP: Record<BracketRuleIcon, React.ReactNode> = {
  [BracketRuleIcon.CROSS_CIRCLE]: (
    <Icon icon="circle-xmark" type="regular" size="lg" />
  ),
  [BracketRuleIcon.CHECK_CIRCLE]: (
    <Icon icon="circle-check" type="regular" size="lg" />
  ),
  [BracketRuleIcon.DOLLAR]: <Icon icon="dollar-sign" size="lg" />,
};

export function BracketsViewer() {
  return (
    <Grid
      className="p-5 max-w-[1950px] bracket-viewer"
      gap="5"
      columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
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
            <p className="bracket-number">{index + 1}</p>
          </Flex>
          <p className="bracket-name">{getBracketName(bracket.bracket)}</p>
          <p className="bracket-description">{bracket.description}</p>
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
                <p>{rule.text}</p>
              </Flex>
            ))}
            <div className="bracket-bottom-decorator" />
          </Flex>
        </Flex>
      ))}
    </Grid>
  );
}
