import { AlertType } from "./AlertType";

export type Alert = {
  id: string;
  type: AlertType;
  text: string;
};
