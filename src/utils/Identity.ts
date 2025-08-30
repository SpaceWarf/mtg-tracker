import { IDENTITY_LABEL_MAP } from "../state/IdentityLabel";

export function getColourIdentities(size?: number): string[] {
  return Object.keys(IDENTITY_LABEL_MAP).filter((identity) => {
    if (size) {
      return identity.split(/\(|\)/)[1].split("").length === size;
    }
    return true;
  });
}
