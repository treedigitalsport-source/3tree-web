"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "textarea" ||
        target.closest(".hoverable")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-brandOrange rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      <motion.div
        className="hidden md:block fixed top-0 left-0 border border-brandDark rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - (isHovered ? 24 : 20),
          y: mousePosition.y - (isHovered ? 24 : 20),
          width: isHovered ? 48 : 40,
          height: isHovered ? 48 : 40,
          backgroundColor: isHovered
            ? "rgba(242, 101, 34, 0.15)"
            : "rgba(242, 101, 34, 0)",
          borderColor: isHovered ? "#F26522" : "#0F172A",
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
        style={{
          backdropFilter: isHovered ? "blur(2px)" : "none",
        }}
      />
    </>
  );
}
