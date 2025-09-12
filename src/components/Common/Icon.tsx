type OwnProps = {
  icon: string;
  className?: string;
  type?: "solid" | "regular";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
};

export function Icon({
  icon,
  className,
  type = "solid",
  size = "md",
  color,
}: OwnProps) {
  return (
    <i
      className={`${
        className ? className : ""
      } fa-${type} fa-${icon} fa-${size}`}
      style={{ color, lineHeight: "1" }}
    ></i>
  );
}
