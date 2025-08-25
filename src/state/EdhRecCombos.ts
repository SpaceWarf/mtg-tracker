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
  cardviews: EdhRecComboCardView[];
  href: string;
}

// incomplete interface
export interface EdhRecComboCardView {
  name: string;
  sanitized: string;
}
