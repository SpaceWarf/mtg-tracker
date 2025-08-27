import { useEffect, useState } from "react";
import { MousePosition } from "../state/MousePosition";

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    distanceToBottom: 0,
    distanceToRight: 0,
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const distanceToBottom = windowHeight - e.clientY;
      const distanceToRight = window.innerWidth - e.clientX;
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
        distanceToBottom,
        distanceToRight,
      });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
}
