"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Same phone number used in the footer, formatted for wa.me (no spaces,
// country code assumed +92 for Pakistan since the footer shows a local
// 03xx number).
const WHATSAPP_NUMBER = "923132906720";
const WHATSAPP_MESSAGE = "Hi! I'd like to know more about your gifts.";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.12h-.01c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.14.82.84-3.06-.2-.31a8.21 8.21 0 0 1-1.26-4.32c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.42a8.16 8.16 0 0 1 2.41 5.81c0 4.54-3.69 8.2-8.14 8.2zm4.5-6.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {visible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-soft transition-transform hover:-translate-y-1"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:-translate-y-1"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}