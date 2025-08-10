import { createContext } from "react";
import { Alert } from "../state/Alert";
import { AlertType } from "../state/AlertType";

interface AlertContextProps {
  alerts: Alert[];
  addAlert: (type: AlertType, text: string) => void;
}

export const AlertContext = createContext<AlertContextProps>({
  alerts: [],
  addAlert: () => {},
});
