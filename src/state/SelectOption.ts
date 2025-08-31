export interface SelectOption {
  value: string;
  label: string;
  image?: string;
  detail?: string;
}

export interface GroupedOption {
  label: string;
  options: SelectOption[];
}
