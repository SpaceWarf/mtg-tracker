import { ReactElement, useState } from "react";
import { uuidv7 } from "uuidv7";
import { Alert } from "../state/Alert";
import { AlertType } from "../state/AlertType";
import { AlertContext } from "./AlertContext";

export function AlertProvider({ children }: { children: ReactElement }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  function addAlert(type: AlertType, text: string): void {
    const id = uuidv7();
    const alert: Alert = {
      id,
      type,
      text,
    };
    console.log("addAlert", alert);
    setAlerts([...alerts, alert]);
    // setTimeout(() => {
    //   setAlerts(alerts.filter((a) => a.id !== id));
    // }, 3000);
  }

  return (
    <AlertContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
