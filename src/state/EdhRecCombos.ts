// incomplete interface
export interface EdhRecCombo {
  container: {
    json_dict: {
      cardlists: EdhRecComboCard[];
    };
  };
}

// incomplete interface
export interface EdhRecComboCard {
  header: string;
  cardviews: {
    name: string;
    sanitized: string;
  }[];
  href: string;
  combo: {
    comboVote?: {
      bracket: "any" | "3" | "4-5";
    };
    results: string[];
  };
}
