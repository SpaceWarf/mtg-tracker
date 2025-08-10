import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { useContext } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { AlertType } from "../state/AlertType";

const COLORS: Record<AlertType, "green" | "blue" | "yellow" | "red"> = {
  [AlertType.SUCCESS]: "green",
  [AlertType.INFO]: "blue",
  [AlertType.WARNING]: "yellow",
  [AlertType.ERROR]: "red",
};

const ICONS: Record<AlertType, React.ReactNode> = {
  [AlertType.SUCCESS]: <CheckCircledIcon />,
  [AlertType.INFO]: <InfoCircledIcon />,
  [AlertType.WARNING]: <ExclamationTriangleIcon />,
  [AlertType.ERROR]: <CrossCircledIcon />,
};

export function Alert() {
  const { alerts } = useContext(AlertContext);

  return alerts.map((alert) => (
    <Callout.Root
      key={alert.id}
      className="alert"
      color={COLORS[alert.type]}
      variant="soft"
    >
      <Callout.Icon>{ICONS[alert.type]}</Callout.Icon>
      <Callout.Text>{alert.text}</Callout.Text>
    </Callout.Root>
  ));
}
