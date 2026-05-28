import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Hover detection on interactive elements
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("cursor-pointer"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  if (isHidden) return null;

  return (
    <div className="hidden md:block">
      {/* Central solid dot */}
      <div
        className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-foreground -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Outer circle - now moves directly in sync with the position coordinates */}
      <div
        className={`fixed pointer-events-none z-[9998] rounded-full border border-foreground/60 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out ${
          isHovered ? "w-8 h-8 bg-foreground/10 border-foreground scale-110" : "w-5 h-5"
        }`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </div>
  );
}
