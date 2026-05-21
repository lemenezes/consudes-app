import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [footerProximity, setFooterProximity] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || window.pageYOffset;
      setVisible(y > 300);
      // Detecta proximidade do footer (100px do final)
      const scrollBottom = window.innerHeight + y;
      const docHeight = document.documentElement.scrollHeight;
      setFooterProximity(docHeight - scrollBottom < 120);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={handleClick}
      tabIndex={visible ? 0 : -1}
      className={`
        fixed z-40
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}
        ${footerProximity ? "opacity-60" : ""}
        bg-[#0B1C36]/85 backdrop-blur-md border border-white/10
        hover:border-[#C6A66A]/40 hover:text-white
        text-white/80
        rounded-md shadow-none
        flex items-center justify-center
        w-9 h-9
        right-6 bottom-6
        sm:right-4 sm:bottom-5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A63A]
      `}
      style={{
        fontSize: 0,
        boxShadow: "none",
        transitionProperty: "opacity, transform, box-shadow, border-color, color",
      }}
    >
      <ChevronUp size={22} strokeWidth={2} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
