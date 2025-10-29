// ResponsiveToastContainer.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { ToastContainer, type ToastPosition } from "react-toastify";

export default function ResponsiveToastContainer() {
  const [position, setPosition] = useState<ToastPosition>("top-right");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setPosition(mq.matches ? "bottom-center" : "top-right");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isBottom = position.startsWith("bottom");
  const style: CSSProperties = {
    zIndex: 999999,
    ...(isBottom
      ? { bottom: "max(env(safe-area-inset-bottom), 16px)", top: "auto" }
      : {}), // don't set bottom for top positions
  };

  return (
    <ToastContainer
      position={position}
      style={style}
      newestOnTop
      limit={3}
      closeOnClick
      pauseOnFocusLoss
      draggable
      theme="colored"
    />
  );
}
